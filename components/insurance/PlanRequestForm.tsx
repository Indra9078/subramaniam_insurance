"use client";

import Link from "next/link";
import { startTransition, useActionState } from "react";
import { requestPlan, type RequestState } from "@/app/[lang]/account/actions";
import type { Dictionary } from "@/app/[lang]/dictionaries";

const field =
  "min-h-[50px] w-full rounded-[14px] border border-[#cfccd6] bg-white px-3.5 text-base text-ink focus:border-iris-500 focus:outline-none focus:ring-2 focus:ring-iris-200";

/** Request form for a signed-in visitor. The request is saved to their account so they can follow its status. */
export function PlanRequestForm({
  lang,
  dict,
  planId,
  planName,
  defaultPhone,
}: {
  lang: string;
  dict: Dictionary;
  planId: string;
  planName: string;
  defaultPhone: string;
}) {
  const p = dict.plans;
  const [state, action, pending] = useActionState<RequestState, FormData>(requestPlan.bind(null, lang, planId, planName), {});

  if (state.ok) {
    return (
      <div role="status" className="flex flex-col gap-3 rounded-[1.25rem] border border-[#bfe5cc] bg-[#e7f5ec] p-5 text-ink">
        <p className="font-display text-xl font-bold">{p.sent}</p>
        <Link href={`/${lang}/account`} className="font-semibold text-ember underline underline-offset-4">
          {p.track} →
        </Link>
      </div>
    );
  }
  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        startTransition(() => action(fd));
      }}
      className="flex flex-col gap-4"
    >
      <div className="flex flex-col gap-1.5">
        <label htmlFor="rq-phone" className="text-sm font-semibold">{p.phone}</label>
        <input id="rq-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" required defaultValue={defaultPhone} maxLength={16}
          aria-invalid={state.error === "phone" || undefined} className={field} />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="rq-time" className="text-sm font-semibold">{p.time}</label>
        <select id="rq-time" name="preferred_time" defaultValue="any" className={field}>
          {Object.entries(dict.contact.form.timeOptions).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="rq-msg" className="text-sm font-semibold">
          {p.message} <span className="font-normal text-muted">({p.optional})</span>
        </label>
        <textarea id="rq-msg" name="message" rows={3} maxLength={1000} className={`${field} py-3`} />
      </div>
      <div className="flex items-start gap-2.5">
        <input id="rq-consent" name="consent" type="checkbox" required aria-invalid={state.error === "consent" || undefined} className="mt-0.5 size-5 shrink-0" />
        <label htmlFor="rq-consent" className="text-sm leading-relaxed text-muted">
          {p.consent}{" "}
          <Link href={`/${lang}/privacy`} className="font-semibold text-ember underline underline-offset-2">{p.privacy}</Link>
        </label>
      </div>
      <button type="submit" disabled={pending} className="btn-sheen min-h-[54px] rounded-full text-base font-semibold text-white disabled:opacity-70">
        {pending ? p.sending : p.send}
      </button>
      <p aria-live="assertive" className="min-h-5 text-center text-sm font-semibold text-ember">
        {state.error ? p.errors[state.error] : ""}
      </p>
    </form>
  );
}
