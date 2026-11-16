import type { Metadata } from "next";

/** Title, description and language alternates for an inner page. `path` starts with "/". */
export function pageMetadata(
  path: string,
  title: string,
  description: string,
): Metadata {
  return {
    title,
    description,
    alternates: {
      languages: { en: `/en${path}`, ta: `/ta${path}` },
    },
  };
}
