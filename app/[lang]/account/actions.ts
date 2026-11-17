"use server";

import { headers } from "next/headers";
import { after } from "next/server";
import { redirect } from "next/navigation";
import { createSessionClient } from "@/lib/supabase/server";
import { supabaseConfigProblem, PHOTO_BUCKET } from "@/lib/supabase/env";
import { getCurrentUser, requireUser } from "@/lib/account/auth";
import { clean, isEmail, isUuid, lines, phone10, safeNext } from "@/lib/validate";
import { sendAdminAlert } from "@/lib/notify";
import { slugify } from "@/lib/admin/form";
import { listingTypes, type ListingType } from "@/lib/types";

const loc = (l: string) => (l === "ta" ? "ta" : "en");

// ---------------------------------------------------------------------------
// Sign up, log in, log out
// ---------------------------------------------------------------------------
export type AuthState = {
  error?: "invalid" | "unconfirmed" | "exists" | "weak" | "name" | "phone" | "email" | "consent" | "rate" | "closed" | "generic";
  info?: "checkEmail";
};

export async function signInUser(lang: string, next: string, _prev: AuthState, fd: FormData): Promise<AuthState> {
  const email = clean(fd.get("email"), 254).toLowerCase();
  const password = String(fd.get("password") ?? "").slice(0, 200);
  if (!isEmail(email)) return { error: "email" };
  if (!password) return { error: "invalid" };
  if (supabaseConfigProblem()) return { error: "generic" };

  const supabase = await createSessionClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    if (error.code === "invalid_credentials") return { error: "invalid" };
    if (error.code === "email_not_confirmed") return { error: "unconfirmed" };
    if (error.status === 429) return { error: "rate" };
    console.error("User login failed:", error.code, error.status);
    return { error: "generic" };
  }
  await supabase.rpc("ensure_profile");
  redirect(safeNext(next, `/${loc(lang)}/account`));
}

export async function signUpUser(lang: string, next: string, _prev: AuthState, fd: FormData): Promise<AuthState> {
  const name = clean(fd.get("name"), 80);
  const phone = phone10(clean(fd.get("phone"), 20));
  const email = clean(fd.get("email"), 254).toLowerCase();
  const password = String(fd.get("password") ?? "").slice(0, 200);
  if (name.length < 2) return { error: "name" };
  if (!phone) return { error: "phone" };
  if (!isEmail(email)) return { error: "email" };
  if (password.length < 8) return { error: "weak" };
  if (fd.get("consent") !== "on") return { error: "consent" };
  if (supabaseConfigProblem()) return { error: "generic" };

  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const target = safeNext(next, `/${loc(lang)}/account`);

  const supabase = await createSessionClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: name, phone },
      emailRedirectTo: `${proto}://${host}/auth/callback?next=${encodeURIComponent(target)}`,
    },
  });
  if (error) {
    if (error.code === "user_already_exists" || /already registered/i.test(error.message)) return { error: "exists" };
    if (error.code === "signup_disabled") return { error: "closed" };
    if (error.code === "weak_password") return { error: "weak" };
    if (error.status === 429 || error.code === "over_email_send_rate_limit") return { error: "rate" };
    console.error("User sign-up failed:", error.code, error.status);
    return { error: "generic" };
  }
  // With email confirmation on, an existing address comes back as a user with no identities.
  if (data.user && data.user.identities && data.user.identities.length === 0) return { error: "exists" };
  if (data.session) {
    await supabase.rpc("ensure_profile");
    redirect(target);
  }
  return { info: "checkEmail" };
}

export async function signOutUser(lang: string) {
  const supabase = await createSessionClient();
  await supabase.auth.signOut();
  redirect(`/${loc(lang)}/account/login`);
}

// ---------------------------------------------------------------------------
// Profile
// ---------------------------------------------------------------------------
export type ProfileState = { ok?: boolean; error?: "name" | "phone" | "generic" };

export async function updateProfile(lang: string, _prev: ProfileState, fd: FormData): Promise<ProfileState> {
  const user = await requireUser(loc(lang), `/${loc(lang)}/account`);
  const name = clean(fd.get("name"), 80);
  const rawPhone = clean(fd.get("phone"), 20);
  const phone = rawPhone ? phone10(rawPhone) : "";
  if (name.length < 2) return { error: "name" };
  if (phone === null) return { error: "phone" };
  const { error } = await user.supabase.from("profiles").update({ full_name: name, phone }).eq("user_id", user.id);
  if (error) return { error: "generic" };
  return { ok: true };
}

// ---------------------------------------------------------------------------
// Property listings submitted by visitors (they wait for admin approval)
// ---------------------------------------------------------------------------
export type ListingState = { error?: "title" | "location" | "type" | "limit" | "locked" | "generic" };

function listingColumns(lang: string, fd: FormData) {
  const side = loc(lang);
  const type = clean(fd.get("type"), 20) as ListingType;
  const put = (key: string, max: number) => ({ [`${key}_${side}`]: clean(fd.get(key), max) });
  return {
    type: (listingTypes.includes(type) ? type : "") as ListingType | "",
    cols: {
      ...put("title", 120), ...put("location", 120), ...put("price", 60), ...put("size", 60), ...put("description", 3000),
      [`features_${side}`]: lines(fd.get("features"), 12, 120),
    } as Record<string, string | string[]>,
  };
}

export async function saveMyListing(lang: string, id: string | null, _prev: ListingState, fd: FormData): Promise<ListingState> {
  const user = await requireUser(loc(lang), `/${loc(lang)}/account`);
  const { type, cols } = listingColumns(lang, fd);
  const side = loc(lang);
  if (!type) return { error: "type" };
  if (String(cols[`title_${side}`]).length < 3) return { error: "title" };
  if (String(cols[`location_${side}`]).length < 2) return { error: "location" };

  if (id) {
    if (!isUuid(id)) return { error: "generic" };
    const { data, error } = await user.supabase.from("listings").update({ type, ...cols }).eq("id", id).select("id");
    if (error) return { error: /rate_limited|too_many/.test(error.message) ? "limit" : "generic" };
    if (!data?.length) return { error: "locked" };
    redirect(`/${side}/account/listings/${id}?saved=1`);
  }

  const slug = `${slugify(String(cols[`title_${side}`]) || "property")}-${Math.random().toString(36).slice(2, 7)}`;
  const { data, error } = await user.supabase.from("listings").insert({ slug, type, status: "pending", ...cols }).select("id").single();
  if (error) {
    if (/rate_limited|too_many/.test(error.message)) return { error: "limit" };
    console.error("Listing submit failed:", error.message);
    return { error: "generic" };
  }
  const profile = await user.supabase.from("profiles").select("full_name, phone").eq("user_id", user.id).maybeSingle();
  after(() =>
    sendAdminAlert({
      subject: `New property submitted: ${cols[`title_${side}`]}`,
      title: "A visitor submitted a property for approval",
      rows: [
        ["Title", String(cols[`title_${side}`])],
        ["Type", type],
        ["Location", String(cols[`location_${side}`])],
        ["Price", String(cols[`price_${side}`] ?? "")],
        ["Submitted by", `${profile.data?.full_name ?? ""} ${profile.data?.phone ?? ""}`.trim()],
      ],
      linkPath: `/admin/listings/${data.id}`,
      linkLabel: "Review in the admin",
    }),
  );
  redirect(`/${side}/account/listings/${data.id}?created=1`);
}

export async function deleteMyListing(lang: string, id: string) {
  const user = await requireUser(loc(lang), `/${loc(lang)}/account`);
  if (!isUuid(id)) redirect(`/${loc(lang)}/account`);
  const { data: photos } = await user.supabase.from("listing_photos").select("path").eq("listing_id", id);
  if (photos?.length) await user.supabase.storage.from(PHOTO_BUCKET).remove(photos.map((p) => p.path));
  await user.supabase.from("listings").delete().eq("id", id);
  redirect(`/${loc(lang)}/account`);
}

export async function addMyPhoto(listingId: string, path: string) {
  const user = await getCurrentUser();
  if (!user || !isUuid(listingId) || !path.startsWith(`${listingId}/`) || path.length > 200) throw new Error("Not allowed");
  const { count } = await user.supabase.from("listing_photos").select("id", { count: "exact", head: true }).eq("listing_id", listingId);
  const { error } = await user.supabase.from("listing_photos").insert({ listing_id: listingId, path, sort: count ?? 0 });
  if (error) throw new Error(error.message);
}

export async function deleteMyPhoto(photoId: string) {
  const user = await getCurrentUser();
  if (!user || !isUuid(photoId)) throw new Error("Not allowed");
  const { data } = await user.supabase.from("listing_photos").select("path").eq("id", photoId).single();
  if (data) await user.supabase.storage.from(PHOTO_BUCKET).remove([data.path]);
  await user.supabase.from("listing_photos").delete().eq("id", photoId);
}

export async function reorderMyPhotos(listingId: string, ids: string[]) {
  const user = await getCurrentUser();
  if (!user || !isUuid(listingId) || ids.length > 12 || !ids.every(isUuid)) throw new Error("Not allowed");
  await Promise.all(ids.map((id, sort) => user.supabase.from("listing_photos").update({ sort }).eq("id", id).eq("listing_id", listingId)));
}

// ---------------------------------------------------------------------------
// Insurance plan requests
// ---------------------------------------------------------------------------
export type RequestState = { ok?: boolean; error?: "phone" | "consent" | "duplicate" | "rate" | "login" | "generic" };

export async function requestPlan(lang: string, planId: string, planName: string, _prev: RequestState, fd: FormData): Promise<RequestState> {
  const user = await getCurrentUser();
  if (!user) return { error: "login" };
  if (!isUuid(planId)) return { error: "generic" };
  const phone = phone10(clean(fd.get("phone"), 20));
  if (!phone) return { error: "phone" };
  if (fd.get("consent") !== "on") return { error: "consent" };
  const time = clean(fd.get("preferred_time"), 40);
  const message = clean(fd.get("message"), 1000);

  const { error } = await user.supabase.rpc("submit_insurance_request", {
    p_product: planId, p_phone: phone, p_time: time || null, p_message: message || null, p_consent: true,
  });
  if (error) {
    if (/duplicate_request/.test(error.message)) return { error: "duplicate" };
    if (/rate_limited/.test(error.message)) return { error: "rate" };
    if (/invalid_phone/.test(error.message)) return { error: "phone" };
    if (/consent_required/.test(error.message)) return { error: "consent" };
    if (/not_signed_in/.test(error.message)) return { error: "login" };
    console.error("Plan request failed:", error.message);
    return { error: "generic" };
  }
  const profile = await user.supabase.from("profiles").select("full_name").eq("user_id", user.id).maybeSingle();
  after(() =>
    sendAdminAlert({
      subject: `New plan request: ${planName}`,
      title: "A visitor requested an insurance plan",
      rows: [
        ["Plan", planName],
        ["Name", profile.data?.full_name ?? ""],
        ["Phone", `+91 ${phone}`],
        ["Email", user.email],
        ["Best time", time],
        ["Message", message],
        ["Language", lang === "ta" ? "Tamil" : "English"],
      ],
      linkPath: "/admin/requests",
      linkLabel: "Open requests in the admin",
    }),
  );
  return { ok: true };
}
