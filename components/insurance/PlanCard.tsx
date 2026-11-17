import Image from "next/image";
import Link from "next/link";
import { PlanCover } from "@/components/insurance/PlanCover";
import { PlaceholderTag } from "@/components/ui/PlaceholderTag";
import type { Plan } from "@/lib/types";
import type { Dictionary, Locale } from "@/app/[lang]/dictionaries";

/** One insurance plan card. Sample plans glow as placeholders. */
export function PlanCard({ lang, plan, dict }: { lang: Locale; plan: Plan; dict: Dictionary }) {
  const name = plan.name[lang];
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-[1.75rem] border border-line bg-white transition-transform duration-300 hover:-translate-y-2">
      <div className="relative h-44 md:h-48">
        {plan.image ? (
          <Image src={plan.image} alt={name} fill sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw" className="object-cover" />
        ) : (
          <PlanCover category={plan.category} className="h-full" />
        )}
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-iris-900">
          {dict.plans.categories[plan.category]}
        </span>
        {plan.isSample && (
          <span className="absolute right-4 top-4">
            <PlaceholderTag>{dict.common.sample}</PlaceholderTag>
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2.5 p-6">
        {plan.insurer && <p className="text-xs font-semibold uppercase tracking-wider text-ember">{plan.insurer}</p>}
        <h3 className="font-display text-xl font-bold md:text-[22px]">
          <Link href={`/${lang}/insurance/plans/${plan.slug}`} className="after:absolute after:inset-0 after:content-['']">
            {name}
          </Link>
        </h3>
        <p className="text-[15px] leading-relaxed text-muted">{plan.summary[lang]}</p>
        <span aria-hidden="true" className="mt-auto pt-2 font-semibold text-ember">
          {dict.plans.view} →
        </span>
      </div>
    </article>
  );
}
