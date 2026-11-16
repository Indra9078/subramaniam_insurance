/** Small helpers for reading admin form fields. */
export type FormState = { error?: string; ok?: string };

export const text = (fd: FormData, key: string) => String(fd.get(key) ?? "").trim();
export const bool = (fd: FormData, key: string) => fd.get(key) === "on";
export const int = (fd: FormData, key: string) => {
  const n = Number.parseInt(text(fd, key), 10);
  return Number.isFinite(n) ? n : 0;
};
/** One item per line, blank lines removed. */
export const lines = (fd: FormData, key: string) =>
  text(fd, key)
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

/** URL-safe slug from English text. Tamil-only titles fall back to a random slug. */
export function slugify(value: string) {
  const slug = value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
    .replace(/-+$/g, "");
  return slug || `listing-${Math.random().toString(36).slice(2, 8)}`;
}
