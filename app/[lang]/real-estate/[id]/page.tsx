import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "../../dictionaries";
import { PageHeader } from "@/components/layout/PageHeader";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { PlaceholderTag } from "@/components/ui/PlaceholderTag";
import { getListing, listings } from "@/lib/listings";
import { site } from "@/lib/site";
import { pageMetadata } from "@/lib/meta";

// Sample listings are known at build time. In Stage 5 this list comes from Supabase.
export function generateStaticParams() {
  return listings.map((l) => ({ id: l.id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/real-estate/[id]">): Promise<Metadata> {
  const { lang, id } = await params;
  const listing = getListing(id);
  if (!hasLocale(lang) || !listing) return {};
  return pageMetadata(
    `/real-estate/${id}`,
    listing.title[lang],
    `${listing.location[lang]} · ${listing.size[lang]}`,
  );
}

export default async function ListingPage({ params }: PageProps<"/[lang]/real-estate/[id]">) {
  const { lang, id } = await params;
  const listing = getListing(id);
  if (!hasLocale(lang) || !listing) notFound();
  const dict = await getDictionary(lang);
  const r = dict.realEstate;
  const d = r.detail;

  const facts = [
    { k: d.price, v: listing.price[lang] },
    { k: d.size, v: listing.size[lang] },
    { k: d.location, v: listing.location[lang] },
    { k: d.type, v: r.types[listing.type] },
  ];

  return (
    <>
      <PageHeader
        lang={lang}
        dict={dict}
        crumbs={[
          { href: `/${lang}/real-estate`, label: dict.nav.realEstate },
          { label: listing.title[lang] },
        ]}
        eyebrow={`${r.types[listing.type]} · ${listing.location[lang]}`}
        title={listing.title[lang]}
      >
        <div>
          <PlaceholderTag tone="dark">{r.sampleNote}</PlaceholderTag>
        </div>
      </PageHeader>

      <main className="flex-1">
        <div className="mx-auto grid w-full max-w-[1240px] gap-10 px-5 py-12 md:px-8 md:py-20 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-12">
          <div className="flex min-w-0 flex-col gap-10">
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={`flex items-center justify-center rounded-[1.5rem] bg-gradient-to-br ${listing.cover} ${i === 0 ? "col-span-2 h-56 md:h-80" : "h-32 md:h-44"}`}
                >
                  <PlaceholderTag>
                    {d.photos} {i + 1}
                  </PlaceholderTag>
                </div>
              ))}
            </div>

            <section className="flex flex-col gap-4">
              <h2 className="font-display text-2xl font-bold md:text-3xl">{d.about}</h2>
              <PlaceholderTag block>{listing.description[lang]}</PlaceholderTag>
            </section>

            <section className="flex flex-col gap-4">
              <h2 className="font-display text-2xl font-bold md:text-3xl">{d.features}</h2>
              <ul className="grid gap-3 sm:grid-cols-2">
                {listing.features[lang].map((f) => (
                  <li key={f} className="flex gap-3 rounded-2xl border border-line bg-white p-4 text-[15px]">
                    <span aria-hidden="true" className="mt-2 size-2 shrink-0 rounded-full bg-ember" />
                    <PlaceholderTag>{f}</PlaceholderTag>
                  </li>
                ))}
              </ul>
            </section>

            <Link
              href={`/${lang}/real-estate#listings`}
              className="inline-flex min-h-11 items-center self-start font-semibold text-ember underline-offset-4 hover:underline"
            >
              ← {d.back}
            </Link>
          </div>

          <aside className="flex min-w-0 flex-col gap-5 lg:sticky lg:top-6 lg:self-start">
            <dl className="grid grid-cols-2 gap-3 rounded-[1.75rem] border border-line bg-white p-6">
              {facts.map((f) => (
                <div key={f.k} className="flex flex-col gap-1">
                  <dt className="text-sm text-muted">{f.k}</dt>
                  <dd className="font-display text-lg font-bold">
                    <PlaceholderTag>{f.v}</PlaceholderTag>
                  </dd>
                </div>
              ))}
            </dl>
            <div className="relative flex flex-col gap-4 overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-iris-800 to-iris-950 p-6 text-iris-50 md:p-8">
              <div className="pointer-events-none absolute -bottom-20 -right-20 size-60 animate-drift rounded-full bg-[radial-gradient(circle,rgba(242,96,43,.35),transparent_70%)]" />
              <h2 className="relative font-display text-2xl font-bold">{d.enquireTitle}</h2>
              <p className="relative text-[15px] leading-relaxed text-iris-100">{d.enquireText}</p>
              <p className="relative text-sm text-iris-200">
                {dict.hero.phone} <PlaceholderTag tone="dark">{site.phoneDisplay}</PlaceholderTag>
              </p>
              <div className="relative flex flex-col gap-3">
                <Button href={site.phoneHref} variant="light">{dict.cta.call}</Button>
                <Button href={site.whatsappHref} variant="outlineLight">{dict.cta.whatsapp}</Button>
                <Button href={`/${lang}/contact`}>{dict.common.enquire}</Button>
              </div>
            </div>
            <p className="text-sm leading-6 text-muted">{d.verify}</p>
          </aside>
        </div>
      </main>
      <Footer lang={lang} nav={dict.nav} footer={dict.footer} />
    </>
  );
}
