import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { Badge, Loading, PageTitle } from "@/components/admin/fields";
import { requireAdmin } from "@/lib/admin/auth";
import { deleteRequest, updateRequest } from "../actions";

export const metadata: Metadata = { title: "Plan requests" };

const statuses = ["new", "contacted", "in_progress", "completed", "closed"] as const;
const label = { new: "New", contacted: "Contacted", in_progress: "In progress", completed: "Completed", closed: "Closed" };
const tone = { new: "orange", contacted: "purple", in_progress: "purple", completed: "green", closed: "grey" } as const;

async function Requests({ searchParams }: { searchParams: PageProps<"/admin/requests">["searchParams"] }) {
  const { supabase } = await requireAdmin();
  const { status } = await searchParams;
  const filter = typeof status === "string" && (statuses as readonly string[]).includes(status) ? status : "all";
  const { data, error } = await supabase
    .from("insurance_requests")
    .select("id, created_at, product_name, category, insurer, phone, preferred_time, message, status, advisor_note, person:profiles(full_name, phone, email)")
    .order("created_at", { ascending: false })
    .limit(300);
  if (error)
    return (
      <p className="break-words rounded-[1.25rem] border border-ember/40 bg-white p-5 text-sm">
        Could not load requests: {error.message}. Run <code>supabase/migrations/0004_products_accounts.sql</code> in Supabase first.
      </p>
    );
  const counts: Record<string, number> = { all: data.length, ...Object.fromEntries(statuses.map((s) => [s, data.filter((r) => r.status === s).length])) };
  const rows = data.filter((r) => filter === "all" || r.status === filter);

  return (
    <>
      <nav aria-label="Filter requests" className="mb-5 flex flex-wrap gap-2">
        {["all", ...statuses].map((s) => (
          <Link
            key={s}
            href={s === "all" ? "/admin/requests" : `/admin/requests?status=${s}`}
            aria-current={filter === s ? "page" : undefined}
            className={`inline-flex min-h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold ${filter === s ? "bg-ink text-white" : "border border-line bg-white"}`}
          >
            {s === "all" ? "All" : label[s as keyof typeof label]}
            <span className={`rounded-full px-2 text-xs ${s === "new" && counts[s] > 0 ? "bg-ember text-white" : "bg-black/10"}`}>{counts[s]}</span>
          </Link>
        ))}
      </nav>
      {!rows.length ? (
        <p className="rounded-[1.25rem] border border-dashed border-line bg-white p-8 text-center text-muted">
          No requests here yet. When a signed-in visitor requests a plan, it appears here and you get an email.
        </p>
      ) : (
        <ul className="flex flex-col gap-4">
          {rows.map((r) => {
            const person = Array.isArray(r.person) ? r.person[0] : r.person;
            return (
              <li key={r.id} className="flex flex-col gap-3 rounded-[1.25rem] border border-line bg-white p-4 md:p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-display text-lg font-bold">{r.product_name}</span>
                  {r.insurer && <span className="text-sm text-muted">{r.insurer}</span>}
                  <Badge tone={tone[r.status as keyof typeof tone]}>{label[r.status as keyof typeof label]}</Badge>
                  <span className="ml-auto text-xs text-muted">
                    {new Date(r.created_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" })}
                  </span>
                </div>
                <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                  <strong>{person?.full_name || "Visitor"}</strong>
                  <a href={`tel:+91${r.phone}`} className="font-semibold text-ember">{r.phone}</a>
                  <a href={`https://wa.me/91${r.phone}`} target="_blank" rel="noopener" className="rounded-full bg-[#1f7a46] px-3 py-0.5 text-xs font-semibold text-white">WhatsApp</a>
                  {person?.email && <span className="text-muted">{person.email}</span>}
                  {r.preferred_time && <span className="text-muted">call: {r.preferred_time}</span>}
                </p>
                {r.message && <p className="whitespace-pre-line rounded-[10px] bg-paper p-3 text-sm">{r.message}</p>}
                <form action={updateRequest.bind(null, r.id)} className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <select name="status" defaultValue={r.status} aria-label="Status" className="min-h-11 rounded-[10px] border border-[#cfccd6] bg-white px-3">
                    {statuses.map((s) => <option key={s} value={s}>{label[s]}</option>)}
                  </select>
                  <input name="note" defaultValue={r.advisor_note ?? ""} maxLength={500} placeholder="Note shown to the visitor (optional)" aria-label="Note for the visitor" className="min-h-11 flex-1 rounded-[10px] border border-[#cfccd6] bg-white px-3" />
                  <button type="submit" className="min-h-11 rounded-full bg-ink px-5 text-sm font-semibold text-white">Update</button>
                </form>
                <div className="flex justify-end">
                  <ConfirmButton action={deleteRequest.bind(null, r.id)} label="Delete" message="Delete this request?" />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}

export default function AdminRequests(props: PageProps<"/admin/requests">) {
  return (
    <AdminShell>
      <PageTitle title="Plan requests" />
      <p className="-mt-3 mb-5 text-sm text-muted">Requests from visitors who signed in. They can follow the status and your note in their account.</p>
      <Suspense fallback={<Loading />}>
        <Requests searchParams={props.searchParams} />
      </Suspense>
    </AdminShell>
  );
}
