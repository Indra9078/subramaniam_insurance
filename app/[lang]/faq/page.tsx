import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "../dictionaries";
import { PageHeader } from "@/components/layout/PageHeader";
import { Footer } from "@/components/layout/Footer";
import { CtaBand } from "@/components/ui/CtaBand";
import { FaqList } from "@/components/ui/FaqList";
import { PlaceholderTag } from "@/components/ui/PlaceholderTag";
import { pageMetadata } from "@/lib/meta";

export async function generateMetadata({ params }: PageProps<"/[lang]/faq">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const d = await getDictionary(lang);
  return pageMetadata("/faq", d.faqPage.metaTitle, d.faqPage.metaDesc);
}

export default async function FaqPage({ params }: PageProps<"/[lang]/faq">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const f = dict.faqPage;

  return (
    <>
      <PageHeader
        lang={lang}
        dict={dict}
        crumbs={[{ label: dict.nav.faq }]}
        eyebrow={f.eyebrow}
        title={f.title}
        sub={f.sub}
      />
      <main className="flex-1">
        <div className="mx-auto flex w-full max-w-[960px] flex-col gap-12 px-5 py-14 md:px-8 md:py-20">
          <div>
            <PlaceholderTag>{dict.common.draftNote}</PlaceholderTag>
          </div>
          {f.groups.map((g, i) => (
            <section key={g.title} className="flex flex-col gap-6">
              <h2 className="font-display text-[1.75rem] font-bold leading-tight tracking-tight md:text-4xl">
                {g.title}
              </h2>
              <FaqList items={g.items} firstOpen={i === 0} />
            </section>
          ))}
        </div>
        <CtaBand lang={lang} dict={dict} />
      </main>
      <Footer lang={lang} nav={dict.nav} footer={dict.footer} />
    </>
  );
}
