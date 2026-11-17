import Link from "next/link";
import { LeadForm } from "@/components/forms/LeadForm";
import { PlanRequestForm } from "@/components/insurance/PlanRequestForm";
import { getCurrentUser, getProfile } from "@/lib/account/auth";
import { isUuid } from "@/lib/validate";
import { waLink } from "@/lib/whatsapp";
import type { Plan } from "@/lib/types";
import type { Dictionary } from "@/app/[lang]/dictionaries";

/**
 * Request section of a plan page. Reads the visitor's session, so it sits inside
 * a Suspense boundary. Signed-in visitors get a one-step request they can track;
 * everyone else can log in, or leave their number for a call back.
 */
export async function PlanRequest({ lang, dict, plan }: { lang: "en" | "ta"; dict: Dictionary; plan: Plan }) {
  const p = dict.plans;
  const wa = waLink(dict.whatsappText.product.replace("{product}", plan.name[lang]));
  const canTrack = isUuid(plan.id);
  const user = canTrack ? await getCurrentUser() : null;

  const callback = (
    <LeadForm kind="product" product={plan.category} lang={lang} dict={dict} waHref={wa} idPrefix="plan-callback" source={`Plan: ${plan.name.en}`} />
  );

  if (user) {
    const profile = await getProfile(user);
    return <PlanRequestForm lang={lang} dict={dict} planId={plan.id} planName={plan.name.en} defaultPhone={profile.phone} />;
  }
  if (!canTrack) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-sm leading-6 text-muted">{p.notReady}</p>
        {callback}
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 rounded-[1.25rem] bg-iris-50 p-5">
        <p className="text-[15px] leading-relaxed">{p.loginPrompt}</p>
        <Link
          href={`/${lang}/account/login?next=${encodeURIComponent(`/${lang}/insurance/plans/${plan.slug}`)}`}
          className="btn-sheen inline-flex min-h-12 items-center justify-center rounded-full px-6 font-semibold text-white"
        >
          {p.loginBtn}
        </Link>
      </div>
      <p className="text-sm font-semibold">{p.orCall}</p>
      {callback}
    </div>
  );
}
