import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "../dictionaries";
import { PageHeader } from "@/components/layout/PageHeader";
import { Footer } from "@/components/layout/Footer";
import { CtaBand } from "@/components/ui/CtaBand";
import { PlaceholderTag } from "@/components/ui/PlaceholderTag";
import { ListingBrowser } from "@/components/realestate/ListingBrowser";
import { listings } from "@/lib/listings";
import { pageMetadata } from "@/lib/meta";

const serviceAccent = ["bg-[#ffe9df]", "bg-[#e7f5ec]", "bg-iris-100", "bg-[#fff3cf]"];

export async function generateMetadata({ params }: PageProps<"/[lang]/real-estate">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const d = await getDictionary(lang);
  return pageMetadata("/real-estate", d.realEstate.metaTitle, d.realEstate.metaDesc);
}

export default async function RealEstatePage({ params }: PageProps<"/[lang]/real-estate">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const r = dict.realEstate;

  return (
    <>
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
      <main className="flex-1">
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

        <section id="listings" className="mx-auto w-full max-w-[1240px] scroll-mt-4 px-5 pb-14 md:px-8 md:pb-24">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-[2rem] font-bold leading-[1.1] tracking-tight md:text-5xl">
              {r.listingsTitle}
            </h2>
            <PlaceholderTag>{r.sampleNote}</PlaceholderTag>
          </div>
          <ListingBrowser lang={lang} listings={listings} labels={r} />
        </section>

        <CtaBand lang={lang} dict={dict} />
      </main>
      <Footer lang={lang} nav={dict.nav} footer={dict.footer} />
    </>
  );
}
