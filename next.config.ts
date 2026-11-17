import type { NextConfig } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  experimental: {
    // Branded 404 for URLs that match no route (the app has two root layouts).
    globalNotFound: true,
  },
  partialPrefetching: true,
  images: {
    // Listing photos and plan images from the Supabase storage buckets only.
    remotePatterns: supabaseUrl
      ? [
          new URL(`${supabaseUrl}/storage/v1/object/public/listing-photos/**`),
          new URL(`${supabaseUrl}/storage/v1/object/public/product-images/**`),
        ]
      : [],
  },
  // The separate FAQ page is gone (FAQs sit at the bottom of each page); keep old links working.
  async redirects() {
    return [{ source: "/:lang(en|ta)/faq", destination: "/:lang", permanent: true }];
  },
  // Basic browser security headers for every response.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Content-Security-Policy", value: "frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
        ],
      },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
