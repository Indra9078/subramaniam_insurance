import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";

/** Everything the admin dashboard shows, computed from a few small queries. */

export type Range = 7 | 30 | 90;
export const ranges: Range[] = [7, 30, 90];

const TZ = "Asia/Kolkata";
const DAY = 24 * 3600 * 1000;
export const dayKey = (d: Date | string) => new Date(d).toLocaleDateString("en-CA", { timeZone: TZ });

/** The last `n` days (oldest first) as "YYYY-MM-DD" keys in Indian time. */
export function lastDays(n: number): string[] {
  const out: string[] = [];
  for (let i = n - 1; i >= 0; i--) out.push(dayKey(new Date(Date.now() - i * DAY)));
  return out;
}

type Row = { created_at: string };
const inRange = (rows: Row[], days: Set<string>) => rows.filter((r) => days.has(dayKey(r.created_at)));
const daily = (rows: Row[], days: string[]) => {
  const m = new Map(days.map((d) => [d, 0]));
  for (const r of rows) {
    const k = dayKey(r.created_at);
    if (m.has(k)) m.set(k, (m.get(k) ?? 0) + 1);
  }
  return days.map((d) => m.get(d) ?? 0);
};
const tally = <T,>(rows: T[], key: (r: T) => string | null | undefined) => {
  const m = new Map<string, number>();
  for (const r of rows) {
    const k = key(r);
    if (k) m.set(k, (m.get(k) ?? 0) + 1);
  }
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
};

export type Kpi = { label: string; value: number; prev: number; series: number[]; suffix?: string; note?: string };

export type Stats = {
  range: Range;
  days: string[];
  problems: string[];
  kpis: Kpi[];
  perDay: { leads: number[]; requests: number[]; properties: number[] };
  interest: [string, number][];
  leadStatus: [string, number][];
  language: [string, number][];
  sources: [string, number][];
  planRequests: [string, number][];
  listingStatus: [string, number][];
  topics: [string, number][];
  missed: [string, number][];
  assistant: { opens: number; whatsapp: number; calls: number; searches: number };
  attention: { href: string; text: string; tone: "hot" | "warn" | "info" }[];
  activity: { at: string; kind: "lead" | "request" | "property"; text: string; href: string }[];
  totals: { listings: number; published: number; plans: number; testimonials: number; faqs: number; users: number };
};

export async function loadStats(supabase: SupabaseClient, range: Range): Promise<Stats> {
  const days = lastDays(range);
  const prevDays = new Set(lastDays(range * 2).slice(0, range));
  const curDays = new Set(days);
  const since = new Date(Date.now() - (range * 2 + 1) * DAY).toISOString();
  const problems: string[] = [];
  const get = async <T,>(name: string, q: PromiseLike<{ data: T[] | null; error: { message: string } | null }>) => {
    const { data, error } = await q;
    if (error) {
      problems.push(`${name}: ${error.message}`);
      return [] as T[];
    }
    return data ?? [];
  };

  const [leads, requests, listings, profiles, events, plans, testimonials, faqs] = await Promise.all([
    get<{ created_at: string; status: string; interest: string | null; language: string | null; source_page: string | null; name: string }>(
      "leads",
      supabase.from("leads").select("created_at, status, interest, language, source_page, name").gte("created_at", since).order("created_at", { ascending: false }).limit(5000),
    ),
    get<{ id: string; created_at: string; status: string; product_name: string; category: string | null }>(
      "insurance_requests",
      supabase.from("insurance_requests").select("id, created_at, status, product_name, category").gte("created_at", since).order("created_at", { ascending: false }).limit(5000),
    ),
    get<{ id: string; created_at: string; status: string; owner_id: string | null; is_sample: boolean; title_en: string; title_ta: string }>(
      "listings",
      supabase.from("listings").select("id, created_at, status, owner_id, is_sample, title_en, title_ta").order("created_at", { ascending: false }).limit(3000),
    ),
    get<{ created_at: string }>("profiles", supabase.from("profiles").select("created_at").order("created_at", { ascending: false }).limit(5000)),
    get<{ created_at: string; event: string; topic: string | null; query: string | null }>(
      "assistant_events",
      supabase.from("assistant_events").select("created_at, event, topic, query").gte("created_at", since).limit(20000),
    ),
    get<{ status: string; is_sample: boolean }>("insurance_products", supabase.from("insurance_products").select("status, is_sample").limit(500)),
    get<{ id: string }>("testimonials", supabase.from("testimonials").select("id").eq("published", true).limit(500)),
    get<{ is_sample: boolean }>("faqs", supabase.from("faqs").select("is_sample").limit(1000)),
  ]);

  const submitted = listings.filter((l) => l.owner_id);
  const cur = <T extends Row>(rows: T[]) => inRange(rows, curDays) as T[];
  const prv = <T extends Row>(rows: T[]) => inRange(rows, prevDays) as T[];
  const evCur = cur(events);
  const opens = (rows: typeof events) => rows.filter((e) => e.event === "open").length;

  const leadsCur = cur(leads), reqCur = cur(requests), propCur = cur(submitted), usersCur = cur(profiles);
  const sparkEnq = daily([...leads, ...requests], days);
  const contacted = (rows: typeof leads) => rows.filter((l) => l.status !== "new").length;
  const rate = (rows: typeof leads) => (rows.length ? Math.round((contacted(rows) / rows.length) * 100) : 0);

  const pendingListings = listings.filter((l) => l.status === "pending");
  const newRequests = requests.filter((r) => r.status === "new");
  const staleLeads = leads.filter((l) => l.status === "new" && Date.now() - new Date(l.created_at).getTime() > DAY);
  const sampleListings = listings.filter((l) => l.is_sample).length;
  const samplePlans = plans.filter((p) => p.is_sample).length;
  const sampleFaqs = faqs.filter((f) => f.is_sample).length;

  const attention: Stats["attention"] = [];
  if (pendingListings.length) attention.push({ href: "/admin/listings?status=pending", tone: "hot", text: `${pendingListings.length} property listing${pendingListings.length === 1 ? "" : "s"} waiting for your approval` });
  if (newRequests.length) attention.push({ href: "/admin/requests?status=new", tone: "hot", text: `${newRequests.length} new plan request${newRequests.length === 1 ? "" : "s"} to follow up` });
  if (staleLeads.length) attention.push({ href: "/admin/leads?status=new", tone: "warn", text: `${staleLeads.length} lead${staleLeads.length === 1 ? "" : "s"} still marked new after 24 hours` });
  if (sampleListings + samplePlans + sampleFaqs > 0)
    attention.push({ href: "/admin/listings", tone: "info", text: `Sample content is still live: ${sampleListings} listing${sampleListings === 1 ? "" : "s"}, ${samplePlans} plan${samplePlans === 1 ? "" : "s"}, ${sampleFaqs} FAQ${sampleFaqs === 1 ? "" : "s"}. Replace or delete before launch.` });
  if (!testimonials.length) attention.push({ href: "/admin/testimonials", tone: "info", text: "No real testimonials published yet (the About and home pages show placeholders)" });

  const activity: Stats["activity"] = [
    ...leads.slice(0, 8).map((l) => ({ at: l.created_at, kind: "lead" as const, text: `${l.name} sent an enquiry${l.interest ? ` about ${l.interest}` : ""}`, href: "/admin/leads" })),
    ...requests.slice(0, 8).map((r) => ({ at: r.created_at, kind: "request" as const, text: `Plan requested: ${r.product_name}`, href: "/admin/requests" })),
    ...submitted.slice(0, 8).map((l) => ({ at: l.created_at, kind: "property" as const, text: `Property submitted: ${l.title_en || l.title_ta}`, href: `/admin/listings/${l.id}` })),
  ]
    .sort((a, b) => b.at.localeCompare(a.at))
    .slice(0, 8);

  const search = evCur.filter((e) => e.event === "search");
  const stats: Stats = {
    range,
    days,
    problems,
    kpis: [
      { label: "Enquiries", value: leadsCur.length + reqCur.length, prev: prv(leads).length + prv(requests).length, series: sparkEnq, note: "form leads + plan requests" },
      { label: "New leads", value: leadsCur.length, prev: prv(leads).length, series: daily(leads, days) },
      { label: "Plan requests", value: reqCur.length, prev: prv(requests).length, series: daily(requests, days) },
      { label: "Property submissions", value: propCur.length, prev: prv(submitted).length, series: daily(submitted, days), note: `${pendingListings.length} waiting for approval` },
      { label: "New accounts", value: usersCur.length, prev: prv(profiles).length, series: daily(profiles, days) },
      { label: "Leads followed up", value: rate(leadsCur), prev: rate(prv(leads)), series: [], suffix: "%", note: "no longer marked new" },
      { label: "Vinu opened", value: opens(evCur), prev: opens(prv(events)), series: daily(events.filter((e) => e.event === "open"), days), note: "assistant chats started" },
    ],
    perDay: { leads: daily(leads, days), requests: daily(requests, days), properties: daily(submitted, days) },
    interest: tally(leadsCur, (l) => l.interest ?? "other"),
    leadStatus: tally(leadsCur, (l) => l.status),
    language: tally(leadsCur, (l) => l.language),
    sources: tally(leadsCur, (l) => (l.source_page ? l.source_page.replace(/^\/(en|ta)/, "") || "/" : null)).slice(0, 6),
    planRequests: tally(reqCur, (r) => r.product_name).slice(0, 6),
    listingStatus: tally(listings.filter((l) => !l.is_sample), (l) => l.status),
    topics: tally(evCur.filter((e) => e.event === "topic" && e.topic && e.topic !== "home"), (e) => e.topic).slice(0, 8),
    missed: tally(search.filter((e) => e.topic === "nomatch"), (e) => e.query?.toLowerCase()).slice(0, 8),
    assistant: {
      opens: opens(evCur),
      whatsapp: evCur.filter((e) => e.event === "contact" && e.topic === "whatsapp").length,
      calls: evCur.filter((e) => e.event === "contact" && e.topic === "call").length,
      searches: search.length,
    },
    attention,
    activity,
    totals: {
      listings: listings.length,
      published: listings.filter((l) => l.status === "published").length,
      plans: plans.filter((p) => p.status === "published").length,
      testimonials: testimonials.length,
      faqs: faqs.length,
      users: profiles.length,
    },
  };
  return stats;
}
