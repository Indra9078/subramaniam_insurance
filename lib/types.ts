export type ListingType = "plot" | "house" | "apartment" | "commercial";
export const listingTypes: ListingType[] = ["plot", "house", "apartment", "commercial"];
export type ListingStatus = "draft" | "published" | "sold";
export type Text = { en: string; ta: string };

/** A listing as the public pages use it. */
export type Listing = {
  id: string;
  slug: string;
  type: ListingType;
  status: ListingStatus;
  featured: boolean;
  location: Text;
  title: Text;
  price: Text;
  size: Text;
  description: Text;
  features: { en: string[]; ta: string[] };
  photos: string[];
  isSample: boolean;
};

export type FaqCategory = "general" | "health" | "life" | "vehicle" | "corporate" | "real_estate";
export const faqCategories: FaqCategory[] = ["general", "health", "life", "vehicle", "corporate", "real_estate"];

export type Faq = {
  id: string;
  category: FaqCategory;
  question: Text;
  answer: Text;
  showOnHome: boolean;
  isSample: boolean;
};

export type Testimonial = {
  id: string;
  name: string;
  area: string;
  quote: Text;
};

/** Soft card backgrounds used when a listing has no photo yet. */
export const listingCovers = [
  "from-iris-100 to-[#ffe9df]",
  "from-iris-100 to-[#e7f5ec]",
  "from-iris-100 to-[#ffe0d2]",
  "from-iris-100 to-[#fff3cf]",
];
