import "server-only";
import { redirect } from "next/navigation";
import { createSessionClient } from "@/lib/supabase/server";

/**
 * Data Access Layer for the admin area. Verifies the session token with
 * Supabase and checks the email is on the admins list. Returns null otherwise.
 */
export async function getAdmin() {
  const supabase = await createSessionClient();
  const { data } = await supabase.auth.getClaims();
  const email = typeof data?.claims?.email === "string" ? data.claims.email : null;
  if (!email) return null;
  const { data: row } = await supabase.from("admins").select("email").maybeSingle();
  if (!row) return { email, supabase, isAdmin: false as const };
  return { email, supabase, isAdmin: true as const };
}

/** Use at the top of every admin page and server action. */
export async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin?.isAdmin) redirect("/admin/login");
  return admin;
}
