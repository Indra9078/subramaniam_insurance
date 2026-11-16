import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Loading, PageTitle } from "@/components/admin/fields";
import { ListingForm } from "@/components/admin/ListingForm";
import { requireAdmin } from "@/lib/admin/auth";

export const metadata: Metadata = { title: "New listing" };

async function NewListing() {
  await requireAdmin();
  return (
    <>
      <p className="-mt-3 mb-6 text-sm text-muted">Save the listing first, then add photos.</p>
      <ListingForm />
    </>
  );
}

export default function NewListingPage() {
  return (
    <AdminShell>
      <PageTitle title="New listing" />
      <Suspense fallback={<Loading />}>
        <NewListing />
      </Suspense>
    </AdminShell>
  );
}
