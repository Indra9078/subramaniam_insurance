"use client";

import { useState } from "react";
import { PlanCard } from "@/components/insurance/PlanCard";
import { planCategories, type Plan, type PlanCategory } from "@/lib/types";
import type { Dictionary, Locale } from "@/app/[lang]/dictionaries";

/** Plan grid with category filter chips. */
export function PlanBrowser({ lang, plans, dict }: { lang: Locale; plans: Plan[]; dict: Dictionary }) {
  const [cat, setCat] = useState<PlanCategory | "all">("all");
  const present = planCategories.filter((c) => plans.some((p) => p.category === c));
  const shown = plans.filter((p) => cat === "all" || p.category === cat);
  const chip = (active: boolean) =>
    `inline-flex min-h-11 items-center rounded-full border px-5 text-sm font-semibold transition-colors ${active ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-ink"}`;

  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-wrap items-center gap-2.5" role="group" aria-label={dict.plans.title}>
        <button type="button" aria-pressed={cat === "all"} onClick={() => setCat("all")} className={chip(cat === "all")}>
          {dict.plans.all} ({plans.length})
        </button>
        {present.map((c) => (
          <button key={c} type="button" aria-pressed={cat === c} onClick={() => setCat(c)} className={chip(cat === c)}>
            {dict.plans.categories[c]} ({plans.filter((p) => p.category === c).length})
          </button>
        ))}
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((p) => (
          <PlanCard key={p.id} lang={lang} plan={p} dict={dict} />
        ))}
      </div>
    </div>
  );
}
