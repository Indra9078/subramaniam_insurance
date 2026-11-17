import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "../dictionaries";
import { PageHeader } from "@/components/layout/PageHeader";
import { Footer } from "@/components/layout/Footer";
import { CtaBand } from "@/components/ui/CtaBand";
import { FaqList } from "@/components/ui/FaqList";
import { PlaceholderTag } from "@/components/ui/PlaceholderTag";
import { jsonLd, pageMetadata } from "@/lib/meta";
import { getFaqs } from "@/lib/data";
import { faqCategories } from "@/lib/types";

export async function generateMetadata({ params }: PageProps<"/[lang]/faq">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const d = await getDictionary(lang);
  return pageMetadata(lang, "/faq", d.faqPage.metaTitle, d.faqPage.metaDesc);
}

export default async function FaqPage({ params }: PageProps<"/[lang]/faq">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const [dict, faqs] = await Promise.all([getDictionary(lang), getFaqs()]);
  const f = dict.faqPage;
  const groups = faqCategories
    .map((c) => ({ c, items: faqs.filter((q) => q.category === c) }))
    .filter((g) => g.items.length > 0);
  const hasSamples = faqs.some((q) => q.isSample);
  const approved = faqs.filter((q) => !q.isSample);
  const faqLd = approved.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: approved.map((q) => ({
          "@type": "Question",
          name: q.question[lang],
          acceptedAnswer: { "@type": "Answer", text: q.answer[lang] },
        })),
      }
    : null;

  return (
    <>
      <main id="main" className="flex flex-1 flex-col">
      <PageHeader
        lang={lang}
        dict={dict}
        crumbs={[{ label: dict.nav.faq }]}
        eyebrow={f.eyebrow}
        title={f.title}
        sub={f.sub}
      />
      <div className="flex-1">
        <div className="mx-auto flex w-full max-w-[960px] flex-col gap-12 px-5 py-14 md:px-8 md:py-20">
          {hasSamples && (
            <div>
              <PlaceholderTag>{dict.common.draftNote}</PlaceholderTag>
            </div>
          )}
          {groups.length === 0 && (
            <p className="rounded-[22px] border border-dashed border-line bg-white p-6 text-muted">{f.empty}</p>
          )}
          {groups.map((g, i) => (
            <section key={g.c} className="flex flex-col gap-6">
              <h2 className="font-display text-[1.75rem] font-bold leading-tight tracking-tight md:text-4xl">
                {f.categories[g.c]}
              </h2>
              <FaqList
                items={g.items.map((q) => ({ q: q.question[lang], a: q.answer[lang], sample: q.isSample }))}
                firstOpen={i === 0}
              />
            </section>
          ))}
        </div>
        <CtaBand lang={lang} dict={dict} />
      </div>
</main>
      {faqLd && <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(faqLd)} />}
      <Footer lang={lang} dict={dict} />
    </>
  );
}
