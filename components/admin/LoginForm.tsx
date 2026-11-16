"use client";

import { useActionState } from "react";
import { signIn } from "@/app/admin/actions";

const input =
  "min-h-12 w-full rounded-[12px] border border-[#cfccd6] bg-white px-3.5 text-base focus:border-iris-500 focus:outline-none focus:ring-2 focus:ring-iris-200";

export function LoginForm() {
  const [state, action, pending] = useActionState(signIn, {});
  return (
    <form action={action} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold">Email</span>
        <input name="email" type="email" autoComplete="username" required className={input} />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold">Password</span>
        <input name="password" type="password" autoComplete="current-password" required className={input} />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="btn-sheen mt-2 min-h-12 rounded-full font-semibold text-white disabled:opacity-60"
      >
        {pending ? "Logging in…" : "Log in"}
      </button>
      <p aria-live="polite" className="min-h-5 text-sm font-semibold text-ember">
        {state.error}
      </p>
    </form>
  );
}
