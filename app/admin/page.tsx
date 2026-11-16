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
    { href: "/admin/leads", label: "New leads", value: newLeads, note: "Each new lead is also emailed to you", cls: "bg-[#e7f5ec]" },
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

const topicNames: Record<string, string> = {
  health: "Health insurance", life: "Life insurance", vehicle: "Vehicle insurance", corporate: "Corporate and group",
  property: "Property", claims: "Claims help", talk: "Talk to Mr. Subramaniam", faq: "An FAQ answer",
  covers: "What does it cover?", suits: "Who is it for?", documents: "Documents needed", faqs: "Common questions",
  callback: "Call-back form", sell: "Sell or rent", all: "All", plot: "Plots", house: "Houses",
  apartment: "Apartments", commercial: "Commercial", general: "General", any: "Any area",
};
const readable = (topic: string) =>
  topic.split(":").map((p) => topicNames[p] ?? p.replace(/-/g, " ")).join(" › ");

type EventRow = { event: string; topic: string | null; query: string | null };

const thirtyDaysAgo = () => new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString();

function count(rows: EventRow[], key: (r: EventRow) => string | null) {
  const m = new Map<string, number>();
  for (const r of rows) {
    const k = key(r);
    if (k) m.set(k, (m.get(k) ?? 0) + 1);
  }
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
}

function Box({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2 rounded-[1.25rem] border border-line bg-white p-5">
      <h3 className="font-semibold">{title}</h3>
      {children}
    </div>
  );
}

function CountList({ rows, empty, label = (k: string) => k }: { rows: [string, number][]; empty: string; label?: (k: string) => string }) {
  return rows.length ? (
    <ol className="flex flex-col gap-1 text-sm">
      {rows.map(([k, n]) => (
        <li key={k} className="flex justify-between gap-3">
          <span className="min-w-0 truncate">{label(k)}</span>
          <span className="font-semibold">{n}</span>
        </li>
      ))}
    </ol>
  ) : (
    <p className="text-sm text-muted">{empty}</p>
  );
}

const contactLabel = (k: string) => (k === "call" ? "Call tapped" : k === "whatsapp" ? "WhatsApp tapped" : k);

/** Anonymous usage counts from the guided assistant (last 30 days). */
async function AssistantStats() {
  const { supabase } = await requireAdmin();
  const since = thirtyDaysAgo();
  const { data, error } = await supabase
    .from("assistant_events")
    .select("event, topic, query")
    .gte("created_at", since)
    .limit(20000);
  if (error) {
    return (
      <p className="text-sm text-muted">
        Assistant usage is not available yet. Run <code>supabase/migrations/0003_assistant.sql</code> in Supabase.
      </p>
    );
  }
  const rows = data as EventRow[];
  const opens = rows.filter((r) => r.event === "open").length;
  const topics = count(rows.filter((r) => r.event === "topic" && r.topic !== "home"), (r) => r.topic).slice(0, 10);
  const contacts = count(rows.filter((r) => r.event === "contact"), (r) => r.topic);
  const searches = rows.filter((r) => r.event === "search");
  const missed = count(searches.filter((r) => r.topic === "nomatch"), (r) => r.query?.toLowerCase() ?? null).slice(0, 10);

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Box title="Overview">
        <p className="text-sm">Opened <strong>{opens}</strong> times · <strong>{searches.length}</strong> searches</p>
        <CountList rows={contacts} empty="No contact taps yet." label={contactLabel} />
      </Box>
      <Box title="Most opened topics">
        <CountList rows={topics} empty="No topics opened yet." label={readable} />
      </Box>
      <Box title="Searches with no answer (add these as FAQs)">
        <CountList rows={missed} empty="None yet." />
      </Box>
    </div>
  );
}

export default function AdminHome() {
  return (
    <AdminShell>
      <Suspense fallback={<Loading />}>
        <Dashboard />
      </Suspense>
      <section className="mt-10">
        <h2 className="mb-4 font-display text-xl font-bold">Assistant, last 30 days</h2>
        <Suspense fallback={<Loading />}>
          <AssistantStats />
        </Suspense>
      </section>
    </AdminShell>
  );
}
