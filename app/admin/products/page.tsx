import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Badge, Loading, PageTitle } from "@/components/admin/fields";
import { categoryLabels } from "@/components/admin/ProductForm";
import { PlanCover } from "@/components/insurance/PlanCover";
import { requireAdmin } from "@/lib/admin/auth";
import { productImageUrl } from "@/lib/supabase/env";
import type { PlanCategory } from "@/lib/types";

async function ProductList() {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase
    .from("insurance_products")
    .select("id, slug, category, insurer, status, featured, name_en, image_path, is_sample")
    .order("featured", { ascending: false })
    .order("sort")
    .order("created_at");
  if (error)
    return (
      <p className="break-words rounded-[1.25rem] border border-ember/40 bg-white p-5 text-sm">
        Could not load plans: {error.message}. Run <code>supabase/migrations/0004_products_accounts.sql</code> in Supabase first.
      </p>
    );
  if (!data.length)
    return (
      <p className="break-words rounded-[1.25rem] border border-dashed border-line bg-white p-8 text-center text-muted">
        No plans yet. Add one, or run <code>supabase/seed_products.sql</code> for sample plans.
      </p>
    );
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {data.map((p) => (
        <li key={p.id}>
          <Link href={`/admin/products/${p.id}`} className="flex h-full flex-col overflow-hidden rounded-[1.25rem] border border-line bg-white transition-shadow hover:shadow-[0_12px_30px_rgba(194,65,12,.15)]">
            <div className="relative h-32">
              {p.image_path ? (
                <Image src={productImageUrl(p.image_path)} alt="" fill sizes="360px" className="object-cover" />
              ) : (
                <PlanCover category={p.category as PlanCategory} className="h-full" />
              )}
            </div>
            <div className="flex flex-1 flex-col gap-1.5 p-4">
              <span className="font-semibold">{p.name_en}</span>
              <span className="text-sm text-muted">{categoryLabels[p.category]}{p.insurer ? ` · ${p.insurer}` : ""}</span>
              <span className="mt-auto flex flex-wrap gap-1.5 pt-2">
                <Badge tone={p.status === "published" ? "green" : "grey"}>{p.status}</Badge>
                {p.featured && <Badge tone="purple">featured</Badge>}
                {p.is_sample && <Badge tone="orange">sample</Badge>}
              </span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function AdminProducts() {
  return (
    <AdminShell>
      <PageTitle title="Insurance plans">
        <Link href="/admin/products/new" className="btn-sheen inline-flex min-h-12 items-center rounded-full px-6 font-semibold text-white">
          + Add plan
        </Link>
      </PageTitle>
      <Suspense fallback={<Loading />}>
        <ProductList />
      </Suspense>
    </AdminShell>
  );
}
