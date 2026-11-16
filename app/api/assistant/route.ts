import type { NextRequest } from "next/server";
import { getFaqs, getListings } from "@/lib/data";
import type { AssistantData } from "@/lib/assistant";

/**
 * Published FAQs and listings for the guided assistant, in one language.
 * Reads go through the cached data layer; the CDN may keep a copy for a minute.
 */
export async function GET(request: NextRequest) {
  const lang = request.nextUrl.searchParams.get("lang") === "ta" ? "ta" : "en";
  const [faqs, listings] = await Promise.all([getFaqs(), getListings()]);
  const data: AssistantData = {
    faqs: faqs.map((f) => ({
      id: f.id,
      category: f.category,
      q: f.question[lang],
      a: f.answer[lang],
      sample: f.isSample,
    })),
    listings: listings
      .filter((l) => l.status === "published")
      .map((l) => ({
        slug: l.slug,
        type: l.type,
        title: l.title[lang],
        titleEn: l.title.en,
        area: l.location[lang],
        areaKey: l.location.en,
        price: l.price[lang],
        size: l.size[lang],
        photo: l.photos[0] ?? null,
        sample: l.isSample,
      })),
  };
  return Response.json(data, {
    headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
  });
}
