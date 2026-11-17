import Link from "next/link";
import { Suspense } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Badge, Loading, PageTitle } from "@/components/admin/fields";
import { requireAdmin } from "@/lib/admin/auth";

const statusTone = { draft: "grey", pending: "orange", published: "green", sold: "purple", rejected: "grey" } as const;
const tabs = ["all", "pending", "published", "draft", "sold", "rejected"] as const;

async function ListingsTable({ searchParams }: { searchParams: PageProps<"/admin/listings">["searchParams"] }) {
  const { supabase } = await requireAdmin();
  const { status } = await searchParams;
  const filter = typeof status === "string" && (tabs as readonly string[]).includes(status) ? status : "all";
  const { data, error } = await supabase
    .from("listings")
    .select("id, slug, type, status, featured, title_en, title_ta, location_en, location_ta, is_sample, owner_id, created_at, owner:profiles(full_name, phone), listing_photos(count)")
    .order("created_at", { ascending: false });
  if (error) return <p className="text-ember">Could not load listings: {error.message}</p>;

  const counts = Object.fromEntries(tabs.map((t) => [t, t === "all" ? data.length : data.filter((l) => l.status === t).length]));
  const rows = data
    .filter((l) => filter === "all" || l.status === filter)
    .sort((a, b) => Number(b.featured) - Number(a.featured));

  return (
    <>
      <nav aria-label="Filter listings" className="mb-5 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <Link
            key={t}
            href={t === "all" ? "/admin/listings" : `/admin/listings?status=${t}`}
            aria-current={filter === t ? "page" : undefined}
            className={`inline-flex min-h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold capitalize ${filter === t ? "bg-ink text-white" : "border border-line bg-white"}`}
          >
            {t === "pending" ? "Pending approval" : t}
            <span className={`rounded-full px-2 text-xs ${t === "pending" && counts[t] > 0 ? "bg-ember text-white" : "bg-black/10"}`}>{counts[t]}</span>
          </Link>
        ))}
      </nav>
      {!rows.length ? (
        <p className="rounded-[1.25rem] border border-dashed border-line bg-white p-8 text-center text-muted">Nothing here.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {rows.map((l) => {
            const photos = (l.listing_photos as { count: number }[])[0]?.count ?? 0;
            const owner = l.owner as { full_name: string; phone: string } | { full_name: string; phone: string }[] | null;
            const o = Array.isArray(owner) ? owner[0] : owner;
            return (
              <li key={l.id}>
                <Link
                  href={`/admin/listings/${l.id}`}
                  className={`flex flex-col gap-2 rounded-[1.25rem] border bg-white p-4 hover:border-ink sm:flex-row sm:items-center sm:justify-between ${l.status === "pending" ? "border-ember/60 shadow-[0_6px_20px_rgba(194,65,12,.12)]" : "border-line"}`}
                >
                  <span className="flex flex-col gap-1">
                    <span className="font-semibold">{l.title_en || l.title_ta}</span>
                    <span className="text-sm text-muted">
                      {l.type} · {l.location_en || l.location_ta || "No location"} · {photos} photo{photos === 1 ? "" : "s"}
                      {l.owner_id && <> · submitted by <strong>{o?.full_name || "a visitor"}</strong>{o?.phone ? ` (${o.phone})` : ""}</>}
                    </span>
                  </span>
                  <span className="flex flex-wrap gap-1.5">
                    <Badge tone={statusTone[l.status as keyof typeof statusTone]}>{l.status === "pending" ? "needs approval" : l.status}</Badge>
                    {l.featured && <Badge tone="purple">featured</Badge>}
                    {l.is_sample && <Badge tone="orange">sample</Badge>}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}

export default function AdminListings(props: PageProps<"/admin/listings">) {
  return (
    <AdminShell>
      <PageTitle title="Listings">
        <Link href="/admin/listings/new" className="btn-sheen inline-flex min-h-12 items-center rounded-full px-6 font-semibold text-white">
          + Add listing
        </Link>
      </PageTitle>
      <Suspense fallback={<Loading />}>
        <ListingsTable searchParams={props.searchParams} />
      </Suspense>
    </AdminShell>
  );
}
