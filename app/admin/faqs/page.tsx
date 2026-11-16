import Link from "next/link";
import { Suspense } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Badge, Loading, PageTitle } from "@/components/admin/fields";
import { faqCategoryLabels } from "@/components/admin/FaqForm";
import { requireAdmin } from "@/lib/admin/auth";
import { faqCategories } from "@/lib/types";

async function List() {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase
    .from("faqs")
    .select("id, category, question_en, published, show_on_home, is_sample")
    .order("sort")
    .order("created_at");
  if (error) return <p className="text-ember">Could not load FAQs: {error.message}</p>;
  if (!data.length)
    return <p className="rounded-[1.25rem] border border-dashed border-line bg-white p-8 text-center text-muted">No FAQs yet.</p>;
  return (
    <div className="flex flex-col gap-8">
      {faqCategories.map((c) => {
        const items = data.filter((f) => f.category === c);
        if (!items.length) return null;
        return (
          <section key={c} className="flex flex-col gap-3">
            <h2 className="font-display text-lg font-bold">{faqCategoryLabels[c]}</h2>
            <ul className="flex flex-col gap-2">
              {items.map((f) => (
                <li key={f.id}>
                  <Link href={`/admin/faqs/${f.id}`} className="flex flex-col gap-2 rounded-[1rem] border border-line bg-white p-4 hover:border-ink sm:flex-row sm:items-center sm:justify-between">
                    <span className="font-semibold">{f.question_en}</span>
                    <span className="flex shrink-0 flex-wrap gap-1.5">
                      {!f.published && <Badge>hidden</Badge>}
                      {f.show_on_home && <Badge tone="purple">home</Badge>}
                      {f.is_sample && <Badge tone="orange">sample</Badge>}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

export default function AdminFaqs() {
  return (
    <AdminShell>
      <PageTitle title="FAQs">
        <Link href="/admin/faqs/new" className="btn-sheen inline-flex min-h-12 items-center rounded-full px-6 font-semibold text-white">
          + Add FAQ
        </Link>
      </PageTitle>
      <Suspense fallback={<Loading />}>
        <List />
      </Suspense>
    </AdminShell>
  );
}
