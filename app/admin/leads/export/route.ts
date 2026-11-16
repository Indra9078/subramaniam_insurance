import { getAdmin } from "@/lib/admin/auth";

const columns = [
  "created_at", "name", "phone", "email", "interest", "preferred_time",
  "message", "source_page", "language", "consent", "status", "notes",
] as const;

/** Quote a CSV cell. Cells starting with = + - @ are prefixed so spreadsheets don't run them as formulas. */
function cell(value: unknown) {
  let s = value === null || value === undefined ? "" : String(value);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
}

/** CSV download of all leads. Admins only. */
export async function GET() {
  const admin = await getAdmin();
  if (!admin?.isAdmin) return new Response("Not authorised", { status: 401 });
  const { data, error } = await admin.supabase
    .from("leads")
    .select(columns.join(","))
    .order("created_at", { ascending: false });
  if (error) return new Response(`Could not export: ${error.message}`, { status: 500 });

  const rows = (data as unknown as Record<string, unknown>[]).map((r) => columns.map((c) => cell(r[c])).join(","));
  const csv = "﻿" + [columns.join(","), ...rows].join("\r\n");
  const date = new Date().toISOString().slice(0, 10);
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="leads-${date}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
