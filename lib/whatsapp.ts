import { site } from "@/lib/site";

/** Public site address for links in WhatsApp messages and emails (no trailing slash). */
export function siteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, "");
  if (explicit) return explicit;
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  return vercel ? `https://${vercel}` : "";
}

/** WhatsApp click-to-chat link with a message already typed in. */
export const waLink = (text: string) => `${site.whatsappHref}?text=${encodeURIComponent(text)}`;

/** Fills {placeholders} in a dictionary string. */
export const fill = (template: string, values: Record<string, string>) =>
  template.replace(/\{(\w+)\}/g, (_, k: string) => values[k] ?? "");
