import "server-only";
import { createHash } from "node:crypto";
import { siteUrl } from "@/lib/whatsapp";

export const CONSENT_VERSION = "2026-11-v1";

export type LeadInput = {
  name: string;
  phone: string;
  email?: string;
  interest?: string;
  preferred_time?: string;
  message?: string;
  source_page?: string;
  language: "en" | "ta";
  product?: string;
  listing_slug?: string;
  listing_title?: string;
  details: Record<string, string>;
};

/** One-way hash of the visitor IP for rate limiting. The raw IP is never stored. */
export function hashIp(ip: string) {
  const salt = process.env.LEAD_HASH_SALT ?? "subramaniam-site";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 32);
}

/** Indian mobile number: 10 digits starting 6-9, with optional +91 or 0. Returns the 10 digits or null. */
export function normalisePhone(raw: string) {
  let d = raw.replace(/\D/g, "");
  if (d.length === 12 && d.startsWith("91")) d = d.slice(2);
  if (d.length === 11 && d.startsWith("0")) d = d.slice(1);
  return /^[6-9]\d{9}$/.test(d) ? d : null;
}

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

const label: Record<string, string> = {
  health: "Health insurance", life: "Life insurance", vehicle: "Vehicle insurance",
  corporate: "Corporate and group insurance", property: "Property", other: "Something else",
};

/**
 * Emails the client about a new lead through Resend. Never throws: the lead is
 * already saved, so a failed email is only logged.
 */
export async function sendLeadEmail(lead: LeadInput) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.error("Lead email not sent: RESEND_API_KEY is not set.");
    return;
  }
  const to = (process.env.LEAD_ALERT_TO ?? "subramaniam9757@gmail.com").split(",").map((s) => s.trim()).filter(Boolean);
  const from = process.env.LEAD_ALERT_FROM ?? "Website enquiries <onboarding@resend.dev>";
  const base = siteUrl();
  const what = lead.listing_title
    ? `Property: ${lead.listing_title}`
    : label[lead.product ?? lead.interest ?? ""] ?? lead.interest ?? "General enquiry";

  const rows: [string, string][] = [
    ["Name", lead.name],
    ["Phone", `+91 ${lead.phone}`],
    ["Email", lead.email ?? ""],
    ["Interested in", what],
    ["Best time", lead.preferred_time ?? ""],
    ...Object.entries(lead.details).map(([k, v]) => [k, v] as [string, string]),
    ["Message", lead.message ?? ""],
    ["Language", lead.language === "ta" ? "Tamil" : "English"],
    ["Page", lead.source_page ? `${base}${lead.source_page}` : ""],
  ].filter(([, v]) => v) as [string, string][];

  const html = `<div style="font-family:Arial,sans-serif;font-size:15px;color:#1b1a1f">
<h2 style="margin:0 0 12px">New enquiry from the website</h2>
<table cellpadding="6" style="border-collapse:collapse">${rows
    .map(([k, v]) => `<tr><td style="color:#4a4750;vertical-align:top">${esc(k)}</td><td><strong>${esc(v)}</strong></td></tr>`)
    .join("")}</table>
<p style="margin:18px 0">
<a href="tel:+91${lead.phone}" style="background:#c94312;color:#fff;padding:10px 18px;border-radius:999px;text-decoration:none">Call ${esc(lead.name)}</a>
&nbsp;<a href="https://wa.me/91${lead.phone}" style="background:#1f7a46;color:#fff;padding:10px 18px;border-radius:999px;text-decoration:none">WhatsApp</a>
</p>
${base ? `<p><a href="${base}/admin/leads">Open all leads in the admin</a></p>` : ""}
<p style="color:#4a4750;font-size:12px">The visitor agreed to be contacted about this enquiry (consent ${CONSENT_VERSION}).</p></div>`;
  const text = rows.map(([k, v]) => `${k}: ${v}`).join("\n");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to, subject: `New enquiry: ${lead.name} (${what})`, html, text }),
    });
    if (!res.ok) console.error("Lead email failed:", res.status, await res.text());
    else console.log("Lead email sent:", (await res.json()).id);
  } catch (e) {
    console.error("Lead email failed:", e instanceof Error ? e.message : e);
  }
}
