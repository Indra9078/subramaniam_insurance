import "server-only";
import { redirect } from "next/navigation";
import { createSessionClient } from "@/lib/supabase/server";

/** The signed-in visitor (or null). Verifies the session token with Supabase. */
export async function getCurrentUser() {
  const supabase = await createSessionClient();
  const { data } = await supabase.auth.getClaims().catch(() => ({ data: null }));
  const claims = data?.claims;
  if (!claims?.sub) return null;
  return { id: String(claims.sub), email: typeof claims.email === "string" ? claims.email : "", supabase };
}

/** Use at the top of every account page and action. */
export async function requireUser(lang: string, next?: string) {
  const user = await getCurrentUser();
  if (!user) redirect(`/${lang}/account/login${next ? `?next=${encodeURIComponent(next)}` : ""}`);
  return user;
}

export type Profile = { full_name: string; phone: string; email: string };

/** The visitor's profile row (created on sign-up; created here if it is missing). */
export async function getProfile(user: Awaited<ReturnType<typeof requireUser>>): Promise<Profile> {
  const read = () => user.supabase.from("profiles").select("full_name, phone, email").eq("user_id", user.id).maybeSingle();
  let { data } = await read();
  if (!data) {
    await user.supabase.rpc("ensure_profile");
    ({ data } = await read());
  }
  return (data as Profile | null) ?? { full_name: "", phone: "", email: user.email };
}
