import Link from "next/link";
import { ListingCard } from "@/components/realestate/ListingCard";
import type { Listing } from "@/lib/types";
import type { Dictionary, Locale } from "@/app/[lang]/dictionaries";

/** Up to three featured listings, managed from the admin page. */
export function Listings({
  lang,
  dict,
  listings,
}: {
  lang: Locale;
  dict: Dictionary;
  listings: Listing[];
}) {
  const l = dict.listings;
  const shown = listings.filter((x) => x.status === "published").slice(0, 3);
  return (
    <section className="mx-auto w-full max-w-[1240px] px-5 py-12 md:px-8 md:py-24">
      <h2 className="font-display text-[2rem] font-bold leading-[1.1] tracking-tight md:text-6xl">
        {l.title}
      </h2>
      {shown.length > 0 ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 md:mt-11">
          {shown.map((item, i) => (
            <ListingCard key={item.id} lang={lang} listing={item} labels={dict.realEstate} index={i} />
          ))}
        </div>
      ) : (
        <p className="mt-8 rounded-[1.5rem] border border-dashed border-line bg-white p-8 text-muted">
          {dict.realEstate.noListings}
        </p>
      )}
      <Link
        href={`/${lang}/real-estate`}
        className="mt-6 inline-flex min-h-11 items-center font-semibold text-ember underline-offset-4 hover:underline"
      >
        {l.viewAll} →
      </Link>
    </section>
  );
}
