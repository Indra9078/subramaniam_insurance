import { Suspense } from "react";
import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { Badge, Loading, PageTitle } from "@/components/admin/fields";
import { FaqForm, type FaqRecord } from "@/components/admin/FaqForm";
import { requireAdmin } from "@/lib/admin/auth";
import { deleteFaq } from "../../actions";

async function EditFaq({ params }: PageProps<"/admin/faqs/[id]">) {
  const { supabase } = await requireAdmin();
  const { id } = await params;
  const { data } = await supabase.from("faqs").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const f = data as FaqRecord;
  return (
    <>
      <PageTitle title="Edit FAQ">
        {f.is_sample && <Badge tone="orange">sample: saving marks it real</Badge>}
      </PageTitle>
      <FaqForm f={f} />
      <div className="mt-8 border-t border-line pt-6">
        <ConfirmButton action={deleteFaq.bind(null, id)} label="Delete FAQ" />
      </div>
    </>
  );
}

export default function EditFaqPage(props: PageProps<"/admin/faqs/[id]">) {
  return (
    <AdminShell>
      <Suspense fallback={<Loading />}>
        <EditFaq {...props} />
      </Suspense>
    </AdminShell>
  );
}
