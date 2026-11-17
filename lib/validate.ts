/** Small input checks shared by server actions. Everything a visitor sends is validated here and again in the database. */

/** Trims, collapses control characters and cuts to `max` characters. */
export const clean = (value: FormDataEntryValue | null | undefined, max = 200) =>
  String(value ?? "")
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "")
    .trim()
    .slice(0, max);

/** Indian mobile number: 10 digits starting 6-9, with optional +91 or 0 in front. Returns the 10 digits or null. */
export function phone10(raw: string) {
  let d = raw.replace(/\D/g, "");
  if (d.length === 12 && d.startsWith("91")) d = d.slice(2);
  if (d.length === 11 && d.startsWith("0")) d = d.slice(1);
  return /^[6-9]\d{9}$/.test(d) ? d : null;
}

export const isEmail = (v: string) => v.length <= 254 && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v);
export const isUuid = (v: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);

/** One item per line, blank lines removed, at most `max` items of `len` characters. */
export const lines = (value: FormDataEntryValue | null | undefined, max = 12, len = 120) =>
  clean(value, 4000)
    .split(/\r?\n/)
    .map((l) => l.trim().slice(0, len))
    .filter(Boolean)
    .slice(0, max);

/** Only same-site paths are allowed after login (blocks open redirects). */
export function safeNext(next: string | null | undefined, fallback: string) {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.includes("\\") || next.includes(":")) return fallback;
  return next;
}
