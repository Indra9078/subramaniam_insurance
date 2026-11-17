import type { Metadata } from "next";
import "./globals.css";
import { fontVariables } from "@/lib/fonts";
import { NotFoundContent } from "@/components/layout/NotFoundContent";

export const metadata: Metadata = {
  title: "Page not found | A. Subramaniam",
  robots: { index: false },
};

/** Shown for any URL that matches no route at all (bypasses the normal layouts). */
export default function GlobalNotFound() {
  return (
    <html lang="en" className={`h-full ${fontVariables}`}>
      <body className="flex min-h-full flex-col">
        <NotFoundContent />
      </body>
    </html>
  );
}
