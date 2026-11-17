import type { Dictionary } from "@/app/[lang]/dictionaries";

export const productSlugs = ["health", "life", "vehicle", "corporate"] as const;
export type ProductSlug = (typeof productSlugs)[number];

export const isProductSlug = (v: string): v is ProductSlug =>
  (productSlugs as readonly string[]).includes(v);

/**
 * Which insurer offers each product. `confirmed: false` shows a placeholder tag
 * until the client confirms (corporate and group cover is still to confirm).
 */
export const productInsurers: Record<
  ProductSlug,
  { names: string[]; confirmed: boolean }
> = {
  health: { names: ["Star Health Insurance"], confirmed: true },
  life: { names: ["LIC", "Tata AIA Life Insurance", "HDFC Life Insurance"], confirmed: true },
  vehicle: { names: ["IFFCO-Tokio General Insurance", "United India Insurance"], confirmed: true },
  corporate: {
    names: ["Star Health Insurance", "IFFCO-Tokio General Insurance"],
    confirmed: false,
  },
};

export const productAccent: Record<ProductSlug, string> = {
  health: "bg-[#ffe9df]",
  life: "bg-iris-100",
  vehicle: "bg-[#e7f5ec]",
  corporate: "bg-[#fff3cf]",
};

export type Product = Dictionary["products"]["items"][ProductSlug];
