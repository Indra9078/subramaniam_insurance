import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import { photoUrl, productImageUrl, supabaseConfigured, supabaseKey, supabaseUrl } from "@/lib/supabase/env";
import { samplePlans } from "@/lib/sample-products";
import type { Faq, FaqCategory, Listing, ListingStatus, ListingType, Plan, PlanCategory, Testimonial } from "@/lib/types";

/**
 * Public, cached reads for the website. They use the publishable key with no
 * session, so row level security only returns published content.
 * Admin saves call updateTag() with the same tags to refresh the pages.
 */
export const TAGS = { listings: "listings", faqs: "faqs", testimonials: "testimonials", products: "products" } as const;

const publicClient = () =>
  createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

type ListingRow = {
  id: string;
  slug: string;
  type: ListingType;
  status: ListingStatus;
  featured: boolean;
  title_en: string;
  title_ta: string;
  location_en: string;
  location_ta: string;
  price_en: string;
  price_ta: string;
  size_en: string;
  size_ta: string;
  description_en: string;
  description_ta: string;
  features_en: string[];
  features_ta: string[];
  is_sample: boolean;
  listing_photos: { path: string; sort: number }[];
};

const toListing = (r: ListingRow): Listing => ({
  id: r.id,
  slug: r.slug,
  type: r.type,
  status: r.status,
  featured: r.featured,
  // Visitors write a listing in one language, so each side falls back to the other.
  title: { en: r.title_en || r.title_ta, ta: r.title_ta || r.title_en },
  location: { en: r.location_en || r.location_ta, ta: r.location_ta || r.location_en },
  price: { en: r.price_en || r.price_ta, ta: r.price_ta || r.price_en },
  size: { en: r.size_en || r.size_ta, ta: r.size_ta || r.size_en },
  description: { en: r.description_en || r.description_ta, ta: r.description_ta || r.description_en },
  features: {
    en: r.features_en.length ? r.features_en : r.features_ta,
    ta: r.features_ta.length ? r.features_ta : r.features_en,
  },
  photos: [...(r.listing_photos ?? [])].sort((a, b) => a.sort - b.sort).map((p) => photoUrl(p.path)),
  isSample: r.is_sample,
});

/** Published and sold listings, featured first. Empty if the database is not reachable. */
export async function getListings(): Promise<Listing[]> {
  "use cache";
  cacheTag(TAGS.listings);
  cacheLife("hours");
  if (!supabaseConfigured) return [];
  const { data, error } = await publicClient()
    .from("listings")
    .select("*, listing_photos(path, sort)")
    .order("featured", { ascending: false })
    .order("sort")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("getListings:", error.message);
    return [];
  }
  return (data as ListingRow[]).map(toListing);
}

export async function getListing(slug: string): Promise<Listing | undefined> {
  const all = await getListings();
  return all.find((l) => l.slug === slug);
}

type FaqRow = {
  id: string;
  category: FaqCategory;
  question_en: string;
  question_ta: string;
  answer_en: string;
  answer_ta: string;
  show_on_home: boolean;
  is_sample: boolean;
};

export async function getFaqs(): Promise<Faq[]> {
  "use cache";
  cacheTag(TAGS.faqs);
  cacheLife("hours");
  if (!supabaseConfigured) return [];
  const { data, error } = await publicClient()
    .from("faqs")
    .select("id, category, question_en, question_ta, answer_en, answer_ta, show_on_home, is_sample")
    .order("sort")
    .order("created_at");
  if (error) {
    console.error("getFaqs:", error.message);
    return [];
  }
  return (data as FaqRow[]).map((r) => ({
    id: r.id,
    category: r.category,
    question: { en: r.question_en, ta: r.question_ta || r.question_en },
    answer: { en: r.answer_en, ta: r.answer_ta || r.answer_en },
    showOnHome: r.show_on_home,
    isSample: r.is_sample,
  }));
}

export async function getTestimonials(): Promise<Testimonial[]> {
  "use cache";
  cacheTag(TAGS.testimonials);
  cacheLife("hours");
  if (!supabaseConfigured) return [];
  const { data, error } = await publicClient()
    .from("testimonials")
    .select("id, name, area, quote_en, quote_ta")
    .order("sort")
    .order("created_at");
  if (error) {
    console.error("getTestimonials:", error.message);
    return [];
  }
  return data.map((r) => ({
    id: r.id,
    name: r.name,
    area: r.area,
    quote: { en: r.quote_en, ta: r.quote_ta || r.quote_en },
  }));
}

type PlanRow = {
  id: string;
  slug: string;
  category: PlanCategory;
  insurer: string;
  featured: boolean;
  name_en: string;
  name_ta: string;
  summary_en: string;
  summary_ta: string;
  description_en: string;
  description_ta: string;
  features_en: string[];
  features_ta: string[];
  image_path: string | null;
  is_sample: boolean;
};

/**
 * Published insurance plans. If the table cannot be read (the Stage 9 migration
 * has not been run yet) the built-in sample plans are shown instead. An empty
 * table means "no plans", so deleting every plan never brings samples back.
 */
export async function getPlans(): Promise<Plan[]> {
  "use cache";
  cacheTag(TAGS.products);
  cacheLife("hours");
  if (!supabaseConfigured) return samplePlans;
  const { data, error } = await publicClient()
    .from("insurance_products")
    .select("*")
    .order("featured", { ascending: false })
    .order("sort")
    .order("created_at");
  if (error) {
    console.error("getPlans:", error.message);
    return samplePlans;
  }
  return (data as PlanRow[]).map((r) => ({
    id: r.id,
    slug: r.slug,
    category: r.category,
    insurer: r.insurer,
    featured: r.featured,
    name: { en: r.name_en || r.name_ta, ta: r.name_ta || r.name_en },
    summary: { en: r.summary_en || r.summary_ta, ta: r.summary_ta || r.summary_en },
    description: { en: r.description_en || r.description_ta, ta: r.description_ta || r.description_en },
    features: {
      en: r.features_en.length ? r.features_en : r.features_ta,
      ta: r.features_ta.length ? r.features_ta : r.features_en,
    },
    image: r.image_path ? productImageUrl(r.image_path) : null,
    isSample: r.is_sample,
  }));
}

export async function getPlan(slug: string): Promise<Plan | undefined> {
  const all = await getPlans();
  return all.find((p) => p.slug === slug);
}
