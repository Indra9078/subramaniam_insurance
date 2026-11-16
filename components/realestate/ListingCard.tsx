import Link from "next/link";
import { PlaceholderTag } from "@/components/ui/PlaceholderTag";
import type { Listing } from "@/lib/listings";
import type { Dictionary, Locale } from "@/app/[lang]/dictionaries";

/** One property card. Every value is a sample placeholder until Stage 5. */
export function ListingCard({
  lang,
  listing,
  labels,
}: {
  lang: Locale;
  listing: Listing;
  labels: Dictionary["realEstate"];
}) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-[1.75rem] border border-line bg-white transition-transform duration-300 hover:-translate-y-2">
      <div
        className={`relative flex h-48 items-center justify-center bg-gradient-to-br md:h-52 ${listing.cover}`}
      >
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-iris-900">
          {labels.types[listing.type]}
        </span>
        <PlaceholderTag>{labels.detail.photos}</PlaceholderTag>
      </div>
      <div className="flex flex-1 flex-col gap-2.5 p-6">
        <h3 className="font-display text-xl font-bold md:text-[22px]">
          <Link
            href={`/${lang}/real-estate/${listing.id}`}
            className="after:absolute after:inset-0 after:content-['']"
          >
            <PlaceholderTag className="!rounded-xl">{listing.title[lang]}</PlaceholderTag>
          </Link>
        </h3>
        <p className="text-[15px] text-muted">
          {listing.location[lang]} · {listing.size[lang]}
        </p>
        <p className="mt-auto font-display text-lg font-bold text-ember">
          {listing.price[lang]}
        </p>
      </div>
    </article>
  );
}
