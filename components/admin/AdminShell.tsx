import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { AdminNav } from "./AdminNav";
import { signOut } from "@/app/admin/actions";

/** Header and navigation for logged-in admin pages. */
export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <>
      <header className="relative overflow-hidden bg-[linear-gradient(100deg,#3d0f04_0%,#8a2a0a_38%,#d9480f_74%,#ff9f45_100%)] text-white">
        <div className="pointer-events-none absolute -right-20 -top-32 size-[380px] rounded-full bg-[radial-gradient(circle,rgba(255,236,170,.9),rgba(255,170,80,.3)_45%,transparent_70%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-white/25" />
        <div className="relative mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-3 px-4 py-4 md:px-6">
          <Link href="/admin" className="flex items-center gap-2.5 font-display text-lg font-bold text-white">
            <span aria-hidden="true" className="flex size-9 items-center justify-center rounded-full bg-white/20 text-sm ring-1 ring-white/40">AS</span>
            A. Subramaniam · Admin
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/en" target="_blank" className="inline-flex min-h-10 items-center rounded-full px-3 text-sm text-white/90 hover:bg-white/15">
              View site ↗
            </Link>
            <form action={signOut}>
              <button type="submit" className="inline-flex min-h-10 items-center rounded-full border border-white/50 px-4 text-sm font-semibold text-white hover:bg-white/15">
                Log out
              </button>
            </form>
          </div>
        </div>
        <div className="relative">
          <Suspense fallback={<div className="h-[52px]" />}>
            <AdminNav />
          </Suspense>
        </div>
      </header>
      <main className="mx-auto w-full max-w-[1180px] flex-1 px-4 py-8 md:px-6 md:py-10">
        {children}
      </main>
    </>
  );
}
