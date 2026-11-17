"use client";

import { startTransition, useActionState } from "react";
import { updateProfile, type ProfileState } from "@/app/[lang]/account/actions";
import type { Dictionary } from "@/app/[lang]/dictionaries";

const field =
  "min-h-[50px] w-full rounded-[14px] border border-[#cfccd6] bg-white px-3.5 text-base text-ink focus:border-iris-500 focus:outline-none focus:ring-2 focus:ring-iris-200";

export function ProfileForm({ lang, dict, name, phone, email }: { lang: string; dict: Dictionary; name: string; phone: string; email: string }) {
  const a = dict.account;
  const [state, action, pending] = useActionState<ProfileState, FormData>(updateProfile.bind(null, lang), {});
  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        startTransition(() => action(fd));
      }}
      className="grid gap-4 sm:grid-cols-2"
    >
      <div className="flex flex-col gap-1.5">
        <label htmlFor="pf-name" className="text-sm font-semibold">{a.name}</label>
        <input id="pf-name" name="name" defaultValue={name} maxLength={80} autoComplete="name" required className={field} aria-invalid={state.error === "name" || undefined} />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="pf-phone" className="text-sm font-semibold">{a.phone}</label>
        <input id="pf-phone" name="phone" type="tel" inputMode="tel" defaultValue={phone} maxLength={16} autoComplete="tel" className={field} aria-invalid={state.error === "phone" || undefined} />
      </div>
      <div className="flex flex-col gap-1.5 sm:col-span-2">
        <span className="text-sm font-semibold">{a.email}</span>
        <p className="min-h-[50px] break-all rounded-[14px] bg-paper px-3.5 py-3 text-base text-muted">{email}</p>
      </div>
      <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
        <button type="submit" disabled={pending} className="inline-flex min-h-12 items-center rounded-full bg-ink px-7 font-semibold text-white disabled:opacity-70">
          {pending ? a.working : a.save}
        </button>
        <p aria-live="polite" className="text-sm font-semibold">
          {state.ok && <span className="text-[#1f7a46]">{a.saved}</span>}
          {state.error && <span className="text-ember">{a.errors[state.error === "generic" ? "generic" : state.error]}</span>}
        </p>
      </div>
    </form>
  );
}
