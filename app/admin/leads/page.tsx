import Link from "next/link";
import { Suspense } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Badge, Loading, PageTitle } from "@/components/admin/fields";
import { requireAdmin } from "@/lib/admin/auth";
import { deleteLead, setLeadStatus } from "../actions";
import { ConfirmButton } from "@/components/admin/ConfirmButton";

const tone = { new: "orange", contacted: "purple", closed: "grey" } as const;
const statuses = ["all", "new", "contacted", "closed"] as const;

async function LeadsList({ searchParams }: { searchParams: PageProps<"/admin/leads">["searchParams"] }) {
  const { supabase } = await requireAdmin();
  const { status } = await searchParams;
  const filter = typeof status === "string" && statuses.includes(status as (typeof statuses)[number]) ? status : "all";
  let q = supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(500);
  if (filter !== "all") q = q.eq("status", filter);
  const { data, error } = await q;
  if (error) return <p className="text-ember">Could not load leads: {error.message}</p>;

  return (
    <>
      <nav aria-label="Filter leads" className="mb-5 flex flex-wrap gap-2">
        {statuses.map((s) => (
          <Link
            key={s}
            href={s === "all" ? "/admin/leads" : `/admin/leads?status=${s}`}
            aria-current={filter === s ? "page" : undefined}
            className={`inline-flex min-h-10 items-center rounded-full px-4 text-sm font-semibold capitalize ${filter === s ? "bg-ink text-white" : "border border-line bg-white"}`}
          >
            {s}
          </Link>
        ))}
      </nav>
      {!data.length ? (
        <p className="rounded-[1.25rem] border border-dashed border-line bg-white p-8 text-center text-muted">
          No leads yet. Enquiries from the website forms appear here, and each one is also emailed to you.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {data.map((l) => (
            <li key={l.id} className="flex flex-col gap-3 rounded-[1.25rem] border border-line bg-white p-4 md:p-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold">{l.name}</span>
                <a href={`tel:+91${l.phone}`} className="text-sm font-semibold text-ember underline-offset-4 hover:underline">{l.phone}</a>
                <a href={`https://wa.me/91${l.phone}`} target="_blank" rel="noopener" className="rounded-full bg-[#1f7a46] px-3 py-0.5 text-xs font-semibold text-white">WhatsApp</a>
                {l.email && <a href={`mailto:${l.email}`} className="text-sm text-muted">{l.email}</a>}
                <Badge tone={tone[l.status as keyof typeof tone]}>{l.status}</Badge>
                <span className="ml-auto text-xs text-muted">
                  {new Date(l.created_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" })}
                </span>
              </div>
              <p className="text-sm text-muted">
                {[
                  l.listing_title ? `Property: ${l.listing_title}` : l.interest,
                  l.preferred_time && `call: ${l.preferred_time}`,
                  l.language === "ta" ? "Tamil" : l.language === "en" ? "English" : null,
                  l.source_page,
                ].filter(Boolean).join(" · ")}
              </p>
              {l.details && Object.keys(l.details).length > 0 && (
                <dl className="flex flex-wrap gap-x-5 gap-y-1 text-sm">
                  {Object.entries(l.details as Record<string, string>).map(([k, v]) => (
                    <div key={k} className="flex gap-1.5">
                      <dt className="text-muted">{k}:</dt>
                      <dd className="font-semibold">{v}</dd>
                    </div>
                  ))}
                </dl>
              )}
              {l.message && <p className="whitespace-pre-line text-sm">{l.message}</p>}
              <form action={setLeadStatus.bind(null, l.id)} className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <select name="status" defaultValue={l.status} aria-label="Status" className="min-h-11 rounded-[10px] border border-[#cfccd6] bg-white px-3">
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="closed">Closed</option>
                </select>
                <input name="notes" defaultValue={l.notes ?? ""} placeholder="Notes" aria-label="Notes" className="min-h-11 flex-1 rounded-[10px] border border-[#cfccd6] bg-white px-3" />
                <button type="submit" className="min-h-11 rounded-full bg-ink px-5 text-sm font-semibold text-white">Update</button>
              </form>
              <div className="flex justify-end">
                <ConfirmButton action={deleteLead.bind(null, l.id)} label="Delete lead" message={`Delete the lead from ${l.name}? This cannot be undone.`} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export default function AdminLeads(props: PageProps<"/admin/leads">) {
  return (
    <AdminShell>
      <PageTitle title="Leads">
        <a href="/admin/leads/export" download className="inline-flex min-h-12 items-center rounded-full border border-line bg-white px-6 font-semibold">
          Download CSV
        </a>
      </PageTitle>
      <p className="-mt-3 mb-5 text-sm text-muted">
        Leads are personal data. Use them only to reply to the enquiry, and do not share the export.
      </p>
      <Suspense fallback={<Loading />}>
        <LeadsList searchParams={props.searchParams} />
      </Suspense>
    </AdminShell>
  );
}
