import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "../dictionaries";
import { PageHeader } from "@/components/layout/PageHeader";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { CtaBand } from "@/components/ui/CtaBand";
import { PageFaq } from "@/components/ui/PageFaq";
import { PlaceholderTag } from "@/components/ui/PlaceholderTag";
import { ListingBrowser } from "@/components/realestate/ListingBrowser";
import { getListings } from "@/lib/data";
import { pageMetadata } from "@/lib/meta";

const serviceAccent = ["bg-[#ffe9df]", "bg-[#e7f5ec]", "bg-iris-100", "bg-[#fff3cf]"];

export async function generateMetadata({ params }: PageProps<"/[lang]/real-estate">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const d = await getDictionary(lang);
  return pageMetadata(lang, "/real-estate", d.realEstate.metaTitle, d.realEstate.metaDesc);
}

export default async function RealEstatePage({ params }: PageProps<"/[lang]/real-estate">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const [dict, listings] = await Promise.all([getDictionary(lang), getListings()]);
  const r = dict.realEstate;
  const hasSamples = listings.some((l) => l.isSample);

  return (
    <>
      <main id="main" className="flex flex-1 flex-col">
      <PageHeader
        lang={lang}
        dict={dict}
        crumbs={[{ label: dict.nav.realEstate }]}
        eyebrow={r.eyebrow}
        title={r.title}
        sub={r.sub}
      >
        <div>
          <PlaceholderTag tone="dark">{r.areasPh}</PlaceholderTag>
        </div>
      </PageHeader>
      <div className="flex-1">
        <section className="mx-auto w-full max-w-[1240px] px-5 py-14 md:px-8 md:py-20">
          <h2 className="font-display text-[2rem] font-bold leading-[1.1] tracking-tight md:text-5xl">
            {r.servicesTitle}
          </h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {r.services.map((s, i) => (
              <article key={s.t} className={`flex flex-col gap-3 rounded-[1.75rem] p-7 transition-transform duration-300 hover:-translate-y-2 ${serviceAccent[i]}`}>
                <h3 className="font-display text-2xl font-bold">{s.t}</h3>
                <p className="text-[15px] leading-relaxed text-muted">{s.d}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-[1240px] px-5 pb-14 md:px-8 md:pb-20">
          <div className="relative flex flex-col gap-5 overflow-hidden rounded-[2rem] bg-gradient-to-br from-iris-800 to-iris-950 p-7 text-iris-50 md:flex-row md:items-center md:justify-between md:p-10">
            <div className="pointer-events-none absolute -bottom-24 -right-16 size-80 animate-drift rounded-full bg-[radial-gradient(circle,rgba(242,96,43,.35),transparent_70%)]" />
            <div className="relative flex max-w-2xl flex-col gap-3">
              <h2 className="font-display text-[1.75rem] font-bold leading-tight md:text-4xl">{r.listCta.title}</h2>
              <p className="text-base leading-7 text-iris-100">{r.listCta.text}</p>
              <p className="text-sm text-iris-200">{r.listCta.note}</p>
            </div>
            <div className="relative">
              <Button href={`/${lang}/account/listings/new`}>{r.listCta.btn}</Button>
            </div>
          </div>
        </section>

        <section id="listings" className="mx-auto w-full max-w-[1240px] scroll-mt-4 px-5 pb-14 md:px-8 md:pb-24">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-[2rem] font-bold leading-[1.1] tracking-tight md:text-5xl">
              {r.listingsTitle}
            </h2>
            {hasSamples && <PlaceholderTag>{r.sampleNote}</PlaceholderTag>}
          </div>
          {listings.length > 0 ? (
            <ListingBrowser lang={lang} listings={listings} labels={r} />
          ) : (
            <p className="rounded-[1.5rem] border border-dashed border-line bg-white p-8 text-muted">
              {r.noListings}
            </p>
          )}
        </section>

        <PageFaq lang={lang} title={dict.pageFaq.property} categories={["real_estate"]} />
        <CtaBand lang={lang} dict={dict} />
      </div>
</main>
      <Footer lang={lang} dict={dict} />
    </>
  );
}
