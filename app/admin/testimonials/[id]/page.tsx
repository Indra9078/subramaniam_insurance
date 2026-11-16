import { Suspense } from "react";
import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { Loading, PageTitle } from "@/components/admin/fields";
import { TestimonialForm, type TestimonialRecord } from "@/components/admin/TestimonialForm";
import { requireAdmin } from "@/lib/admin/auth";
import { deleteTestimonial } from "../../actions";

async function EditTestimonial({ params }: PageProps<"/admin/testimonials/[id]">) {
  const { supabase } = await requireAdmin();
  const { id } = await params;
  const { data } = await supabase.from("testimonials").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  return (
    <>
      <PageTitle title={`Testimonial: ${data.name}`} />
      <TestimonialForm t={data as TestimonialRecord} />
      <div className="mt-8 border-t border-line pt-6">
        <ConfirmButton action={deleteTestimonial.bind(null, id)} label="Delete testimonial" />
      </div>
    </>
  );
}

export default function EditTestimonialPage(props: PageProps<"/admin/testimonials/[id]">) {
  return (
    <AdminShell>
      <Suspense fallback={<Loading />}>
        <EditTestimonial {...props} />
      </Suspense>
    </AdminShell>
  );
}
