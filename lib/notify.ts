import "server-only";
import { siteUrl } from "@/lib/whatsapp";

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/**
 * Emails the client about something that needs attention (new property submission,
 * new plan request). Never throws: the data is already saved, so a failed email is only logged.
 */
export async function sendAdminAlert(opts: { subject: string; title: string; rows: [string, string][]; linkPath: string; linkLabel: string }) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.error("Alert email not sent: RESEND_API_KEY is not set.");
    return;
  }
  const to = (process.env.LEAD_ALERT_TO ?? "subramaniam9757@gmail.com").split(",").map((s) => s.trim()).filter(Boolean);
  const from = process.env.LEAD_ALERT_FROM ?? "Website enquiries <onboarding@resend.dev>";
  const base = siteUrl();
  const rows = opts.rows.filter(([, v]) => v);
  const html = `<div style="font-family:Arial,sans-serif;font-size:15px;color:#1b1a1f">
<h2 style="margin:0 0 12px">${esc(opts.title)}</h2>
<table cellpadding="6" style="border-collapse:collapse">${rows
    .map(([k, v]) => `<tr><td style="color:#4a4750;vertical-align:top">${esc(k)}</td><td><strong>${esc(v)}</strong></td></tr>`)
    .join("")}</table>
${base ? `<p style="margin:18px 0"><a href="${base}${opts.linkPath}" style="background:#c2410c;color:#fff;padding:10px 18px;border-radius:999px;text-decoration:none">${esc(opts.linkLabel)}</a></p>` : ""}</div>`;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to, subject: opts.subject, html, text: rows.map(([k, v]) => `${k}: ${v}`).join("\n") }),
    });
    if (!res.ok) console.error("Alert email failed:", res.status, await res.text());
  } catch (e) {
    console.error("Alert email failed:", e instanceof Error ? e.message : e);
  }
}
