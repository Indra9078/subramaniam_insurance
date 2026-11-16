import Link from "next/link";
import { PlaceholderTag } from "@/components/ui/PlaceholderTag";
import { ListingCard } from "@/components/realestate/ListingCard";
import { listings } from "@/lib/listings";
import type { Dictionary, Locale } from "@/app/[lang]/dictionaries";

/** Three featured cards. In Stage 5 these come from the admin page. */
export function Listings({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const l = dict.listings;
  return (
    <section className="mx-auto w-full max-w-[1240px] px-5 py-12 md:px-8 md:py-24">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 className="font-display text-[2rem] font-bold leading-[1.1] tracking-tight md:text-6xl">
          {l.title}
        </h2>
        <PlaceholderTag>{l.note}</PlaceholderTag>
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 md:mt-11">
        {listings.slice(0, 3).map((item) => (
          <ListingCard key={item.id} lang={lang} listing={item} labels={dict.realEstate} />
        ))}
      </div>
      <Link
        href={`/${lang}/real-estate`}
        className="mt-6 inline-flex min-h-11 items-center font-semibold text-ember underline-offset-4 hover:underline"
      >
        {l.viewAll} →
      </Link>
    </section>
  );
}
