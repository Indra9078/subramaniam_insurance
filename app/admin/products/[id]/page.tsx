import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { Badge, Loading, PageTitle } from "@/components/admin/fields";
import { ProductForm, type ProductRecord } from "@/components/admin/ProductForm";
import { ProductImage } from "@/components/admin/ProductImage";
import { requireAdmin } from "@/lib/admin/auth";
import { productImageUrl } from "@/lib/supabase/env";
import { deleteProduct } from "../../actions";

export const metadata: Metadata = { title: "Edit plan" };

async function EditProduct({ params, searchParams }: PageProps<"/admin/products/[id]">) {
  const { supabase } = await requireAdmin();
  const { id } = await params;
  const { created } = await searchParams;
  const { data } = await supabase.from("insurance_products").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const product = data as ProductRecord;

  return (
    <>
      <PageTitle title={product.name_en || "Edit plan"}>
        <span className="flex flex-wrap items-center gap-2">
          {product.is_sample && <Badge tone="orange">sample: saving marks it real</Badge>}
          {product.status === "published" && (
            <Link href={`/en/insurance/plans/${product.slug}`} target="_blank" className="text-sm font-semibold text-ember underline-offset-4 hover:underline">
              View on site ↗
            </Link>
          )}
        </span>
      </PageTitle>
      {created && <p className="mb-6 rounded-[12px] bg-[#e1f4e8] p-3 text-sm font-semibold text-[#1f7a46]">Plan created. Add an image below.</p>}
      <div className="flex flex-col gap-8">
        <ProductImage productId={product.id} url={product.image_path ? productImageUrl(product.image_path) : null} />
        <ProductForm product={product} />
        <div className="border-t border-line pt-6">
          <ConfirmButton action={deleteProduct.bind(null, product.id)} label="Delete plan" message="Delete this plan and its image? Requests already made for it are kept." />
        </div>
      </div>
    </>
  );
}

export default function EditProductPage(props: PageProps<"/admin/products/[id]">) {
  return (
    <AdminShell>
      <Suspense fallback={<Loading />}>
        <EditProduct {...props} />
      </Suspense>
    </AdminShell>
  );
}
