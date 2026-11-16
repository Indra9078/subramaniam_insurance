import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "../../dictionaries";
import { PageHeader } from "@/components/layout/PageHeader";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { PlaceholderTag } from "@/components/ui/PlaceholderTag";
import { getListing, getListings } from "@/lib/data";
import { listingCovers } from "@/lib/types";
import { site } from "@/lib/site";
import { pageMetadata } from "@/lib/meta";

// Listings that exist at build time are prerendered. New ones added from the
// admin page render on their first visit and are cached after that.
// Cache Components needs at least one value, so an empty database yields a stand-in.
export async function generateStaticParams() {
  const listings = await getListings();
  return listings.length ? listings.map((l) => ({ slug: l.slug })) : [{ slug: "none" }];
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/real-estate/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  const listing = await getListing(slug);
  if (!hasLocale(lang) || !listing) return {};
  return pageMetadata(
    `/real-estate/${slug}`,
    listing.title[lang],
    [listing.location[lang], listing.size[lang]].filter(Boolean).join(" · "),
  );
}

export default async function ListingPage({ params }: PageProps<"/[lang]/real-estate/[slug]">) {
  const { lang, slug } = await params;
  const listing = await getListing(slug);
  if (!hasLocale(lang) || !listing) notFound();
  const dict = await getDictionary(lang);
  const r = dict.realEstate;
  const d = r.detail;
  const sample = listing.isSample;
  const title = listing.title[lang];
  const cover = listingCovers[listing.title.en.length % listingCovers.length];

  const facts = [
    { k: d.price, v: listing.price[lang] },
    { k: d.size, v: listing.size[lang] },
    { k: d.location, v: listing.location[lang] },
    { k: d.type, v: r.types[listing.type] },
  ].filter((f) => f.v);

  const Value = ({ children }: { children: string }) =>
    sample ? <PlaceholderTag>{children}</PlaceholderTag> : <>{children}</>;

  return (
    <>
      <PageHeader
        lang={lang}
        dict={dict}
        crumbs={[
          { href: `/${lang}/real-estate`, label: dict.nav.realEstate },
          { label: title },
        ]}
        eyebrow={`${r.types[listing.type]} · ${listing.location[lang]}${listing.status === "sold" ? ` · ${r.sold}` : ""}`}
        title={title}
      >
        {sample && (
          <div>
            <PlaceholderTag tone="dark">{r.sampleNote}</PlaceholderTag>
          </div>
        )}
      </PageHeader>

      <main className="flex-1">
        <div className="mx-auto grid w-full max-w-[1240px] gap-10 px-5 py-12 md:px-8 md:py-20 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-12">
          <div className="flex min-w-0 flex-col gap-10">
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              {(listing.photos.length ? listing.photos : [null, null, null]).map((src, i) => (
                <div
                  key={src ?? i}
                  className={`relative flex items-center justify-center overflow-hidden rounded-[1.5rem] bg-gradient-to-br ${cover} ${i === 0 ? "col-span-2 h-56 md:h-96" : "h-32 md:h-48"}`}
                >
                  {src ? (
                    <Image
                      src={src}
                      alt={`${title} ${i + 1}`}
                      fill
                      priority={i === 0}
                      sizes={i === 0 ? "(min-width: 1024px) 700px, 100vw" : "(min-width: 1024px) 350px, 50vw"}
                      className="object-cover"
                    />
                  ) : (
                    <PlaceholderTag>
                      {d.photos} {i + 1}
                    </PlaceholderTag>
                  )}
                </div>
              ))}
            </div>

            {listing.description[lang] && (
              <section className="flex flex-col gap-4">
                <h2 className="font-display text-2xl font-bold md:text-3xl">{d.about}</h2>
                {sample ? (
                  <PlaceholderTag block>{listing.description[lang]}</PlaceholderTag>
                ) : (
                  <p className="whitespace-pre-line text-base leading-7 text-muted md:text-lg">
                    {listing.description[lang]}
                  </p>
                )}
              </section>
            )}

            {listing.features[lang].length > 0 && (
              <section className="flex flex-col gap-4">
                <h2 className="font-display text-2xl font-bold md:text-3xl">{d.features}</h2>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {listing.features[lang].map((f) => (
                    <li key={f} className="flex gap-3 rounded-2xl border border-line bg-white p-4 text-[15px]">
                      <span aria-hidden="true" className="mt-2 size-2 shrink-0 rounded-full bg-ember" />
                      <Value>{f}</Value>
                    </li>
                  ))}
                </ul>
              </section>
            )}

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
                    <Value>{f.v}</Value>
                  </dd>
                </div>
              ))}
            </dl>
            <div className="relative flex flex-col gap-4 overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-iris-800 to-iris-950 p-6 text-iris-50 md:p-8">
              <div className="pointer-events-none absolute -bottom-20 -right-20 size-60 animate-drift rounded-full bg-[radial-gradient(circle,rgba(242,96,43,.35),transparent_70%)]" />
              <h2 className="relative font-display text-2xl font-bold">{d.enquireTitle}</h2>
              <p className="relative text-[15px] leading-relaxed text-iris-100">{d.enquireText}</p>
              <p className="relative text-sm text-iris-200">
                {dict.hero.phone}{" "}
                <a href={site.phoneHref} className="font-semibold text-white underline-offset-4 hover:underline">
                  {site.phoneDisplay}
                </a>
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
