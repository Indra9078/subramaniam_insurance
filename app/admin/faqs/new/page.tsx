import { Suspense } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Loading, PageTitle } from "@/components/admin/fields";
import { FaqForm } from "@/components/admin/FaqForm";
import { requireAdmin } from "@/lib/admin/auth";

async function NewFaq() {
  await requireAdmin();
  return <FaqForm />;
}

export default function NewFaqPage() {
  return (
    <AdminShell>
      <PageTitle title="New FAQ" />
      <Suspense fallback={<Loading />}>
        <NewFaq />
      </Suspense>
    </AdminShell>
  );
}
