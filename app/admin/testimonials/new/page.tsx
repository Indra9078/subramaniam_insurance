import { Suspense } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Loading, PageTitle } from "@/components/admin/fields";
import { TestimonialForm } from "@/components/admin/TestimonialForm";
import { requireAdmin } from "@/lib/admin/auth";

async function NewTestimonial() {
  await requireAdmin();
  return <TestimonialForm />;
}

export default function NewTestimonialPage() {
  return (
    <AdminShell>
      <PageTitle title="New testimonial" />
      <Suspense fallback={<Loading />}>
        <NewTestimonial />
      </Suspense>
    </AdminShell>
  );
}
