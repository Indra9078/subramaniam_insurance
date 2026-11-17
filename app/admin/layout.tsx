import type { Metadata } from "next";
import "../globals.css";
import { fontVariables } from "@/lib/fonts";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | Admin" },
  robots: { index: false, follow: false },
};

/** Separate root layout for the admin area (English only, not indexed). */
export default function AdminRootLayout({ children }: LayoutProps<"/admin">) {
  return (
    <html lang="en" className={`h-full ${fontVariables}`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
