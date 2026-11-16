/** Supabase project URL and publishable key. Both are safe to expose; RLS protects the data. */
export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";
export const supabaseConfigured = Boolean(supabaseUrl && supabaseKey);

export const PHOTO_BUCKET = "listing-photos";

/** Public URL of a photo in the listing-photos bucket. */
export const photoUrl = (path: string) =>
  `${supabaseUrl}/storage/v1/object/public/${PHOTO_BUCKET}/${path}`;
