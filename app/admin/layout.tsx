import type { Metadata } from "next";
import "../globals.css";
import { fontVariables } from "@/lib/fonts";

export const viewport = { themeColor: "#7a2108" };

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | Admin" },
  robots: { index: false, follow: false },
};

/** Separate root layout for the admin area (English only, not indexed). */
export default function AdminRootLayout({ children }: LayoutProps<"/admin">) {
  return (
    <html lang="en" className={`theme-sunset h-full ${fontVariables}`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
