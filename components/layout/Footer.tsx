import Link from "next/link";
import { PlaceholderTag } from "@/components/ui/PlaceholderTag";
import { site } from "@/lib/site";
import { siteUrl, waLink } from "@/lib/whatsapp";
import { AssistantLauncher } from "@/components/assistant/AssistantLauncher";
import type { AssistantDict } from "@/components/assistant/AssistantPanel";
import { productInsurers, productSlugs } from "@/lib/products";
import type { Dictionary } from "@/app/[lang]/dictionaries";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.2c0-.1-.2-.2-.5-.3Z" />
    </svg>
  );
}

/**
 * Footer, plus quick contact: a bar pinned to the bottom on phones
 * (Call, WhatsApp, Enquire) and a floating WhatsApp button on larger screens.
 */
export function Footer({ lang, dict, waText }: { lang: string; dict: Dictionary; waText?: string }) {
  const { nav, footer, actionBar } = dict;
  const wa = waLink(waText ?? dict.whatsappText.general);
  const assistant: AssistantDict = {
    a: dict.assistant,
    products: Object.fromEntries(
      productSlugs.map((p) => {
        const it = dict.products.items[p];
        return [p, { name: it.name, covers: it.covers, suits: it.suits, documents: it.documents }];
      }),
    ) as AssistantDict["products"],
    insurers: productInsurers,
    types: dict.realEstate.types,
    hours: { label: dict.contact.hours, ph: dict.contact.hoursPh },
    confirm: dict.products.labels.confirm,
    form: { contact: dict.contact, productForm: dict.productForm, propertyForm: dict.propertyForm },
  };
  return (
    <>
      <footer className="bg-ink pb-20 text-[#e7e5ec] md:pb-0">
        <div className="mx-auto flex max-w-[1240px] flex-wrap justify-between gap-8 px-5 py-12 md:px-8">
          <div className="flex max-w-xl flex-col gap-3">
            <div className="font-display text-xl font-bold">A. Subramaniam</div>
            <p className="text-sm leading-7 text-[#bdbac6]">
              {footer.irdai}{" "}
              <PlaceholderTag tone="dark">[REG. NO. TO ADD]</PlaceholderTag>
              <br />
              {footer.disclaimer}
            </p>
            <p className="text-sm text-[#bdbac6]">
              <a href={site.phoneHref} className="hover:text-white">{site.phoneDisplay}</a>
              {" · "}
              <a href={`mailto:${site.email}`} className="hover:text-white">{site.email}</a>
            </p>
          </div>
          <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#bdbac6]">
            <Link href={`/${lang}/insurance`} className="hover:text-white">{nav.insurance}</Link>
            <Link href={`/${lang}/real-estate`} className="hover:text-white">{nav.realEstate}</Link>
            <Link href={`/${lang}/about`} className="hover:text-white">{nav.about}</Link>
            <Link href={`/${lang}/privacy`} className="hover:text-white">{footer.privacy}</Link>
            <Link href={`/${lang}/terms`} className="hover:text-white">{footer.terms}</Link>
            <Link href={`/${lang}/faq`} className="hover:text-white">{nav.faq}</Link>
            <Link href={`/${lang}/contact`} className="hover:text-white">{nav.contact}</Link>
          </nav>
        </div>
      </footer>

      <nav
        aria-label={actionBar.label}
        className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-3 gap-2 border-t border-line bg-white/95 px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-8px_24px_rgba(27,26,31,.08)] backdrop-blur md:hidden"
      >
        <a href={site.phoneHref} className="flex min-h-12 items-center justify-center rounded-full bg-ink text-sm font-semibold text-white">
          {actionBar.call}
        </a>
        <a href={wa} target="_blank" rel="noopener" className="flex min-h-12 items-center justify-center gap-1.5 rounded-full bg-[#1f7a46] text-sm font-semibold text-white">
          <WhatsAppIcon className="size-4" />
          {actionBar.whatsapp}
        </a>
        <Link href={`/${lang}/contact#contact`} className="btn-sheen flex min-h-12 items-center justify-center rounded-full text-sm font-semibold text-white">
          {actionBar.enquire}
        </Link>
      </nav>

      <AssistantLauncher
        lang={lang === "ta" ? "ta" : "en"}
        d={assistant}
        phoneHref={site.phoneHref}
        whatsappBase={site.whatsappHref}
        siteUrl={siteUrl()}
      />

      <a
        href={wa}
        target="_blank"
        rel="noopener"
        aria-label={actionBar.whatsapp}
        className="fixed bottom-6 right-6 z-30 hidden size-14 items-center justify-center rounded-full bg-[#1f7a46] text-white shadow-[0_10px_30px_rgba(31,122,70,.45)] transition-transform hover:scale-105 md:flex"
      >
        <WhatsAppIcon className="size-7" />
      </a>
    </>
  );
}
