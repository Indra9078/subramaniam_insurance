import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "../../dictionaries";
import { PageHeader } from "@/components/layout/PageHeader";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { LeadForm } from "@/components/forms/LeadForm";
import { site } from "@/lib/site";
import { fill, waLink } from "@/lib/whatsapp";
import { FaqList } from "@/components/ui/FaqList";
import { PlaceholderTag } from "@/components/ui/PlaceholderTag";
import { isProductSlug, productAccent, productInsurers, productSlugs } from "@/lib/products";
import { pageMetadata } from "@/lib/meta";
import { getFaqs } from "@/lib/data";

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
  return pageMetadata(lang, `/insurance/${product}`, p.name, p.intro);
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
  const [dict, allFaqs] = await Promise.all([getDictionary(lang), getFaqs()]);
  const p = dict.products.items[product];
  const faqs = allFaqs
    .filter((f) => f.category === product)
    .map((f) => ({ q: f.question[lang], a: f.answer[lang], sample: f.isSample }));
  const l = dict.products.labels;
  const offered = productInsurers[product];
  const pf = dict.productForm;
  const waText = fill(dict.whatsappText.product, { product: p.name });
  const wa = waLink(waText);

  return (
    <>
      <main id="main" className="flex flex-1 flex-col">
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

      <div className="flex-1">
        <section className="mx-auto grid w-full max-w-[1240px] gap-5 px-5 py-14 md:px-8 md:py-20 lg:grid-cols-3">
          <ListCard title={l.covers} items={p.covers} className={productAccent[product]} />
          <ListCard title={l.suits} items={p.suits} className="border border-line bg-white" />
          <ListCard title={l.documents} items={p.documents} className="border border-line bg-white" />
          <p className="text-sm leading-6 text-muted lg:col-span-3">{dict.common.subjectToTerms}</p>
        </section>

        {faqs.length > 0 && (
          <section className="mx-auto w-full max-w-[960px] px-5 pb-14 md:px-8 md:pb-20">
            <h2 className="font-display text-[1.75rem] font-bold leading-[1.1] tracking-tight md:text-4xl">
              {l.faq}
            </h2>
            <div className="mt-7">
              <FaqList items={faqs} />
            </div>
          </section>
        )}

        <section id="enquire" className="mx-auto w-full max-w-[1240px] scroll-mt-4 px-5 pb-14 md:px-8 md:pb-20">
          <div className="relative grid gap-8 overflow-hidden rounded-[2rem] bg-gradient-to-br from-iris-800 to-iris-950 p-6 text-iris-50 md:p-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-12">
            <div className="pointer-events-none absolute -bottom-24 -left-16 size-80 animate-drift rounded-full bg-[radial-gradient(circle,rgba(242,96,43,.3),transparent_70%)]" />
            <div className="relative flex flex-col gap-4">
              <h2 className="font-display text-[1.75rem] font-bold leading-tight md:text-4xl">{pf.title}</h2>
              <p className="text-base leading-7 text-iris-100">{pf.sub}</p>
              <p className="text-sm text-iris-200">
                {dict.hero.phone}{" "}
                <a href={site.phoneHref} className="font-semibold text-white underline-offset-4 hover:underline">
                  {site.phoneDisplay}
                </a>
              </p>
              <div className="flex flex-wrap gap-3">
                <Button href={site.phoneHref} variant="light">{dict.cta.call}</Button>
                <Button href={wa} variant="outlineLight">{dict.cta.whatsapp}</Button>
              </div>
            </div>
            <div className="relative min-w-0 rounded-[1.5rem] bg-white p-5 text-ink md:p-7">
              <LeadForm kind="product" product={product} lang={lang} dict={dict} waHref={wa} />
            </div>
          </div>
        </section>

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
      </div>
</main>
      <Footer lang={lang} dict={dict} waText={waText} />
    </>
  );
}
