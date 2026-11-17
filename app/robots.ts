import type { MetadataRoute } from "next";
import { indexingOn } from "@/lib/meta";
import { siteUrl } from "@/lib/whatsapp";

/** Before launch (SITE_INDEXING not "on") nothing may be crawled. */
export default function robots(): MetadataRoute.Robots {
  const base = siteUrl();
  if (!indexingOn()) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] },
    ...(base ? { sitemap: `${base}/sitemap.xml` } : {}),
  };
}
