import { Suspense } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Loading, PageTitle } from "@/components/admin/fields";
import { ProductForm } from "@/components/admin/ProductForm";
import { requireAdmin } from "@/lib/admin/auth";

async function NewProduct() {
  await requireAdmin();
  return (
    <>
      <p className="-mt-3 mb-6 text-sm text-muted">Save the plan first, then add its image.</p>
      <ProductForm />
    </>
  );
}

export default function NewProductPage() {
  return (
    <AdminShell>
      <PageTitle title="New plan" />
      <Suspense fallback={<Loading />}>
        <NewProduct />
      </Suspense>
    </AdminShell>
  );
}
