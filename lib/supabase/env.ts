/** Supabase project URL and publishable key. Both are safe to expose; RLS protects the data. */
export const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim().replace(/\/+$/, "");
export const supabaseKey = (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "").trim();
export const supabaseConfigured = Boolean(supabaseUrl && supabaseKey);

/**
 * Explains a wrong setup in plain words (for the admin login page and server logs).
 * Returns null when the settings look right.
 */
export function supabaseConfigProblem(): string | null {
  if (!supabaseUrl) return "NEXT_PUBLIC_SUPABASE_URL is not set on this deployment.";
  if (!supabaseKey) return "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is not set on this deployment.";
  if (supabaseUrl.includes("supabase.com/dashboard"))
    return "NEXT_PUBLIC_SUPABASE_URL is the dashboard link. It must be the API URL, like https://<project-ref>.supabase.co";
  if (!/^https:\/\/[a-z0-9]+\.supabase\.co$/.test(supabaseUrl))
    return `NEXT_PUBLIC_SUPABASE_URL should look like https://<project-ref>.supabase.co (it is "${supabaseUrl}").`;
  if (!/^(sb_publishable_|eyJ)/.test(supabaseKey))
    return "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY does not look like a publishable key (it should start with sb_publishable_).";
  return null;
}

export const PHOTO_BUCKET = "listing-photos";
export const PRODUCT_BUCKET = "product-images";

/** Public URL of a plan image in the product-images bucket. */
export const productImageUrl = (path: string) =>
  `${supabaseUrl}/storage/v1/object/public/${PRODUCT_BUCKET}/${path}`;

/** Public URL of a photo in the listing-photos bucket. */
export const photoUrl = (path: string) =>
  `${supabaseUrl}/storage/v1/object/public/${PHOTO_BUCKET}/${path}`;
