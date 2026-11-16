import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { AdminNav } from "./AdminNav";
import { signOut } from "@/app/admin/actions";

/** Header and navigation for logged-in admin pages. */
export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <>
      <header className="bg-gradient-to-r from-iris-900 to-iris-800 text-iris-50">
        <div className="mx-auto flex max-w-[1100px] flex-wrap items-center justify-between gap-3 px-4 py-4 md:px-6">
          <Link href="/admin" className="font-display text-lg font-bold text-white">
            A. Subramaniam · Admin
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/en"
              target="_blank"
              className="inline-flex min-h-10 items-center rounded-full px-3 text-sm text-iris-100 hover:bg-white/10"
            >
              View site ↗
            </Link>
            <form action={signOut}>
              <button
                type="submit"
                className="inline-flex min-h-10 items-center rounded-full border border-iris-200/45 px-4 text-sm font-semibold text-white hover:bg-white/10"
              >
                Log out
              </button>
            </form>
          </div>
        </div>
        <Suspense fallback={<div className="h-[52px]" />}>
          <AdminNav />
        </Suspense>
      </header>
      <main className="mx-auto w-full max-w-[1100px] flex-1 px-4 py-8 md:px-6 md:py-10">
        {children}
      </main>
    </>
  );
}
