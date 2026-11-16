/**
 * Contact details used across the site.
 * PLACEHOLDER: every value here is a dummy until the client supplies the real one.
 * Anything shown from this file is wrapped in <PlaceholderTag> on the page.
 */
export const site = {
  name: "A. Subramaniam",
  phoneDisplay: "+91 00000 00000",
  phoneHref: "tel:+910000000000",
  whatsappHref: "https://wa.me/910000000000",
  email: "hello@example.com",
} as const;

/** Official insurer names. Logos only with written permission. */
export const insurers = [
  "LIC",
  "Star Health Insurance",
  "IFFCO-Tokio General Insurance",
] as const;
