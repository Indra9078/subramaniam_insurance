import Link from "next/link";
import { Suspense } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Loading, PageTitle } from "@/components/admin/fields";
import { requireAdmin } from "@/lib/admin/auth";

async function Dashboard() {
  const { supabase, email } = await requireAdmin();
  const count = async (table: string, filter?: [string, string]) => {
    let q = supabase.from(table).select("id", { count: "exact", head: true });
    if (filter) q = q.eq(filter[0], filter[1]);
    const { count } = await q;
    return count ?? 0;
  };
  const [listings, published, newLeads, testimonials, faqs, samples] = await Promise.all([
    count("listings"),
    count("listings", ["status", "published"]),
    count("leads", ["status", "new"]),
    count("testimonials"),
    count("faqs"),
    supabase.from("listings").select("id", { count: "exact", head: true }).eq("is_sample", true),
  ]);
  const sampleFaqs = await supabase.from("faqs").select("id", { count: "exact", head: true }).eq("is_sample", true);

  const cards = [
    { href: "/admin/listings", label: "Listings", value: listings, note: `${published} published`, cls: "bg-[#ffe9df]" },
    { href: "/admin/leads", label: "New leads", value: newLeads, note: "Website forms connect in Stage 6", cls: "bg-[#e7f5ec]" },
    { href: "/admin/testimonials", label: "Testimonials", value: testimonials, note: "Publish only with written permission", cls: "bg-iris-100" },
    { href: "/admin/faqs", label: "FAQs", value: faqs, note: "Shown on the FAQ, home and insurance pages", cls: "bg-[#fff3cf]" },
  ];

  return (
    <>
      <PageTitle title="Dashboard" />
      <p className="-mt-3 mb-6 text-sm text-muted">Logged in as {email}</p>
      <ul className="grid gap-4 sm:grid-cols-2">
        {cards.map((c) => (
          <li key={c.href}>
            <Link href={c.href} className={`flex flex-col gap-1 rounded-[1.5rem] p-6 transition-transform hover:-translate-y-1 ${c.cls}`}>
              <span className="text-sm font-semibold text-muted">{c.label}</span>
              <span className="font-display text-4xl font-bold">{c.value}</span>
              <span className="text-sm text-muted">{c.note}</span>
            </Link>
          </li>
        ))}
      </ul>
      {((samples.count ?? 0) > 0 || (sampleFaqs.count ?? 0) > 0) && (
        <div className="mt-6 rounded-[1.25rem] border border-iris-200 bg-iris-50 p-5 text-sm leading-6">
          <strong>Sample content is still live:</strong> {samples.count ?? 0} listings and {sampleFaqs.count ?? 0} FAQs
          are marked as samples and glow on the website. Edit and save each one with real details, or delete it.
        </div>
      )}
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/admin/listings/new" className="btn-sheen inline-flex min-h-12 items-center rounded-full px-6 font-semibold text-white">
          + Add a listing
        </Link>
        <Link href="/admin/faqs/new" className="inline-flex min-h-12 items-center rounded-full border border-line bg-white px-6 font-semibold">
          + Add an FAQ
        </Link>
      </div>
    </>
  );
}

export default function AdminHome() {
  return (
    <AdminShell>
      <Suspense fallback={<Loading />}>
        <Dashboard />
      </Suspense>
    </AdminShell>
  );
}
