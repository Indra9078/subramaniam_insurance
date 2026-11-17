import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { Badge, Loading, PageTitle } from "@/components/admin/fields";
import { ListingForm, type ListingRecord } from "@/components/admin/ListingForm";
import { PhotoManager } from "@/components/admin/PhotoManager";
import { requireAdmin } from "@/lib/admin/auth";
import { photoUrl } from "@/lib/supabase/env";
import { approveListing, deleteListing, rejectListing } from "../../actions";

export const metadata: Metadata = { title: "Edit listing" };

async function EditListing({ params, searchParams }: PageProps<"/admin/listings/[id]">) {
  const { supabase } = await requireAdmin();
  const { id } = await params;
  const { created, approved, rejected } = await searchParams;
  const { data } = await supabase
    .from("listings")
    .select("*, listing_photos(id, path, sort), owner:profiles(full_name, phone, email)")
    .eq("id", id)
    .maybeSingle();
  if (!data) notFound();
  const listing = data as ListingRecord & {
    listing_photos: { id: string; path: string; sort: number }[];
    owner_id: string | null;
    review_note: string | null;
    owner: { full_name: string; phone: string; email: string } | { full_name: string; phone: string; email: string }[] | null;
  };
  const owner = Array.isArray(listing.owner) ? listing.owner[0] : listing.owner;
  const photos = [...listing.listing_photos]
    .sort((a, b) => a.sort - b.sort)
    .map((p) => ({ id: p.id, url: photoUrl(p.path) }));

  return (
    <>
      <PageTitle title={listing.title_en || "Edit listing"}>
        <span className="flex flex-wrap items-center gap-2">
          {listing.is_sample && <Badge tone="orange">sample: saving marks it real</Badge>}
          {listing.status !== "draft" && (
            <Link href={`/en/real-estate/${listing.slug}`} target="_blank" className="text-sm font-semibold text-ember underline-offset-4 hover:underline">
              View on site ↗
            </Link>
          )}
        </span>
      </PageTitle>
      {created && <p className="mb-6 rounded-[12px] bg-[#e1f4e8] p-3 text-sm font-semibold text-[#1f7a46]">Listing created. Add photos below.</p>}
      {approved && <p className="mb-6 rounded-[12px] bg-[#e1f4e8] p-3 text-sm font-semibold text-[#1f7a46]">Approved: the listing is now live on the site.</p>}
      {rejected && <p className="mb-6 rounded-[12px] bg-[#ffe9df] p-3 text-sm font-semibold text-ember">Rejected: the owner can see your note in their account and resubmit.</p>}
      {listing.owner_id && (
        <section className={`mb-8 flex flex-col gap-4 rounded-[1.25rem] border p-5 ${listing.status === "pending" ? "border-ember/60 bg-white shadow-[0_8px_24px_rgba(194,65,12,.14)]" : "border-line bg-white"}`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">Submitted by a visitor</p>
              <p className="font-display text-lg font-bold">{owner?.full_name || "Visitor"}</p>
              <p className="text-sm text-muted">
                {owner?.phone && <a href={`tel:+91${owner.phone}`} className="font-semibold text-ember">{owner.phone}</a>}
                {owner?.phone && <> · <a href={`https://wa.me/91${owner.phone}`} target="_blank" rel="noopener" className="font-semibold text-[#1f7a46]">WhatsApp</a></>}
                {owner?.email && <> · {owner.email}</>}
              </p>
            </div>
            <Badge tone={listing.status === "pending" ? "orange" : listing.status === "published" ? "green" : "grey"}>{listing.status === "pending" ? "needs approval" : listing.status}</Badge>
          </div>
          {listing.status !== "published" && (
            <div className="flex flex-col gap-4 md:flex-row md:items-end">
              <form action={approveListing.bind(null, listing.id)}>
                <button type="submit" className="btn-sheen inline-flex min-h-12 items-center rounded-full px-7 font-semibold text-white">Approve and publish</button>
              </form>
              <form action={rejectListing.bind(null, listing.id)} className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-end">
                <label className="flex flex-1 flex-col gap-1.5">
                  <span className="text-sm font-semibold">Reject with a note for the owner (optional)</span>
                  <input name="note" maxLength={500} placeholder="e.g. Please add photos and the exact location" className="min-h-12 w-full rounded-[12px] border border-[#cfccd6] bg-white px-3.5 text-base" />
                </label>
                <button type="submit" className="min-h-12 rounded-full border border-ember/40 px-6 font-semibold text-ember hover:bg-ember hover:text-white">Reject</button>
              </form>
            </div>
          )}
          {listing.review_note && <p className="rounded-[10px] bg-[#fff3cf] p-3 text-sm"><strong>Your note:</strong> {listing.review_note}</p>}
          <p className="text-xs text-muted">The owner may have written in one language only. Fill in the other language below if you want both versions to read well.</p>
        </section>
      )}
      <div className="flex flex-col gap-8">
        <PhotoManager listingId={listing.id} photos={photos} />
        <ListingForm listing={listing} />
        <div className="border-t border-line pt-6">
          <ConfirmButton
            action={deleteListing.bind(null, listing.id)}
            label="Delete listing"
            message="Delete this listing and all its photos? This cannot be undone."
          />
        </div>
      </div>
    </>
  );
}

export default function EditListingPage(props: PageProps<"/admin/listings/[id]">) {
  return (
    <AdminShell>
      <Suspense fallback={<Loading />}>
        <EditListing {...props} />
      </Suspense>
    </AdminShell>
  );
}
