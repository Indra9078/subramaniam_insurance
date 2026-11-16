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
import { deleteListing } from "../../actions";

export const metadata: Metadata = { title: "Edit listing" };

async function EditListing({ params, searchParams }: PageProps<"/admin/listings/[id]">) {
  const { supabase } = await requireAdmin();
  const { id } = await params;
  const { created } = await searchParams;
  const { data } = await supabase
    .from("listings")
    .select("*, listing_photos(id, path, sort)")
    .eq("id", id)
    .maybeSingle();
  if (!data) notFound();
  const listing = data as ListingRecord & { listing_photos: { id: string; path: string; sort: number }[] };
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
