import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import { fontVariables } from "@/lib/fonts";
import { Reveal } from "@/components/ui/Reveal";
import { getDictionary, hasLocale, locales } from "./dictionaries";
import { indexingOn, jsonLd, metadataBase } from "@/lib/meta";
import { site } from "@/lib/site";
import { siteUrl } from "@/lib/whatsapp";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return {
    metadataBase: metadataBase(),
    title: { default: dict.meta.title, template: `%s | ${dict.meta.siteName}` },
    description: dict.meta.description,
    // Home page; inner pages set their own (see lib/meta.ts).
    alternates: {
      canonical: `/${lang}`,
      languages: { en: "/en", ta: "/ta", "x-default": "/en" },
    },
    robots: indexingOn() ? undefined : { index: false, follow: false },
    openGraph: {
      type: "website",
      siteName: dict.meta.siteName,
      locale: lang === "ta" ? "ta_IN" : "en_IN",
      alternateLocale: lang === "ta" ? "en_IN" : "ta_IN",
      title: dict.meta.title,
      description: dict.meta.description,
      url: `/${lang}`,
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function RootLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const base = siteUrl();

  // Business details for search engines. No address until the client supplies it.
  const business = {
    "@context": "https://schema.org",
    "@type": ["InsuranceAgency", "RealEstateAgent"],
    name: "A. Subramaniam",
    description: dict.meta.description,
    ...(base ? { url: `${base}/${lang}` } : {}),
    telephone: site.phoneHref.replace("tel:", ""),
    email: site.email,
    areaServed: [
      { "@type": "State", name: "Tamil Nadu" },
      { "@type": "Country", name: "India" },
    ],
    knowsLanguage: ["en", "ta"],
    makesOffer: ["Health insurance", "Life insurance", "Vehicle insurance", "Corporate and group insurance", "Real estate"].map(
      (name) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name } }),
    ),
  };

  return (
    <html lang={lang} className={`h-full ${fontVariables}`}>
      <body className="flex min-h-full flex-col">
        <a href="#content" className="skip-link">
          {dict.common.skip}
        </a>
        {children}
        <Reveal />
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(business)} />
      </body>
    </html>
  );
}
