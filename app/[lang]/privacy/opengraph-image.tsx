import { getDictionary } from "@/app/[lang]/dictionaries";
import { ogAlt, ogSize, renderOg } from "@/lib/og";

export const alt = ogAlt;
export const size = ogSize;
export const contentType = "image/png";

export default async function Image() {
  // The image renderer cannot shape Tamil script correctly, so preview images use
  // the English text on both languages. The page's og:title stays in Tamil.
  const lang = "en" as const;
  const d = await getDictionary(lang);
  return renderOg({ lang, eyebrow: d.meta.siteName, title: d.legal.privacy.title });
}
