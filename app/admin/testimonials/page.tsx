import Link from "next/link";
import { Suspense } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Badge, Loading, PageTitle } from "@/components/admin/fields";
import { requireAdmin } from "@/lib/admin/auth";

async function List() {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase
    .from("testimonials")
    .select("id, name, area, quote_en, quote_ta, published, permission_received")
    .order("sort")
    .order("created_at");
  if (error) return <p className="text-ember">Could not load testimonials: {error.message}</p>;
  if (!data.length)
    return (
      <p className="rounded-[1.25rem] border border-dashed border-line bg-white p-8 text-center text-muted">
        No testimonials yet. Until one is published, the website shows placeholders.
      </p>
    );
  return (
    <ul className="flex flex-col gap-3">
      {data.map((t) => (
        <li key={t.id}>
          <Link href={`/admin/testimonials/${t.id}`} className="flex flex-col gap-2 rounded-[1.25rem] border border-line bg-white p-4 hover:border-ink">
            <span className="flex flex-wrap items-center gap-2">
              <span className="font-semibold">{t.name}</span>
              {t.area && <span className="text-sm text-muted">{t.area}</span>}
              {t.published ? <Badge tone="green">published</Badge> : <Badge>hidden</Badge>}
              {!t.permission_received && <Badge tone="orange">no permission yet</Badge>}
            </span>
            <span className="line-clamp-2 text-sm text-muted">{t.quote_en || t.quote_ta}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function AdminTestimonials() {
  return (
    <AdminShell>
      <PageTitle title="Testimonials">
        <Link href="/admin/testimonials/new" className="btn-sheen inline-flex min-h-12 items-center rounded-full px-6 font-semibold text-white">
          + Add testimonial
        </Link>
      </PageTitle>
      <Suspense fallback={<Loading />}>
        <List />
      </Suspense>
    </AdminShell>
  );
}
