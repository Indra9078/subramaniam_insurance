"use server";

import { headers } from "next/headers";
import { after } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabaseKey, supabaseUrl } from "@/lib/supabase/env";
import { CONSENT_VERSION, hashIp, normalisePhone, sendLeadEmail, type LeadInput } from "@/lib/leads";

export type LeadState = {
  ok?: boolean;
  error?: "name" | "phone" | "email" | "consent" | "rate" | "generic";
  time?: string;
};

const str = (fd: FormData, k: string, max = 200) => String(fd.get(k) ?? "").trim().slice(0, max);
const ALLOWED_DETAILS = /^[a-zA-Z][a-zA-Z0-9 _-]{0,40}$/;

/** Saves a website enquiry through the submit_lead database function, then emails the client. */
export async function submitLead(_prev: LeadState, fd: FormData): Promise<LeadState> {
  // Bots: a hidden field people never fill, and forms sent within 3 seconds of loading.
  const started = Number(fd.get("_t"));
  if (str(fd, "website") || (started && Date.now() - started < 3000)) {
    return { ok: true, time: "any" };
  }

  const name = str(fd, "name", 80);
  const phone = normalisePhone(str(fd, "phone", 20));
  const email = str(fd, "email", 120);
  if (name.length < 2) return { error: "name" };
  if (!phone) return { error: "phone" };
  if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { error: "email" };
  if (fd.get("consent") !== "on") return { error: "consent" };

  // Extra product or property fields arrive as "d:<label>".
  const details: Record<string, string> = {};
  for (const [k, v] of fd.entries()) {
    if (!k.startsWith("d:")) continue;
    const key = k.slice(2);
    const value = String(v).trim().slice(0, 120);
    if (value && ALLOWED_DETAILS.test(key) && Object.keys(details).length < 8) details[key] = value;
  }

  const lang = str(fd, "language") === "ta" ? "ta" : "en";
  const lead: LeadInput = {
    name,
    phone,
    email: email || undefined,
    interest: str(fd, "interest", 40) || undefined,
    preferred_time: str(fd, "preferred_time", 40) || undefined,
    message: str(fd, "message", 1000) || undefined,
    source_page: str(fd, "source_page", 200) || undefined,
    language: lang,
    product: str(fd, "product", 40) || undefined,
    listing_slug: str(fd, "listing_slug", 80) || undefined,
    listing_title: str(fd, "listing_title", 160) || undefined,
    details,
  };

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "";

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { error } = await supabase.rpc("submit_lead", {
    lead: { ...lead, consent: true, consent_version: CONSENT_VERSION, ip_hash: ip ? hashIp(ip) : null },
  });
  if (error) {
    const known = ["invalid_name", "invalid_phone", "invalid_email", "consent_required", "rate_limited"];
    const code = known.find((k) => error.message.includes(k));
    if (!code) console.error("submit_lead failed:", error.code, error.message);
    if (code === "rate_limited") return { error: "rate" };
    if (code === "invalid_name") return { error: "name" };
    if (code === "invalid_phone") return { error: "phone" };
    if (code === "invalid_email") return { error: "email" };
    if (code === "consent_required") return { error: "consent" };
    return { error: "generic" };
  }

  // Email after the visitor already has their answer.
  after(() => sendLeadEmail(lead));
  return { ok: true, time: lead.preferred_time ?? "any" };
}
