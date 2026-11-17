import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/LoginForm";
import { getAdmin } from "@/lib/admin/auth";
import { signOut } from "../actions";
import { supabaseConfigProblem } from "@/lib/supabase/env";

export const metadata: Metadata = { title: "Log in" };

/** Already logged in? Go to the dashboard. Logged in without admin access? Say so. */
async function LoginState() {
  const problem = supabaseConfigProblem();
  if (problem) {
    return (
      <div className="rounded-[12px] border border-ember/40 bg-[#ffe9df] p-4 text-sm leading-6">
        <strong>Login is not set up on this deployment.</strong> {problem} Fix it in Vercel (Project Settings,
        Environment Variables), then redeploy.
      </div>
    );
  }
  const admin = await getAdmin().catch(() => null);
  if (admin?.isAdmin) redirect("/admin");
  if (admin) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-sm">
          You are logged in as <strong>{admin.email}</strong>, which does not have admin access.
        </p>
        <form action={signOut}>
          <button type="submit" className="min-h-11 rounded-full border border-line px-5 font-semibold">
            Log out
          </button>
        </form>
      </div>
    );
  }
  return <LoginForm />;
}

export default function LoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center bg-[linear-gradient(150deg,#3d0f04_0%,#8a2a0a_42%,#d9480f_78%,#ff9f45_100%)] px-4 py-16">
      <div className="w-full max-w-sm rounded-[1.75rem] bg-paper p-7 shadow-[0_30px_80px_rgba(61,15,4,.5)] md:p-9">
        <p className="text-sm font-semibold uppercase tracking-wider text-ember">Admin</p>
        <h1 className="mt-1 font-display text-2xl font-bold">A. Subramaniam</h1>
        <p className="mb-6 mt-2 text-sm text-muted">Log in to manage listings, testimonials, FAQs and leads.</p>
        <Suspense fallback={<p className="text-sm text-muted">Loading…</p>}>
          <LoginState />
        </Suspense>
      </div>
    </main>
  );
}
