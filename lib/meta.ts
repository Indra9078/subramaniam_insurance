import type { Metadata } from "next";
import { siteUrl } from "@/lib/whatsapp";

/**
 * Search engines may index the site only when SITE_INDEXING=on (set at launch,
 * Stage 9). Until then every page carries noindex and robots.txt blocks crawling,
 * because the site still shows placeholders and sample listings.
 */
export const indexingOn = () => process.env.SITE_INDEXING === "on";

/** Base for absolute URLs in metadata. Falls back to localhost in development. */
export const metadataBase = () => new URL(siteUrl() || "http://localhost:3000");

/** Title, description, canonical URL and language alternates for an inner page. `path` starts with "/" (or is ""). */
export function pageMetadata(lang: string, path: string, title: string, description: string): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: `/${lang}${path}`,
      languages: { en: `/en${path}`, ta: `/ta${path}`, "x-default": `/en${path}` },
    },
    // Page-level openGraph replaces the layout's, so repeat the shared fields.
    openGraph: {
      type: "website",
      siteName: lang === "ta" ? "ஏ. சுப்ரமணியம்" : "A. Subramaniam",
      locale: lang === "ta" ? "ta_IN" : "en_IN",
      title,
      description,
      url: `/${lang}${path}`,
    },
    twitter: { title, description },
  };
}

/** Safe JSON-LD for a <script type="application/ld+json"> tag. */
export const jsonLd = (data: unknown) => ({ __html: JSON.stringify(data).replace(/</g, "\\u003c") });
