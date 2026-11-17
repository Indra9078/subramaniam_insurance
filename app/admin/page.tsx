import Link from "next/link";
import { Suspense } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { ChartTips } from "@/components/admin/ChartTips";
import { Card, ColumnChart, RankedBars, SegmentedBar, StatTile } from "@/components/admin/charts";
import { Loading } from "@/components/admin/fields";
import { requireAdmin } from "@/lib/admin/auth";
import { loadStats, ranges, type Range } from "@/lib/admin/stats";

const topicNames: Record<string, string> = {
  health: "Health insurance", life: "Life insurance", vehicle: "Vehicle insurance", corporate: "Corporate and group",
  property: "Property", claims: "Claims help", talk: "Talk to Mr. Subramaniam", faq: "An FAQ answer",
  covers: "What does it cover?", suits: "Who is it for?", documents: "Documents needed", faqs: "Common questions",
  callback: "Call-back form", sell: "Sell or rent", all: "All", plot: "Plots", house: "Houses",
  apartment: "Apartments", commercial: "Commercial", general: "General", any: "Any area", nomatch: "No match",
};
const topicLabel = (t: string) => t.split(":").map((p) => topicNames[p] ?? p.replace(/-/g, " ")).join(" › ");
const interestLabel = (k: string) => ({ health: "Health insurance", life: "Life insurance", vehicle: "Vehicle insurance", corporate: "Corporate and group", property: "Property", other: "Something else" })[k] ?? k;
const statusLabel = (k: string) => ({ new: "New", contacted: "Contacted", closed: "Closed", pending: "Waiting for approval", published: "Published", draft: "Draft", sold: "Sold", rejected: "Rejected" })[k] ?? k;

const greeting = () => {
  const h = Number(new Date().toLocaleString("en-GB", { hour: "2-digit", hour12: false, timeZone: "Asia/Kolkata" }));
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
};
const ago = (iso: string) => {
  const m = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  return m < 60 ? `${m} min ago` : m < 1440 ? `${Math.round(m / 60)} h ago` : `${Math.round(m / 1440)} d ago`;
};

async function Dashboard({ searchParams }: { searchParams: PageProps<"/admin">["searchParams"] }) {
  const { supabase, email } = await requireAdmin();
  const sp = await searchParams;
  const r = Number(sp.range);
  const range: Range = (ranges as number[]).includes(r) ? (r as Range) : 30;
  const s = await loadStats(supabase, range);
  const enq = s.kpis[0];
  const dot = { hot: "bg-[#c2410c]", warn: "bg-[#eda100]", info: "bg-[#6250d6]" } as const;
  const kindLabel = { lead: "Lead", request: "Request", property: "Property" } as const;

  return (
    <div className="flex flex-col gap-6" style={{ "--s1": "#c2410c", "--s2": "#6250d6", "--s3": "#1baf7a", "--track": "#fde7d3" } as React.CSSProperties}>
      <ChartTips />

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-muted">{greeting()}, {email}</p>
          <h1 className="font-display text-3xl font-bold md:text-4xl">Your business at a glance</h1>
        </div>
        <nav aria-label="Time range" className="flex gap-1 rounded-full border border-line bg-white p-1">
          {ranges.map((x) => (
            <Link key={x} href={`/admin?range=${x}`} aria-current={x === range ? "page" : undefined}
              className={`inline-flex min-h-10 items-center rounded-full px-4 text-sm font-semibold ${x === range ? "bg-ink text-white" : "text-ink hover:bg-paper"}`}>
              {x} days
            </Link>
          ))}
        </nav>
      </div>

      {s.problems.length > 0 && (
        <p className="break-words rounded-[1.25rem] border border-ember/40 bg-white p-4 text-sm">
          Some numbers are missing because of: {s.problems.join("; ")}. If a table does not exist yet, run the latest file in <code>supabase/migrations</code> in the Supabase SQL editor.
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile hero range={range} {...enq} />
        {s.kpis.slice(1, 3).map((k) => <StatTile key={k.label} range={range} {...k} />)}
        {s.kpis.slice(3).map((k) => <StatTile key={k.label} range={range} {...k} />)}
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <Card title="Needs your attention" sub="The quickest wins today" className="lg:col-span-3">
          {s.attention.length === 0 ? (
            <p className="rounded-[12px] bg-[#e7f5ec] p-4 text-sm font-semibold text-[#1f7a46]">All caught up. Nothing is waiting for you.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {s.attention.map((a) => (
                <li key={a.text}>
                  <Link href={a.href} className="flex items-start gap-3 rounded-[14px] border border-line p-3.5 text-[15px] hover:border-ink">
                    <span aria-hidden="true" className={`mt-1.5 size-2.5 shrink-0 rounded-full ${dot[a.tone]}`} />
                    <span className="flex-1">{a.text}</span>
                    <span aria-hidden="true" className="text-ember">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <div className="flex flex-wrap gap-2.5 pt-1">
            <Link href="/admin/listings/new" className="btn-sheen inline-flex min-h-11 items-center rounded-full px-5 text-sm font-semibold text-white">+ Listing</Link>
            <Link href="/admin/products/new" className="inline-flex min-h-11 items-center rounded-full border border-line bg-white px-5 text-sm font-semibold hover:border-ink">+ Plan</Link>
            <Link href="/admin/faqs/new" className="inline-flex min-h-11 items-center rounded-full border border-line bg-white px-5 text-sm font-semibold hover:border-ink">+ FAQ</Link>
            <Link href="/admin/testimonials/new" className="inline-flex min-h-11 items-center rounded-full border border-line bg-white px-5 text-sm font-semibold hover:border-ink">+ Testimonial</Link>
          </div>
        </Card>

        <Card title="Recent activity" sub="Latest enquiries, requests and submissions" className="lg:col-span-2">
          {s.activity.length === 0 ? (
            <p className="rounded-[12px] border border-dashed border-line p-5 text-center text-sm text-muted">Nothing yet. New enquiries appear here as they arrive.</p>
          ) : (
            <ol className="flex flex-col">
              {s.activity.map((a) => (
                <li key={a.at + a.text} className="border-t border-line first:border-0">
                  <Link href={a.href} className="flex items-start gap-3 py-2.5 text-sm hover:text-ember">
                    <span className="mt-0.5 w-16 shrink-0 rounded-full bg-[#fff0c2] px-2 py-0.5 text-center text-xs font-semibold text-[#7a5200]">{kindLabel[a.kind]}</span>
                    <span className="flex-1">{a.text}</span>
                    <time dateTime={a.at} className="shrink-0 text-xs text-muted">{ago(a.at)}</time>
                  </Link>
                </li>
              ))}
            </ol>
          )}
        </Card>
      </div>

      <Card title="Enquiries per day" sub={`Last ${range} days, by where they came from`}>
        <ColumnChart
          title="Enquiries per day"
          days={s.days}
          series={[
            { name: "Form leads", color: "var(--s1)", values: s.perDay.leads },
            { name: "Plan requests", color: "var(--s2)", values: s.perDay.requests },
            { name: "Property submissions", color: "var(--s3)", values: s.perDay.properties },
          ]}
        />
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="What people ask about" sub={`Form leads in the last ${range} days, by interest`}>
          <RankedBars rows={s.interest} label={interestLabel} empty="No leads in this period yet." />
        </Card>
        <div className="grid gap-4">
          <Card title="Lead follow-up" sub="Are enquiries being picked up?">
            <SegmentedBar
              empty="No leads in this period yet."
              parts={[
                { label: "New", value: s.leadStatus.find(([k]) => k === "new")?.[1] ?? 0, color: "var(--s1)", text: "#fff" },
                { label: "Contacted", value: s.leadStatus.find(([k]) => k === "contacted")?.[1] ?? 0, color: "var(--s2)", text: "#fff" },
                { label: "Closed", value: s.leadStatus.find(([k]) => k === "closed")?.[1] ?? 0, color: "var(--s3)", text: "#2a1208" },
              ]}
            />
          </Card>
          <Card title="Language of visitors" sub="Which version of the site leads came from">
            <SegmentedBar
              empty="No leads in this period yet."
              parts={[
                { label: "English", value: s.language.find(([k]) => k === "en")?.[1] ?? 0, color: "var(--s1)", text: "#fff" },
                { label: "Tamil", value: s.language.find(([k]) => k === "ta")?.[1] ?? 0, color: "var(--s2)", text: "#fff" },
              ]}
            />
          </Card>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card title="Pages that bring enquiries" sub="Where the form was filled in">
          <RankedBars rows={s.sources} empty="No enquiries in this period yet." />
        </Card>
        <Card title="Most requested plans" sub="From signed-in visitors">
          <RankedBars rows={s.planRequests} empty="No plan requests in this period yet." />
        </Card>
        <Card title="Property pipeline" sub="All real listings by status">
          <RankedBars rows={s.listingStatus} label={statusLabel} empty="No listings yet." />
        </Card>
      </div>

      <Card title="Vinu, the assistant" sub={`Anonymous counts for the last ${range} days`}>
        <div className="grid gap-4 lg:grid-cols-5">
          <dl className="grid grid-cols-2 gap-3 lg:col-span-2">
            {[
              ["Opened", s.assistant.opens],
              ["Searches", s.assistant.searches],
              ["WhatsApp taps", s.assistant.whatsapp],
              ["Call taps", s.assistant.calls],
            ].map(([k, v]) => (
              <div key={k} className="rounded-[14px] bg-[#fff6ec] p-4">
                <dt className="text-xs font-semibold text-muted">{k}</dt>
                <dd className="font-display text-3xl font-bold">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="flex flex-col gap-5 lg:col-span-3">
            <div>
              <h3 className="mb-2 text-sm font-semibold">Most opened topics</h3>
              <RankedBars rows={s.topics} label={topicLabel} empty="No topics opened yet." />
            </div>
            <div>
              <h3 className="mb-2 text-sm font-semibold">Searches with no answer (good ideas for new FAQs)</h3>
              {s.missed.length ? (
                <ul className="flex flex-wrap gap-2">
                  {s.missed.map(([q, n]) => <li key={q} className="rounded-full bg-[#fff0c2] px-3 py-1 text-sm text-[#7a5200]">{q} <strong>×{n}</strong></li>)}
                </ul>
              ) : <p className="text-sm text-muted">None yet.</p>}
            </div>
          </div>
        </div>
      </Card>

      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {[
          ["Live listings", s.totals.published, "/admin/listings"],
          ["All listings", s.totals.listings, "/admin/listings"],
          ["Live plans", s.totals.plans, "/admin/products"],
          ["Testimonials", s.totals.testimonials, "/admin/testimonials"],
          ["FAQs", s.totals.faqs, "/admin/faqs"],
          ["Accounts", s.totals.users, "/admin/requests"],
        ].map(([k, v, href]) => (
          <li key={String(k)}>
            <Link href={String(href)} className="flex flex-col rounded-[1.25rem] border border-line bg-white p-4 transition-shadow hover:shadow-[0_10px_28px_rgba(194,65,12,.14)]">
              <span className="text-xs font-semibold text-muted">{k}</span>
              <span className="font-display text-2xl font-bold">{v}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function AdminHome(props: PageProps<"/admin">) {
  return (
    <AdminShell>
      <Suspense fallback={<Loading />}>
        <Dashboard searchParams={props.searchParams} />
      </Suspense>
    </AdminShell>
  );
}
