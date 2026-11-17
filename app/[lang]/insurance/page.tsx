import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "../dictionaries";
import { PageHeader } from "@/components/layout/PageHeader";
import { Footer } from "@/components/layout/Footer";
import { CtaBand } from "@/components/ui/CtaBand";
import { Marquee } from "@/components/ui/Marquee";
import { PageFaq } from "@/components/ui/PageFaq";
import { PlanBrowser } from "@/components/insurance/PlanBrowser";
import { PlaceholderTag } from "@/components/ui/PlaceholderTag";
import { getPlans } from "@/lib/data";
import { productAccent, productSlugs } from "@/lib/products";
import { insurers } from "@/lib/site";
import { pageMetadata } from "@/lib/meta";

export async function generateMetadata({ params }: PageProps<"/[lang]/insurance">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const d = await getDictionary(lang);
  return pageMetadata(lang, "/insurance", d.insurance.metaTitle, d.insurance.metaDesc);
}

export default async function InsurancePage({ params }: PageProps<"/[lang]/insurance">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const [dict, plans] = await Promise.all([getDictionary(lang), getPlans()]);
  const ins = dict.insurance;
  const hasSamples = plans.some((x) => x.isSample);

  return (
    <>
      <main id="main" className="flex flex-1 flex-col">
      <PageHeader
        lang={lang}
        dict={dict}
        crumbs={[{ label: dict.nav.insurance }]}
        eyebrow={ins.eyebrow}
        title={ins.title}
        sub={ins.sub}
      />
      <Marquee items={[...insurers, dict.marquee]} />
      <div className="flex-1">
        <section className="mx-auto w-full max-w-[1240px] px-5 py-14 md:px-8 md:py-24">
          <h2 className="font-display text-[2rem] font-bold leading-[1.1] tracking-tight md:text-5xl">
            {ins.productsTitle}
          </h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {productSlugs.map((slug) => {
              const p = dict.products.items[slug];
              return (
                <article
                  key={slug}
                  className={`relative flex flex-col gap-3 rounded-[1.75rem] p-7 transition-transform duration-300 hover:-translate-y-2 md:p-9 ${productAccent[slug]}`}
                >
                  <h3 className="font-display text-2xl font-bold md:text-3xl">
                    <Link
                      href={`/${lang}/insurance/${slug}`}
                      className="after:absolute after:inset-0 after:content-['']"
                    >
                      {p.name}
                    </Link>
                  </h3>
                  <p className="text-[15px] leading-relaxed text-muted md:text-base">{p.short}</p>
                  <span aria-hidden="true" className="mt-2 font-semibold text-ember">
                    {dict.common.learnMore} →
                  </span>
                </article>
              );
            })}
          </div>
        </section>

        <section id="plans" className="mx-auto w-full max-w-[1240px] scroll-mt-4 px-5 pb-14 md:px-8 md:pb-24">
          <div className="mb-3 flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-[2rem] font-bold leading-[1.1] tracking-tight md:text-5xl">{dict.plans.title}</h2>
            {hasSamples && <PlaceholderTag>{dict.plans.sampleNote}</PlaceholderTag>}
          </div>
          <p className="mb-8 max-w-2xl text-base leading-7 text-muted">{dict.plans.sub}</p>
          {plans.length > 0 ? (
            <PlanBrowser lang={lang} plans={plans} dict={dict} />
          ) : (
            <p className="rounded-[1.5rem] border border-dashed border-line bg-white p-8 text-muted">{dict.plans.none}</p>
          )}
        </section>

        <section className="mx-auto w-full max-w-[1240px] px-5 pb-14 md:px-8 md:pb-24">
          <h2 className="font-display text-[2rem] font-bold leading-[1.1] tracking-tight md:text-5xl">
            {ins.chooseTitle}
          </h2>
          <ol className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {ins.choose.map((s, i) => (
              <li key={s.t} className="flex flex-col gap-3 rounded-[1.75rem] border border-line bg-white p-7">
                <span className="flex size-11 items-center justify-center rounded-full bg-iris-900 font-display text-lg font-bold text-white">
                  {i + 1}
                </span>
                <h3 className="font-display text-xl font-bold">{s.t}</h3>
                <p className="text-[15px] leading-relaxed text-muted">{s.d}</p>
              </li>
            ))}
          </ol>
          <p className="mt-8 max-w-3xl text-sm leading-6 text-muted">{dict.common.subjectToTerms}</p>
        </section>

        <PageFaq lang={lang} title={dict.pageFaq.insurance} categories={["health", "life", "vehicle", "corporate"]} />
        <CtaBand lang={lang} dict={dict} />
      </div>
</main>
      <Footer lang={lang} dict={dict} />
    </>
  );
}
