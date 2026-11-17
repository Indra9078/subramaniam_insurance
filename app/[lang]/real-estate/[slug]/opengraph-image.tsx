import { getDictionary } from "@/app/[lang]/dictionaries";
import { ogAlt, ogSize, renderOg } from "@/lib/og";
import { getListing } from "@/lib/data";
export const alt = ogAlt;
export const size = ogSize;
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const p = await params;
  // The image renderer cannot shape Tamil script correctly, so preview images use
  // the English text on both languages. The page's og:title stays in Tamil.
  const lang = "en" as const;
  const d = await getDictionary(lang);
  const l = await getListing(p.slug);
  return renderOg({
    lang,
    eyebrow: l ? `${d.realEstate.types[l.type]} · ${l.location[lang]}` : d.realEstate.eyebrow,
    title: l ? l.title[lang] : d.realEstate.detail.goneTitle,
  });
}
