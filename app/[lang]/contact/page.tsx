import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "../dictionaries";
import { PageHeader } from "@/components/layout/PageHeader";
import { Footer } from "@/components/layout/Footer";
import { Contact } from "@/components/home/Contact";
import { PlaceholderTag } from "@/components/ui/PlaceholderTag";
import { site } from "@/lib/site";
import { waLink } from "@/lib/whatsapp";
import { pageMetadata } from "@/lib/meta";

export async function generateMetadata({ params }: PageProps<"/[lang]/contact">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const d = await getDictionary(lang);
  return pageMetadata("/contact", d.contactPage.metaTitle, d.contactPage.metaDesc);
}

export default async function ContactPage({ params }: PageProps<"/[lang]/contact">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const cp = dict.contactPage;
  const c = dict.contact;

  const channels = [
    { t: c.call, d: cp.callD, v: site.phoneDisplay, href: site.phoneHref, cls: "bg-[#ffe9df]", ph: false },
    { t: c.whatsapp, d: cp.whatsappD, v: site.phoneDisplay, href: waLink(dict.whatsappText.general), cls: "bg-[#e7f5ec]", ph: false },
    { t: cp.email, d: cp.emailD, v: site.email, href: `mailto:${site.email}`, cls: "bg-iris-100", ph: false },
    { t: cp.visit, d: cp.visitD, v: c.address, href: undefined, cls: "bg-[#fff3cf]", ph: true },
  ];

  return (
    <>
      <PageHeader
        lang={lang}
        dict={dict}
        crumbs={[{ label: dict.nav.contact }]}
        eyebrow={cp.eyebrow}
        title={cp.title}
        sub={cp.sub}
      />
      <main className="flex-1">
        <section className="mx-auto w-full max-w-[1240px] px-5 pt-14 md:px-8 md:pt-20">
          <h2 className="font-display text-[1.75rem] font-bold leading-tight tracking-tight md:text-4xl">
            {cp.channelsTitle}
          </h2>
          <ul className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {channels.map((ch) => (
              <li key={ch.t} className={`relative flex flex-col gap-2 rounded-[1.75rem] p-6 transition-transform duration-300 hover:-translate-y-2 ${ch.cls}`}>
                <h3 className="font-display text-xl font-bold">
                  {ch.href ? (
                    <a href={ch.href} className="after:absolute after:inset-0 after:content-['']">
                      {ch.t}
                    </a>
                  ) : (
                    ch.t
                  )}
                </h3>
                <p className="text-[15px] text-muted">{ch.d}</p>
                <p className="mt-1 break-all text-sm">
                  {ch.ph ? (
                    <PlaceholderTag className="!rounded-xl">{ch.v}</PlaceholderTag>
                  ) : (
                    <span className="font-semibold">{ch.v}</span>
                  )}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <Contact lang={lang} dict={dict} />

        <section className="mx-auto w-full max-w-[1240px] px-5 pb-16 md:px-8 md:pb-24">
          <h2 className="font-display text-[1.75rem] font-bold leading-tight tracking-tight md:text-4xl">
            {cp.mapTitle}
          </h2>
          <div className="mt-7 flex h-64 items-center justify-center rounded-[2rem] border border-line bg-[linear-gradient(135deg,#e9e5ff,#f4f2ee)] md:h-80">
            <PlaceholderTag>{cp.mapPh}</PlaceholderTag>
          </div>
        </section>
      </main>
      <Footer lang={lang} dict={dict} />
    </>
  );
}
