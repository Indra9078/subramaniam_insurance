import Link from "next/link";
import { Suspense } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Badge, Loading, PageTitle } from "@/components/admin/fields";
import { requireAdmin } from "@/lib/admin/auth";

const statusTone = { draft: "grey", published: "green", sold: "orange" } as const;

async function ListingsTable() {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase
    .from("listings")
    .select("id, slug, type, status, featured, title_en, location_en, is_sample, listing_photos(count)")
    .order("featured", { ascending: false })
    .order("sort")
    .order("created_at", { ascending: false });
  if (error) return <p className="text-ember">Could not load listings: {error.message}</p>;
  if (!data.length) return <p className="rounded-[1.25rem] border border-dashed border-line bg-white p-8 text-center text-muted">No listings yet.</p>;

  return (
    <ul className="flex flex-col gap-3">
      {data.map((l) => {
        const photos = (l.listing_photos as { count: number }[])[0]?.count ?? 0;
        return (
          <li key={l.id}>
            <Link
              href={`/admin/listings/${l.id}`}
              className="flex flex-col gap-2 rounded-[1.25rem] border border-line bg-white p-4 hover:border-ink sm:flex-row sm:items-center sm:justify-between"
            >
              <span className="flex flex-col gap-1">
                <span className="font-semibold">{l.title_en}</span>
                <span className="text-sm text-muted">
                  {l.type} · {l.location_en || "No location"} · {photos} photo{photos === 1 ? "" : "s"}
                </span>
              </span>
              <span className="flex flex-wrap gap-1.5">
                <Badge tone={statusTone[l.status as keyof typeof statusTone]}>{l.status}</Badge>
                {l.featured && <Badge tone="purple">featured</Badge>}
                {l.is_sample && <Badge tone="orange">sample</Badge>}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export default function AdminListings() {
  return (
    <AdminShell>
      <PageTitle title="Listings">
        <Link href="/admin/listings/new" className="btn-sheen inline-flex min-h-12 items-center rounded-full px-6 font-semibold text-white">
          + Add listing
        </Link>
      </PageTitle>
      <Suspense fallback={<Loading />}>
        <ListingsTable />
      </Suspense>
    </AdminShell>
  );
}
