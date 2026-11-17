import type { MetadataRoute } from "next";

/** Lets visitors add the site to their phone's home screen. Icons are a temporary monogram until the logo is ready. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "A. Subramaniam: Insurance and Property",
    short_name: "A. Subramaniam",
    description: "Health, life and vehicle insurance and property advice across Tamil Nadu and India.",
    start_url: "/en",
    display: "browser",
    background_color: "#F4F2EE",
    theme_color: "#2B2350",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
