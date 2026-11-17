import type { MetadataRoute } from "next";
import { getListings, getPlans } from "@/lib/data";
import { productSlugs } from "@/lib/products";
import { siteUrl } from "@/lib/whatsapp";

const pages = ["", "/about", "/insurance", ...productSlugs.map((p) => `/insurance/${p}`), "/real-estate", "/contact", "/privacy", "/terms"];

/** Every public page in English and Tamil, plus real (non-sample) published listings. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl() || "http://localhost:3000";
  const listings = (await getListings()).filter((l) => !l.isSample && l.status === "published");
  const plans = (await getPlans()).filter((p) => !p.isSample);
  const paths = [...pages, ...plans.map((p) => `/insurance/plans/${p.slug}`), ...listings.map((l) => `/real-estate/${l.slug}`)];
  return paths.flatMap((path) =>
    (["en", "ta"] as const).map((lang) => ({
      url: `${base}/${lang}${path}`,
      changeFrequency: path.startsWith("/real-estate") || path.startsWith("/insurance/plans") ? ("weekly" as const) : ("monthly" as const),
      priority: path === "" ? 1 : path.startsWith("/insurance") || path === "/real-estate" ? 0.8 : 0.5,
      alternates: { languages: { en: `${base}/en${path}`, ta: `${base}/ta${path}` } },
    })),
  );
}
