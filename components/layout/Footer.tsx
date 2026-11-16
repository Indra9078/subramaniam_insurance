import Link from "next/link";
import { PlaceholderTag } from "@/components/ui/PlaceholderTag";
import type { Dictionary } from "@/app/[lang]/dictionaries";

export function Footer({
  lang,
  nav,
  footer,
}: {
  lang: string;
  nav: Dictionary["nav"];
  footer: Dictionary["footer"];
}) {
  return (
    <footer className="bg-ink text-[#e7e5ec]">
      <div className="mx-auto flex max-w-[1240px] flex-wrap justify-between gap-8 px-5 py-12 md:px-8">
        <div className="flex max-w-xl flex-col gap-3">
          <div className="font-display text-xl font-bold">A. Subramaniam</div>
          <p className="text-sm leading-7 text-[#bdbac6]">
            {footer.irdai}{" "}
            <PlaceholderTag tone="dark">[REG. NO. TO ADD]</PlaceholderTag>
            <br />
            {footer.disclaimer}
          </p>
        </div>
        <nav
          aria-label="Footer"
          className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#bdbac6]"
        >
          <Link href={`/${lang}/insurance`} className="hover:text-white">
            {nav.insurance}
          </Link>
          <Link href={`/${lang}/real-estate`} className="hover:text-white">
            {nav.realEstate}
          </Link>
          <Link href={`/${lang}/about`} className="hover:text-white">
            {nav.about}
          </Link>
          <Link href={`/${lang}/privacy`} className="hover:text-white">
            {footer.privacy}
          </Link>
          <Link href={`/${lang}/terms`} className="hover:text-white">
            {footer.terms}
          </Link>
          <Link href={`/${lang}/faq`} className="hover:text-white">
            {nav.faq}
          </Link>
          <Link href={`/${lang}/contact`} className="hover:text-white">
            {nav.contact}
          </Link>
        </nav>
      </div>
    </footer>
  );
}
