import type { FaqCategory, ListingType } from "@/lib/types";

/** Data the guided assistant loads when it opens (one language). */
export type AssistantData = {
  faqs: { id: string; category: FaqCategory; q: string; a: string; sample: boolean }[];
  listings: {
    slug: string;
    type: ListingType;
    title: string;
    titleEn: string;
    area: string;
    areaKey: string;
    price: string;
    size: string;
    photo: string | null;
    sample: boolean;
  }[];
};

export type AssistantEvent = "open" | "topic" | "contact" | "search";
