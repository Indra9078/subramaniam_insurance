"use client";

import { startTransition, useActionState } from "react";
import { saveMyListing, type ListingState } from "@/app/[lang]/account/actions";
import { listingTypes } from "@/lib/types";
import type { Dictionary } from "@/app/[lang]/dictionaries";

const field =
  "min-h-[50px] w-full rounded-[14px] border border-[#cfccd6] bg-white px-3.5 text-base text-ink focus:border-iris-500 focus:outline-none focus:ring-2 focus:ring-iris-200";

export type MyListing = { id: string; type: string; title: string; location: string; price: string; size: string; description: string; features: string[] };

/** Property form for visitors. They write in one language; the listing shows in both. */
export function UserListingForm({ lang, dict, listing }: { lang: string; dict: Dictionary; listing?: MyListing }) {
  const f = dict.listingForm;
  const [state, action, pending] = useActionState<ListingState, FormData>(saveMyListing.bind(null, lang, listing?.id ?? null), {});
  const row = (id: string, label: string, input: React.ReactNode, hint?: string, required?: boolean) => (
    <div className="flex min-w-0 flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold">
        {label}
        {required && <span className="text-ember"> *</span>}
      </label>
      {input}
      {hint && <span className="text-xs text-muted">{hint}</span>}
    </div>
  );
  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        startTransition(() => action(fd));
      }}
      className="flex flex-col gap-5"
    >
      <p className="text-sm text-muted">{f.writeIn}</p>
      <div className="grid gap-5 sm:grid-cols-2">
        {row("ml-type", f.type, (
          <select id="ml-type" name="type" defaultValue={listing?.type ?? "plot"} className={field}>
            {listingTypes.map((t) => <option key={t} value={t}>{dict.realEstate.types[t]}</option>)}
          </select>
        ), undefined, true)}
        {row("ml-location", f.location, <input id="ml-location" name="location" defaultValue={listing?.location} maxLength={120} className={field} aria-invalid={state.error === "location" || undefined} />, f.locationHint, true)}
      </div>
      {row("ml-title", f.title, <input id="ml-title" name="title" defaultValue={listing?.title} maxLength={120} className={field} aria-invalid={state.error === "title" || undefined} />, f.titleHint, true)}
      <div className="grid gap-5 sm:grid-cols-2">
        {row("ml-price", f.price, <input id="ml-price" name="price" defaultValue={listing?.price} maxLength={60} className={field} />, f.priceHint)}
        {row("ml-size", f.size, <input id="ml-size" name="size" defaultValue={listing?.size} maxLength={60} className={field} />, f.sizeHint)}
      </div>
      {row("ml-desc", f.description, <textarea id="ml-desc" name="description" rows={6} defaultValue={listing?.description} maxLength={3000} className={`${field} py-3 leading-relaxed`} />)}
      {row("ml-features", f.features, <textarea id="ml-features" name="features" rows={4} defaultValue={listing?.features.join("\n")} maxLength={1500} className={`${field} py-3 leading-relaxed`} />, f.featuresHint)}
      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={pending} className="btn-sheen inline-flex min-h-[54px] items-center rounded-full px-8 text-base font-semibold text-white disabled:opacity-70">
          {pending ? dict.account.working : listing ? f.saveChanges : f.submit}
        </button>
        <p aria-live="assertive" className="text-sm font-semibold text-ember">{state.error ? f.errors[state.error] : ""}</p>
      </div>
      {listing && <p className="text-xs text-muted">{f.saveNote}</p>}
    </form>
  );
}
