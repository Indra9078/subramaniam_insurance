import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "../../../dictionaries";
import { PageHeader } from "@/components/layout/PageHeader";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { CtaBand } from "@/components/ui/CtaBand";
import { PageFaq } from "@/components/ui/PageFaq";
import { PlaceholderTag } from "@/components/ui/PlaceholderTag";
import { PlanCover } from "@/components/insurance/PlanCover";
import { PlanRequest } from "@/components/insurance/PlanRequest";
import { getPlan, getPlans } from "@/lib/data";
import { pageMetadata } from "@/lib/meta";
import { site } from "@/lib/site";
import { fill, waLink } from "@/lib/whatsapp";

// Plans known at build time are prerendered. New plans from the admin render on their
// first visit. Cache Components needs at least one value, so an empty list yields a stand-in.
export async function generateStaticParams() {
  const plans = await getPlans();
  return plans.length ? plans.map((p) => ({ slug: p.slug })) : [{ slug: "none" }];
}

export async function generateMetadata({ params }: PageProps<"/[lang]/insurance/plans/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) return {};
  const plan = await getPlan(slug);
  if (!plan) {
    const d = await getDictionary(lang);
    return { title: d.plans.goneTitle, robots: { index: false } };
  }
  return pageMetadata(lang, `/insurance/plans/${slug}`, plan.name[lang], plan.summary[lang]);
}

export default async function PlanPage({ params }: PageProps<"/[lang]/insurance/plans/[slug]">) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();
  const [dict, plan] = await Promise.all([getDictionary(lang), getPlan(slug)]);
  const p = dict.plans;
  const crumbs = [{ href: `/${lang}/insurance`, label: dict.nav.insurance }];

  // Removed or mistyped plan. Rendered as normal content (not notFound()) so the "products"
  // cache tag refreshes it as soon as the plan is published.
  if (!plan) {
    return (
      <>
        <main id="main" className="flex flex-1 flex-col">
          <PageHeader lang={lang} dict={dict} crumbs={[...crumbs, { label: p.goneTitle }]} eyebrow={dict.insurance.eyebrow} title={p.goneTitle} sub={p.goneText}>
            <div>
              <Button href={`/${lang}/insurance#plans`} variant="light">{p.back}</Button>
            </div>
          </PageHeader>
          <div className="flex-1 pt-14 md:pt-20">
            <CtaBand lang={lang} dict={dict} />
          </div>
        </main>
        <Footer lang={lang} dict={dict} />
      </>
    );
  }

  const name = plan.name[lang];
  const waText = fill(dict.whatsappText.product, { product: name });
  const val = (t: string) => (plan.isSample ? <PlaceholderTag>{t}</PlaceholderTag> : t);

  return (
    <>
      <main id="main" className="flex flex-1 flex-col">
        <PageHeader
          lang={lang}
          dict={dict}
          crumbs={[...crumbs, { label: name }]}
          eyebrow={`${p.categories[plan.category]}${plan.insurer ? ` · ${plan.insurer}` : ""}`}
          title={name}
          sub={plan.summary[lang]}
        >
          {plan.isSample && (
            <div>
              <PlaceholderTag tone="dark">{p.sampleNote}</PlaceholderTag>
            </div>
          )}
        </PageHeader>
        <div className="mx-auto grid w-full max-w-[1240px] gap-10 px-5 py-12 md:px-8 md:py-20 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-12">
          <div className="flex min-w-0 flex-col gap-10">
            <div className="relative h-56 overflow-hidden rounded-[1.75rem] md:h-80">
              {plan.image ? (
                <Image src={plan.image} alt={name} fill priority sizes="(min-width: 1024px) 700px, 100vw" className="object-cover" />
              ) : (
                <PlanCover category={plan.category} className="h-full" />
              )}
            </div>
            {plan.description[lang] && (
              <section className="flex flex-col gap-4">
                <h2 className="font-display text-2xl font-bold md:text-3xl">{p.about}</h2>
                <p className="whitespace-pre-line text-base leading-7 text-muted md:text-lg">
                  {val(plan.description[lang])}
                </p>
              </section>
            )}
            {plan.features[lang].length > 0 && (
              <section className="flex flex-col gap-4">
                <h2 className="font-display text-2xl font-bold md:text-3xl">{p.features}</h2>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {plan.features[lang].map((f) => (
                    <li key={f} className="flex gap-3 rounded-2xl border border-line bg-white p-4 text-[15px]">
                      <span aria-hidden="true" className="mt-2 size-2 shrink-0 rounded-full bg-ember" />
                      {val(f)}
                    </li>
                  ))}
                </ul>
              </section>
            )}
            <p className="text-sm leading-6 text-muted">{dict.common.subjectToTerms}</p>
            <Link href={`/${lang}/insurance#plans`} className="inline-flex min-h-11 items-center self-start font-semibold text-ember underline-offset-4 hover:underline">
              ← {p.back}
            </Link>
          </div>

          <aside id="request" className="flex min-w-0 scroll-mt-4 flex-col gap-5 lg:sticky lg:top-6 lg:self-start">
            <div className="flex flex-col gap-4 rounded-[1.75rem] border border-line bg-white p-6 shadow-[0_20px_50px_rgba(43,35,80,.1)] md:p-7">
              <h2 className="font-display text-2xl font-bold">{p.requestTitle}</h2>
              <p className="text-[15px] leading-relaxed text-muted">{p.requestSub}</p>
              <Suspense fallback={<p className="text-sm text-muted">…</p>}>
                <PlanRequest lang={lang} dict={dict} plan={plan} />
              </Suspense>
            </div>
            <p className="text-sm text-muted">
              {dict.hero.phone}{" "}
              <a href={site.phoneHref} className="font-semibold text-ink underline-offset-4 hover:underline">{site.phoneDisplay}</a>
              {" · "}
              <a href={waLink(waText)} target="_blank" rel="noopener" className="font-semibold text-[#1f7a46] underline-offset-4 hover:underline">
                {dict.cta.whatsapp}
              </a>
            </p>
          </aside>
        </div>
        <PageFaq lang={lang} title={dict.pageFaq.insurance} categories={[plan.category]} />
        <CtaBand lang={lang} dict={dict} waText={waText} />
      </main>
      <Footer lang={lang} dict={dict} waText={waText} />
    </>
  );
}
