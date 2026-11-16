"use client";

import { useState } from "react";
import { ListingCard } from "@/components/realestate/ListingCard";
import { listingTypes, type Listing, type ListingType } from "@/lib/types";
import type { Dictionary, Locale } from "@/app/[lang]/dictionaries";

const field =
  "min-h-12 w-full rounded-[14px] border border-[#cfccd6] bg-white px-3.5 text-base sm:w-56";

/** Listings grid with type and location filters. */
export function ListingBrowser({
  lang,
  listings,
  labels,
}: {
  lang: Locale;
  listings: Listing[];
  labels: Dictionary["realEstate"];
}) {
  const [type, setType] = useState<ListingType | "all">("all");
  const [location, setLocation] = useState("all");

  const locations = Array.from(
    new Map(listings.map((l) => [l.location.en, l.location[lang]])),
  );
  const shown = listings.filter(
    (l) =>
      (type === "all" || l.type === type) &&
      (location === "all" || l.location.en === location),
  );

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 rounded-[1.5rem] border border-line bg-white p-5 sm:flex-row sm:items-end sm:gap-5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="filter-type" className="text-sm font-semibold">
            {labels.filterType}
          </label>
          <select
            id="filter-type"
            value={type}
            onChange={(e) => setType(e.target.value as ListingType | "all")}
            className={field}
          >
            <option value="all">{labels.all}</option>
            {listingTypes.map((t) => (
              <option key={t} value={t}>
                {labels.types[t]}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="filter-location" className="text-sm font-semibold">
            {labels.filterLocation}
          </label>
          <select
            id="filter-location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className={field}
          >
            <option value="all">{labels.all}</option>
            {locations.map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <p aria-live="polite" className="text-sm text-muted sm:ml-auto sm:pb-3">
          {shown.length} {labels.count}
        </p>
      </div>

      {shown.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((l, i) => (
            <ListingCard key={l.id} lang={lang} listing={l} labels={labels} index={i} />
          ))}
        </div>
      ) : (
        <p className="rounded-[1.5rem] border border-dashed border-line bg-white p-8 text-center text-muted">
          {labels.empty}
        </p>
      )}
    </div>
  );
}
