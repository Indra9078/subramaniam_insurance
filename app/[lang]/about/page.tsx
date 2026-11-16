import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "../dictionaries";
import { PageHeader } from "@/components/layout/PageHeader";
import { Footer } from "@/components/layout/Footer";
import { CtaBand } from "@/components/ui/CtaBand";
import { PlaceholderTag } from "@/components/ui/PlaceholderTag";
import { insurers } from "@/lib/site";
import { pageMetadata } from "@/lib/meta";

const statPlaceholders = ["[00]+", "[000]+", "[00]+"];
const roleAccent = ["bg-[#ffe9df]", "bg-iris-100", "bg-[#e7f5ec]", "bg-[#fff3cf]"];

export async function generateMetadata({ params }: PageProps<"/[lang]/about">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const d = await getDictionary(lang);
  return pageMetadata("/about", d.about.metaTitle, d.about.metaDesc);
}

export default async function AboutPage({ params }: PageProps<"/[lang]/about">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const a = dict.about;

  return (
    <>
      <PageHeader
        lang={lang}
        dict={dict}
        crumbs={[{ label: dict.nav.about }]}
        eyebrow={a.eyebrow}
        title={a.title}
        sub={a.sub}
      />
      <main className="flex-1">
        <section className="mx-auto grid w-full max-w-[1240px] gap-10 px-5 py-14 md:px-8 md:py-24 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14">
          <div className="flex aspect-[4/5] w-full max-w-md items-center justify-center rounded-[2rem] bg-gradient-to-br from-iris-100 to-[#ffe9df]">
            <PlaceholderTag>{a.portrait}</PlaceholderTag>
          </div>
          <div className="flex min-w-0 flex-col gap-6">
            <h2 className="font-display text-[2rem] font-bold leading-[1.1] tracking-tight md:text-5xl">
              {a.storyTitle}
            </h2>
            <p className="text-base leading-7 text-muted md:text-lg">{dict.why.text}</p>
            <PlaceholderTag block>{a.story}</PlaceholderTag>
            <ul className="mt-2 flex flex-wrap gap-4">
              {dict.why.stats.map((label, i) => (
                <li key={label} className="min-w-[140px] flex-1 rounded-[22px] border border-line bg-white p-5">
                  <div className="font-display text-3xl font-bold md:text-4xl">
                    <PlaceholderTag>{statPlaceholders[i]}</PlaceholderTag>
                  </div>
                  <div className="mt-2 text-sm text-muted">{label}</div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mx-auto w-full max-w-[1240px] px-5 pb-14 md:px-8 md:pb-24">
          <h2 className="font-display text-[2rem] font-bold leading-[1.1] tracking-tight md:text-5xl">
            {a.rolesTitle}
          </h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {a.roles.map((r, i) => (
              <article key={r.t} className={`flex flex-col gap-3 rounded-[1.75rem] p-7 transition-transform duration-300 hover:-translate-y-2 ${roleAccent[i]}`}>
                <h3 className="font-display text-xl font-bold">{r.t}</h3>
                <p className="text-[15px] leading-relaxed text-muted">{r.d}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="relative overflow-hidden bg-gradient-to-b from-iris-900 via-iris-800 to-iris-950 text-iris-50">
          <div className="pointer-events-none absolute -bottom-32 -left-32 size-[460px] animate-drift rounded-full bg-[radial-gradient(circle,rgba(142,124,255,.5),transparent_65%)]" />
          <div className="relative mx-auto grid max-w-[1240px] gap-10 px-5 py-16 md:px-8 md:py-24 lg:grid-cols-2 lg:gap-14">
            <div className="flex flex-col gap-5">
              <h2 className="font-display text-[2rem] font-bold leading-[1.1] md:text-[2.75rem]">
                {a.insurersTitle}
              </h2>
              <p className="text-base leading-7 text-iris-100">{a.insurersText}</p>
              <ul className="flex flex-wrap gap-3">
                {insurers.map((name) => (
                  <li key={name} className="rounded-full border border-iris-200/35 bg-white/10 px-5 py-3 font-semibold">
                    {name}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-5 rounded-[2rem] border border-iris-200/30 bg-white/8 p-6 md:p-8">
              <h2 className="font-display text-2xl font-bold md:text-3xl">{a.credentialsTitle}</h2>
              <dl className="grid gap-4 text-[15px]">
                <div className="flex flex-col gap-1">
                  <dt className="text-iris-200">{a.irdai}</dt>
                  <dd><PlaceholderTag tone="dark">{a.irdaiPh}</PlaceholderTag></dd>
                </div>
                <div className="flex flex-col gap-1">
                  <dt className="text-iris-200">{a.expiry}</dt>
                  <dd><PlaceholderTag tone="dark">{a.expiryPh}</PlaceholderTag></dd>
                </div>
                <div className="flex flex-col gap-1">
                  <dt className="text-iris-200">{a.certificates}</dt>
                  <dd><PlaceholderTag tone="dark">{a.certificatesPh}</PlaceholderTag></dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-[1240px] px-5 py-14 md:px-8 md:py-24">
          <h2 className="font-display text-[2rem] font-bold leading-[1.1] tracking-tight md:text-5xl">
            {a.valuesTitle}
          </h2>
          <ol className="mt-8 grid gap-5 md:grid-cols-3">
            {a.values.map((v, i) => (
              <li key={v.t} className="flex flex-col gap-3 rounded-[1.75rem] border border-line bg-white p-7">
                <span className="flex size-11 items-center justify-center rounded-full bg-ember font-display text-lg font-bold text-white">
                  {i + 1}
                </span>
                <h3 className="font-display text-xl font-bold">{v.t}</h3>
                <p className="text-[15px] leading-relaxed text-muted">{v.d}</p>
              </li>
            ))}
          </ol>
        </section>

        <CtaBand lang={lang} dict={dict} />
      </main>
      <Footer lang={lang} nav={dict.nav} footer={dict.footer} />
    </>
  );
}
