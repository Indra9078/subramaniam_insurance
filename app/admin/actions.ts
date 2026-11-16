"use server";

import { redirect } from "next/navigation";
import { revalidatePath, updateTag } from "next/cache";
import { createSessionClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin/auth";
import { bool, int, lines, slugify, text, type FormState } from "@/lib/admin/form";
import { TAGS } from "@/lib/data";
import { PHOTO_BUCKET, supabaseConfigProblem } from "@/lib/supabase/env";
import { faqCategories, listingTypes, type FaqCategory, type ListingType } from "@/lib/types";

// ---------------------------------------------------------------------------
// Login and logout
// ---------------------------------------------------------------------------
export async function signIn(_prev: FormState, fd: FormData): Promise<FormState> {
  const email = text(fd, "email");
  const password = String(fd.get("password") ?? "");
  if (!email || !password) return { error: "Enter your email and password." };

  const problem = supabaseConfigProblem();
  if (problem) {
    console.error("Admin login: configuration problem:", problem);
    return { error: `Login is not set up correctly on this site: ${problem}` };
  }

  const supabase = await createSessionClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    console.error("Admin login failed:", error.code, error.status, error.message);
    if (error.code === "invalid_credentials") return { error: "Email or password is incorrect." };
    if (error.code === "email_not_confirmed")
      return { error: "This email is not confirmed yet. Confirm the user in Supabase (Authentication, Users)." };
    if (error.status === 429) return { error: "Too many attempts. Wait a few minutes and try again." };
    return { error: `Could not reach the login service (${error.code ?? error.status ?? "error"}: ${error.message}).` };
  }

  const { data: row } = await supabase.from("admins").select("email").maybeSingle();
  if (!row) {
    await supabase.auth.signOut();
    return { error: "This account does not have admin access." };
  }
  redirect("/admin");
}

export async function signOut() {
  const supabase = await createSessionClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

/** Refresh cached listing data and the listing pages in both languages. */
function refreshListings(...slugs: (string | null | undefined)[]) {
  updateTag(TAGS.listings);
  for (const lang of ["en", "ta"]) {
    revalidatePath(`/${lang}/real-estate`);
    for (const slug of slugs) if (slug) revalidatePath(`/${lang}/real-estate/${slug}`);
  }
}

async function slugOf(supabase: Awaited<ReturnType<typeof requireAdmin>>["supabase"], listingId: string) {
  const { data } = await supabase.from("listings").select("slug").eq("id", listingId).single();
  return data?.slug as string | undefined;
}

// ---------------------------------------------------------------------------
// Listings
// ---------------------------------------------------------------------------
function listingFields(fd: FormData) {
  const type = text(fd, "type") as ListingType;
  const status = text(fd, "status");
  return {
    type: listingTypes.includes(type) ? type : "plot",
    status: ["draft", "published", "sold"].includes(status) ? status : "draft",
    featured: bool(fd, "featured"),
    sort: int(fd, "sort"),
    title_en: text(fd, "title_en"),
    title_ta: text(fd, "title_ta"),
    location_en: text(fd, "location_en"),
    location_ta: text(fd, "location_ta"),
    price_en: text(fd, "price_en"),
    price_ta: text(fd, "price_ta"),
    size_en: text(fd, "size_en"),
    size_ta: text(fd, "size_ta"),
    description_en: text(fd, "description_en"),
    description_ta: text(fd, "description_ta"),
    features_en: lines(fd, "features_en"),
    features_ta: lines(fd, "features_ta"),
    // Saving from the admin means the content is real, not seed sample data.
    is_sample: false,
  };
}

export async function saveListing(id: string | null, _prev: FormState, fd: FormData): Promise<FormState> {
  const { supabase } = await requireAdmin();
  const fields = listingFields(fd);
  if (!fields.title_en) return { error: "English title is required." };
  const slug = slugify(text(fd, "slug") || fields.title_en);

  if (id) {
    const { data: old } = await supabase.from("listings").select("slug").eq("id", id).single();
    const { error } = await supabase.from("listings").update({ ...fields, slug }).eq("id", id);
    if (error) return { error: friendly(error.message) };
    refreshListings(slug, old?.slug);
    return { ok: "Saved." };
  }
  const { data, error } = await supabase
    .from("listings")
    .insert({ ...fields, slug })
    .select("id")
    .single();
  if (error) return { error: friendly(error.message) };
  refreshListings(slug);
  redirect(`/admin/listings/${data.id}?created=1`);
}

export async function deleteListing(id: string) {
  const { supabase } = await requireAdmin();
  const { data: listing } = await supabase.from("listings").select("slug").eq("id", id).single();
  const { data: photos } = await supabase.from("listing_photos").select("path").eq("listing_id", id);
  if (photos?.length) {
    await supabase.storage.from(PHOTO_BUCKET).remove(photos.map((p) => p.path));
  }
  await supabase.from("listings").delete().eq("id", id);
  refreshListings(listing?.slug);
  redirect("/admin/listings");
}

export async function addPhoto(listingId: string, path: string) {
  const { supabase } = await requireAdmin();
  if (!path.startsWith(`${listingId}/`)) throw new Error("Invalid photo path");
  const { count } = await supabase
    .from("listing_photos")
    .select("id", { count: "exact", head: true })
    .eq("listing_id", listingId);
  const { error } = await supabase
    .from("listing_photos")
    .insert({ listing_id: listingId, path, sort: count ?? 0 });
  if (error) throw new Error(error.message);
  refreshListings(await slugOf(supabase, listingId));
}

export async function deletePhoto(photoId: string) {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("listing_photos").select("path, listing_id").eq("id", photoId).single();
  if (data) await supabase.storage.from(PHOTO_BUCKET).remove([data.path]);
  await supabase.from("listing_photos").delete().eq("id", photoId);
  refreshListings(data ? await slugOf(supabase, data.listing_id) : null);
}

/** Saves a new photo order. `ids` is the full list of photo ids in display order. */
export async function reorderPhotos(listingId: string, ids: string[]) {
  const { supabase } = await requireAdmin();
  await Promise.all(
    ids.map((id, sort) =>
      supabase.from("listing_photos").update({ sort }).eq("id", id).eq("listing_id", listingId),
    ),
  );
  refreshListings(await slugOf(supabase, listingId));
}

// ---------------------------------------------------------------------------
// Testimonials
// ---------------------------------------------------------------------------
export async function saveTestimonial(id: string | null, _prev: FormState, fd: FormData): Promise<FormState> {
  const { supabase } = await requireAdmin();
  const fields = {
    name: text(fd, "name"),
    area: text(fd, "area"),
    quote_en: text(fd, "quote_en"),
    quote_ta: text(fd, "quote_ta"),
    permission_received: bool(fd, "permission_received"),
    permission_date: text(fd, "permission_date") || null,
    published: bool(fd, "published"),
    sort: int(fd, "sort"),
  };
  if (!fields.name) return { error: "Client name is required." };
  if (!fields.quote_en && !fields.quote_ta) return { error: "Add the quote in English or Tamil." };
  if (fields.published && !(fields.permission_received && fields.permission_date)) {
    return {
      error: "To publish, tick \"Written permission received\" and enter the date you received it.",
    };
  }
  const { error } = id
    ? await supabase.from("testimonials").update(fields).eq("id", id)
    : await supabase.from("testimonials").insert(fields);
  if (error) return { error: friendly(error.message) };
  updateTag(TAGS.testimonials);
  if (!id) redirect("/admin/testimonials");
  return { ok: "Saved." };
}

export async function deleteTestimonial(id: string) {
  const { supabase } = await requireAdmin();
  await supabase.from("testimonials").delete().eq("id", id);
  updateTag(TAGS.testimonials);
  redirect("/admin/testimonials");
}

// ---------------------------------------------------------------------------
// FAQs
// ---------------------------------------------------------------------------
export async function saveFaq(id: string | null, _prev: FormState, fd: FormData): Promise<FormState> {
  const { supabase } = await requireAdmin();
  const category = text(fd, "category") as FaqCategory;
  const fields = {
    category: faqCategories.includes(category) ? category : "general",
    question_en: text(fd, "question_en"),
    question_ta: text(fd, "question_ta"),
    answer_en: text(fd, "answer_en"),
    answer_ta: text(fd, "answer_ta"),
    sort: int(fd, "sort"),
    published: bool(fd, "published"),
    show_on_home: bool(fd, "show_on_home"),
    is_sample: false,
  };
  if (!fields.question_en || !fields.answer_en) return { error: "English question and answer are required." };
  const { error } = id
    ? await supabase.from("faqs").update(fields).eq("id", id)
    : await supabase.from("faqs").insert(fields);
  if (error) return { error: friendly(error.message) };
  updateTag(TAGS.faqs);
  if (!id) redirect("/admin/faqs");
  return { ok: "Saved." };
}

export async function deleteFaq(id: string) {
  const { supabase } = await requireAdmin();
  await supabase.from("faqs").delete().eq("id", id);
  updateTag(TAGS.faqs);
  redirect("/admin/faqs");
}

// ---------------------------------------------------------------------------
// Leads
// ---------------------------------------------------------------------------
export async function setLeadStatus(id: string, fd: FormData) {
  const { supabase } = await requireAdmin();
  const status = text(fd, "status");
  if (!["new", "contacted", "closed"].includes(status)) return;
  await supabase.from("leads").update({ status, notes: text(fd, "notes") || null }).eq("id", id);
  redirect("/admin/leads");
}

function friendly(message: string) {
  if (message.includes("listings_slug_key")) return "Another listing already uses this web address (slug). Change the slug.";
  if (message.includes("testimonial_permission")) return "A testimonial can only be published with written permission and a date.";
  return `Could not save: ${message}`;
}
