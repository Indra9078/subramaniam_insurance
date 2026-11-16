import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "../../dictionaries";
import { PageHeader } from "@/components/layout/PageHeader";
import { Footer } from "@/components/layout/Footer";
import { CtaBand } from "@/components/ui/CtaBand";
import { FaqList } from "@/components/ui/FaqList";
import { PlaceholderTag } from "@/components/ui/PlaceholderTag";
import { isProductSlug, productAccent, productInsurers, productSlugs } from "@/lib/products";
import { pageMetadata } from "@/lib/meta";

export function generateStaticParams() {
  return productSlugs.map((product) => ({ product }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/insurance/[product]">): Promise<Metadata> {
  const { lang, product } = await params;
  if (!hasLocale(lang) || !isProductSlug(product)) return {};
  const d = await getDictionary(lang);
  const p = d.products.items[product];
  return pageMetadata(`/insurance/${product}`, p.name, p.intro);
}

function ListCard({ title, items, className }: { title: string; items: string[]; className: string }) {
  return (
    <div className={`flex flex-col gap-4 rounded-[1.75rem] p-7 md:p-8 ${className}`}>
      <h2 className="font-display text-xl font-bold md:text-2xl">{title}</h2>
      <ul className="flex flex-col gap-2.5">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-[15px] leading-relaxed md:text-base">
            <span aria-hidden="true" className="mt-2 size-2 shrink-0 rounded-full bg-ember" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default async function ProductPage({ params }: PageProps<"/[lang]/insurance/[product]">) {
  const { lang, product } = await params;
  if (!hasLocale(lang) || !isProductSlug(product)) notFound();
  const dict = await getDictionary(lang);
  const p = dict.products.items[product];
  const l = dict.products.labels;
  const offered = productInsurers[product];

  return (
    <>
      <PageHeader
        lang={lang}
        dict={dict}
        crumbs={[{ href: `/${lang}/insurance`, label: dict.nav.insurance }, { label: p.name }]}
        eyebrow={p.name}
        title={p.title}
        sub={p.intro}
      >
        <div className="flex flex-wrap items-center gap-2.5 text-sm">
          <span className="text-iris-200">{l.insurers}:</span>
          {offered.names.map((n) => (
            <span key={n} className="rounded-full border border-iris-200/35 bg-white/10 px-4 py-2 font-semibold">
              {n}
            </span>
          ))}
          {!offered.confirmed && <PlaceholderTag tone="dark">{l.confirm}</PlaceholderTag>}
        </div>
      </PageHeader>

      <main className="flex-1">
        <section className="mx-auto grid w-full max-w-[1240px] gap-5 px-5 py-14 md:px-8 md:py-20 lg:grid-cols-3">
          <ListCard title={l.covers} items={p.covers} className={productAccent[product]} />
          <ListCard title={l.suits} items={p.suits} className="border border-line bg-white" />
          <ListCard title={l.documents} items={p.documents} className="border border-line bg-white" />
          <p className="text-sm leading-6 text-muted lg:col-span-3">{dict.common.subjectToTerms}</p>
        </section>

        <section className="mx-auto w-full max-w-[960px] px-5 pb-14 md:px-8 md:pb-20">
          <h2 className="font-display text-[1.75rem] font-bold leading-[1.1] tracking-tight md:text-4xl">
            {l.faq}
          </h2>
          <div className="mt-7">
            <FaqList items={p.faq} />
          </div>
        </section>

        <CtaBand lang={lang} dict={dict} title={l.quote} text={l.quoteText} />

        <section className="mx-auto w-full max-w-[1240px] px-5 pb-16 md:px-8 md:pb-24">
          <h2 className="font-display text-2xl font-bold md:text-3xl">{l.others}</h2>
          <ul className="mt-6 flex flex-wrap gap-3">
            {productSlugs
              .filter((s) => s !== product)
              .map((s) => (
                <li key={s}>
                  <Link
                    href={`/${lang}/insurance/${s}`}
                    className="inline-flex min-h-12 items-center rounded-full border border-line bg-white px-6 font-semibold hover:border-ink"
                  >
                    {dict.products.items[s].name}
                  </Link>
                </li>
              ))}
          </ul>
        </section>
      </main>
      <Footer lang={lang} nav={dict.nav} footer={dict.footer} />
    </>
  );
}
