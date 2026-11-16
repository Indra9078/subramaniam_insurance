"use client";

import Link from "next/link";
import { startTransition, useActionState, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { submitLead, type LeadState } from "@/app/[lang]/actions";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import type { ProductSlug } from "@/lib/products";

const field =
  "min-h-[50px] w-full rounded-[14px] border border-[#cfccd6] bg-white px-3.5 text-base text-ink focus:border-iris-500 focus:outline-none focus:ring-2 focus:ring-iris-200";

type Option = { value: string; label: string };
type Extra = { name: string; label: string; type: "text" | "number" | "date" | "select"; options?: Option[] };

/** Product-specific questions. Values are English so the client's email reads the same in both languages. */
function productExtras(product: ProductSlug, t: Dictionary["productForm"]): Extra[] {
  const opts = (labels: Record<string, string>, en: Record<string, string>) =>
    Object.keys(labels).map((k) => ({ value: en[k], label: labels[k] }));
  switch (product) {
    case "health":
      return [
        { name: "Cover for", label: t.health.cover, type: "select", options: opts(t.health.coverOptions, { self: "Just me", family: "Family", parents: "Parents" }) },
        { name: "Eldest age", label: t.health.eldestAge, type: "number" },
        { name: "City", label: t.health.city, type: "text" },
      ];
    case "life":
      return [
        { name: "Age", label: t.life.age, type: "number" },
        { name: "Cover amount", label: t.life.amount, type: "select", options: opts(t.life.amountOptions, { upto25l: "Up to 25 lakh", "25to50l": "25 to 50 lakh", "50lto1cr": "50 lakh to 1 crore", above1cr: "Above 1 crore", unsure: "Not sure" }) },
        { name: "Goal", label: t.life.goal, type: "select", options: opts(t.life.goalOptions, { protection: "Family protection", savings: "Savings", child: "Child's future", retirement: "Retirement" }) },
      ];
    case "vehicle":
      return [
        { name: "Vehicle", label: t.vehicle.type, type: "select", options: opts(t.vehicle.typeOptions, { car: "Car", twoWheeler: "Two-wheeler", commercial: "Commercial" }) },
        { name: "Renewal date", label: t.vehicle.renewal, type: "date" },
        { name: "Claim last year", label: t.vehicle.claim, type: "select", options: opts(t.vehicle.claimOptions, { no: "No", yes: "Yes", unsure: "Not sure" }) },
      ];
    case "corporate":
      return [
        { name: "Company", label: t.corporate.company, type: "text" },
        { name: "Employees", label: t.corporate.employees, type: "number" },
      ];
  }
}

/** The dictionary parts the form uses. */
export type LeadFormDict = Pick<Dictionary, "contact" | "productForm" | "propertyForm">;

type Props = {
  lang: string;
  dict: LeadFormDict;
  /** WhatsApp link offered after sending. */
  waHref: string;
  variant?: "light" | "dark";
  /** Prefix for field ids, so two forms on one page never share ids. */
  idPrefix?: string;
  /** Where the form was opened from, saved with the lead (e.g. "Assistant"). */
  source?: string;
} & (
  | { kind: "callback"; defaultInterest?: string }
  | { kind: "product"; product: ProductSlug }
  | { kind: "property"; listing: { slug: string; title: string } }
);

/** Enquiry form: call back, insurance product or property. Saves a lead and shows a thank-you message. */
export function LeadForm(props: Props) {
  const { lang, dict, waHref } = props;
  const f = dict.contact.form;
  const pathname = usePathname() ?? "";
  const [state, action, pending] = useActionState<LeadState, FormData>(submitLead, {});
  const [startedAt, setStartedAt] = useState(0);
  const [key, setKey] = useState(0);
  // "Send another": hide this success state until the next submission returns a new one.
  const [dismissed, setDismissed] = useState<LeadState | null>(null);
  // Record when the form was shown (bots post instantly). Reset for "send another".
  useEffect(() => setStartedAt(Date.now()), [key]);

  const id = (n: string) => `${props.idPrefix ?? props.kind}-${n.replace(/\s+/g, "-")}`;
  const label = (htmlFor: string, text: string, optional = false) => (
    <label htmlFor={htmlFor} className="text-sm font-semibold">
      {text}
      {optional && <span className="font-normal text-muted"> ({f.optional})</span>}
    </label>
  );

  if (state.ok && state !== dismissed) {
    const time = (state.time && state.time in f.successTime ? state.time : "any") as keyof typeof f.successTime;
    return (
      <div role="status" className="flex flex-col gap-4 rounded-[1.5rem] border border-[#bfe5cc] bg-[#e7f5ec] p-6 text-ink md:p-8">
        <p className="font-display text-2xl font-bold">{f.successTitle}</p>
        <p className="text-base leading-7">
          {f.successTime[time]} {f.successText}
        </p>
        <div className="flex flex-wrap gap-3">
          <a href={waHref} target="_blank" rel="noopener" className="inline-flex min-h-12 items-center rounded-full bg-[#1f7a46] px-6 font-semibold text-white">
            {f.successWa}
          </a>
          <button
            type="button"
            onClick={() => {
              setDismissed(state);
              setKey((k) => k + 1);
            }}
            className="inline-flex min-h-12 items-center rounded-full border border-line bg-white px-6 font-semibold"
          >
            {f.another}
          </button>
        </div>
      </div>
    );
  }

  const extras =
    props.kind === "product"
      ? productExtras(props.product, dict.productForm)
      : props.kind === "property"
        ? [
            {
              name: "Wants to",
              label: dict.propertyForm.intent,
              type: "select" as const,
              options: Object.entries(dict.propertyForm.intentOptions).map(([k, v]) => ({
                value: { visit: "Visit the property", info: "Know more", offer: "Make an offer" }[k] ?? k,
                label: v,
              })),
            },
          ]
        : [];

  const error = state.error && state !== dismissed ? f.errors[state.error] : null;

  return (
    <form
      key={key}
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        startTransition(() => action(fd));
      }}
      className={clsx("flex flex-col gap-[18px]", props.variant === "dark" && "text-ink")}
    >
      <input type="hidden" name="language" value={lang} />
      <input type="hidden" name="source_page" value={pathname} />
      <input type="hidden" name="_t" value={startedAt || ""} />
      {props.source && <input type="hidden" name="d:Source" value={props.source} />}
      {props.kind === "product" && (
        <>
          <input type="hidden" name="product" value={props.product} />
          <input type="hidden" name="interest" value={props.product} />
        </>
      )}
      {props.kind === "property" && (
        <>
          <input type="hidden" name="interest" value="property" />
          <input type="hidden" name="listing_slug" value={props.listing.slug} />
          <input type="hidden" name="listing_title" value={props.listing.title} />
        </>
      )}
      {/* Trap for bots: hidden from people and screen readers. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 overflow-hidden">
        <label>
          Website <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="flex flex-col gap-1.5">
        {label(id("name"), f.name)}
        <input id={id("name")} name="name" type="text" autoComplete="name" required maxLength={80}
          aria-invalid={state.error === "name" || undefined} className={field} />
      </div>
      <div className="flex flex-col gap-1.5">
        {label(id("phone"), f.phone)}
        <input id={id("phone")} name="phone" type="tel" inputMode="tel" autoComplete="tel" required maxLength={16}
          placeholder="98765 43210" aria-describedby={id("phone-hint")}
          aria-invalid={state.error === "phone" || undefined} className={field} />
        <span id={id("phone-hint")} className="text-xs text-muted">{f.phoneHint}</span>
      </div>

      {props.kind === "callback" && (
        <div className="flex flex-col gap-1.5">
          {label(id("interest"), f.interest)}
          <select id={id("interest")} name="interest" className={field} defaultValue={props.defaultInterest ?? "health"}>
            {Object.entries(f.interestOptions).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>
      )}

      {extras.length > 0 && (
        <div className="grid gap-[18px] sm:grid-cols-2">
          {extras.map((x) => (
            <div key={x.name} className="flex min-w-0 flex-col gap-1.5">
              {label(id(x.name), x.label, props.kind === "product")}
              {x.type === "select" ? (
                <select id={id(x.name)} name={`d:${x.name}`} className={field} defaultValue={props.kind === "property" ? x.options?.[0]?.value : ""}>
                  {props.kind === "product" && <option value="">—</option>}
                  {x.options?.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              ) : (
                <input id={id(x.name)} name={`d:${x.name}`} type={x.type} inputMode={x.type === "number" ? "numeric" : undefined}
                  min={x.type === "number" ? 0 : undefined} className={field} />
              )}
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        {label(id("time"), f.time)}
        <select id={id("time")} name="preferred_time" className={field} defaultValue="any">
          {Object.entries(f.timeOptions).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>

      {props.kind !== "product" && (
        <div className="flex flex-col gap-1.5">
          {label(id("message"), f.message, true)}
          <textarea id={id("message")} name="message" rows={3} maxLength={1000} className={`${field} py-3`} />
        </div>
      )}

      <div className="flex items-start gap-2.5">
        <input id={id("consent")} name="consent" type="checkbox" required
          aria-invalid={state.error === "consent" || undefined} className="mt-0.5 size-5 shrink-0" />
        <label htmlFor={id("consent")} className="text-sm leading-relaxed text-muted">
          {f.consent}{" "}
          <Link href={`/${lang}/privacy`} className="font-semibold text-ember underline underline-offset-2">
            {f.consentLink}
          </Link>
        </label>
      </div>

      <button type="submit" disabled={pending}
        className="btn-sheen min-h-[54px] rounded-full text-base font-semibold text-white disabled:opacity-70">
        {pending ? f.sending : f.submit}
      </button>
      <p aria-live="assertive" className="min-h-5 text-center text-sm font-semibold text-ember">
        {error}
      </p>
    </form>
  );
}
