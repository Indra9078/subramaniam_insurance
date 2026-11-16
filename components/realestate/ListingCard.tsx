import Image from "next/image";
import Link from "next/link";
import { PlaceholderTag } from "@/components/ui/PlaceholderTag";
import { listingCovers, type Listing } from "@/lib/types";
import type { Dictionary, Locale } from "@/app/[lang]/dictionaries";

/** One property card. Sample rows from the seed data show as placeholders. */
export function ListingCard({
  lang,
  listing,
  labels,
  index = 0,
}: {
  lang: Locale;
  listing: Listing;
  labels: Dictionary["realEstate"];
  index?: number;
}) {
  const title = listing.title[lang];
  const photo = listing.photos[0];
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-[1.75rem] border border-line bg-white transition-transform duration-300 hover:-translate-y-2">
      <div
        className={`relative flex h-48 items-center justify-center bg-gradient-to-br md:h-52 ${listingCovers[index % listingCovers.length]}`}
      >
        {photo ? (
          <Image
            src={photo}
            alt={title}
            fill
            sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        ) : (
          <PlaceholderTag>{labels.detail.photos}</PlaceholderTag>
        )}
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-iris-900">
          {labels.types[listing.type]}
        </span>
        {listing.status === "sold" && (
          <span className="absolute right-4 top-4 rounded-full bg-ink px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
            {labels.sold}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2.5 p-6">
        <h3 className="font-display text-xl font-bold md:text-[22px]">
          <Link
            href={`/${lang}/real-estate/${listing.slug}`}
            className="after:absolute after:inset-0 after:content-['']"
          >
            {listing.isSample ? (
              <PlaceholderTag className="!rounded-xl">{title}</PlaceholderTag>
            ) : (
              title
            )}
          </Link>
        </h3>
        <p className="text-[15px] text-muted">
          {[listing.location[lang], listing.size[lang]].filter(Boolean).join(" · ")}
        </p>
        <p className="mt-auto font-display text-lg font-bold text-ember">{listing.price[lang]}</p>
      </div>
    </article>
  );
}
