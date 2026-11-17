import { getDictionary } from "@/app/[lang]/dictionaries";
import { ogAlt, ogSize, renderOg } from "@/lib/og";
import { isProductSlug } from "@/lib/products";
export const alt = ogAlt;
export const size = ogSize;
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ lang: string; product: string }> }) {
  const p = await params;
  // The image renderer cannot shape Tamil script correctly, so preview images use
  // the English text on both languages. The page's og:title stays in Tamil.
  const lang = "en" as const;
  const d = await getDictionary(lang);
  const item = d.products.items[isProductSlug(p.product) ? p.product : "health"];
  return renderOg({ lang, eyebrow: item.name, title: item.title });
}
