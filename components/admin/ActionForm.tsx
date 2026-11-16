"use client";

import { startTransition, useActionState, type ReactNode } from "react";
import type { FormState } from "@/lib/admin/form";

/** Form wrapper for admin server actions: shows errors, success and a pending button. */
export function ActionForm({
  action,
  children,
  submitLabel = "Save",
  className = "flex flex-col gap-6",
}: {
  action: (prev: FormState, fd: FormData) => Promise<FormState>;
  children: ReactNode;
  submitLabel?: string;
  className?: string;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  return (
    <form
      className={className}
      // Submit manually so React does not reset the fields after the action:
      // on a validation error the admin keeps what they typed.
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        startTransition(() => formAction(fd));
      }}
    >
      {children}
      <div className="sticky bottom-0 -mx-4 flex flex-wrap items-center gap-3 border-t border-line bg-paper/95 px-4 py-3 backdrop-blur md:static md:mx-0 md:border-0 md:bg-transparent md:p-0">
        <button
          type="submit"
          disabled={pending}
          className="btn-sheen inline-flex min-h-12 items-center justify-center rounded-full px-7 font-semibold text-white disabled:opacity-60"
        >
          {pending ? "Saving…" : submitLabel}
        </button>
        <p aria-live="polite" className="text-sm">
          {state.error && <span className="font-semibold text-ember">{state.error}</span>}
          {state.ok && <span className="font-semibold text-[#1f7a46]">{state.ok}</span>}
        </p>
      </div>
    </form>
  );
}
