import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "./dictionaries";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { OrbitHero } from "@/components/hero/OrbitHero";
import { Button } from "@/components/ui/Button";
import { Marquee } from "@/components/ui/Marquee";
import { PlaceholderTag } from "@/components/ui/PlaceholderTag";

const swatches = [
  { name: "paper", value: "#F4F2EE", text: "text-ink" },
  { name: "ink", value: "#1B1A1F", text: "text-white" },
  { name: "ember", value: "#C94312", text: "text-white" },
  { name: "ember-soft", value: "#FF8A5B", text: "text-ink" },
  { name: "iris-200", value: "#C9BFFF", text: "text-ink" },
  { name: "iris-500", value: "#6E5BE0", text: "text-white" },
  { name: "iris-800", value: "#352A66", text: "text-white" },
  { name: "iris-900", value: "#2B2350", text: "text-white" },
];

/**
 * Stage 2 preview: shows the design system (colors, type, buttons, cards,
 * orbit hero, placeholder tags). Replaced by the real home page in Stage 3.
 */
export default async function PreviewPage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const { hero, preview } = dict;

  return (
    <>
      <div className="relative overflow-hidden bg-gradient-to-br from-iris-900 via-iris-800 to-iris-950 text-iris-50">
        <div className="pointer-events-none absolute -left-32 -top-20 size-[520px] animate-drift rounded-full bg-[radial-gradient(circle,rgba(142,124,255,.55),transparent_65%)]" />
        <div className="pointer-events-none absolute -right-24 top-44 size-[620px] animate-drift rounded-full bg-[radial-gradient(circle,rgba(242,96,43,.32),transparent_65%)] [animation-direction:reverse] [animation-duration:18s]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,.12)_1px,transparent_1px)] [background-size:32px_32px] opacity-50" />

        <Navbar lang={lang} nav={dict.nav} />

        <div className="relative mx-auto flex max-w-[1240px] flex-col items-center gap-10 px-5 pb-16 pt-6 md:px-8 lg:flex-row lg:gap-12 lg:pb-28 lg:pt-10">
          <div className="flex min-w-0 flex-1 flex-col gap-6 lg:gap-7">
            <div className="inline-flex items-center gap-2.5 self-start rounded-full border border-iris-200/35 bg-white/10 px-4 py-2 text-sm font-medium text-iris-100">
              <span className="size-2 rounded-full bg-ember-soft shadow-[0_0_10px_#ff8a5b]" />
              {hero.eyebrow}
            </div>
            <h1 className="font-display text-[2.5rem] font-bold leading-[1.08] tracking-tight text-white sm:text-6xl lg:text-7xl">
              {hero.titleA} <span className="gradient-text">{hero.titleB}</span>
            </h1>
            <p className="max-w-xl text-base leading-7 text-iris-100/90 md:text-lg">
              {hero.sub}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-3.5">
              <Button href={`/${lang}#contact`}>{hero.btnInsurance}</Button>
              <Button href={`/${lang}#contact`} variant="light">
                {hero.btnProperty}
              </Button>
              <Button href={`/${lang}#contact`} variant="outlineLight">
                {hero.btnWhatsapp}
              </Button>
            </div>
            <p className="text-sm text-iris-200">
              {hero.phone}{" "}
              <PlaceholderTag tone="dark">+91 00000 00000</PlaceholderTag>
            </p>
          </div>

          <div className="w-full max-w-[540px] flex-1">
            <OrbitHero coreLabel={dict.orbit.core} label={dict.orbit.label} />
          </div>
        </div>
      </div>

      <Marquee
        items={["LIC", "Star Health Insurance", "IFFCO-Tokio General Insurance", dict.marquee]}
      />

      <main className="mx-auto w-full max-w-[1240px] flex-1 px-5 py-14 md:px-8 md:py-20">
        <div className="mb-12 flex flex-col gap-4 md:mb-16">
          <span className="self-start rounded-full bg-iris-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-iris-800">
            {preview.badge}
          </span>
          <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
            {preview.title}
          </h2>
          <p className="max-w-2xl text-lg leading-8 text-muted">{preview.intro}</p>
        </div>

        <section aria-labelledby="colors" className="mb-14">
          <h3 id="colors" className="mb-5 font-display text-2xl font-bold">
            {preview.colors}
          </h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {swatches.map((s) => (
              <div
                key={s.name}
                className={`flex h-24 flex-col justify-end rounded-2xl border border-line p-3 text-sm font-semibold ${s.text}`}
                style={{ background: s.value }}
              >
                {s.name}
                <span className="font-normal opacity-80">{s.value}</span>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="type" className="mb-14">
          <h3 id="type" className="mb-5 font-display text-2xl font-bold">
            {preview.typography}
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-line bg-white p-6 md:p-8">
              <p className="mb-3 text-sm text-muted">{preview.typographyEn}</p>
              <p lang="en" className="font-display text-4xl font-bold leading-tight tracking-tight">
                Protection and property, made simple.
              </p>
            </div>
            <div className="rounded-3xl border border-line bg-white p-6 md:p-8">
              <p className="mb-3 text-sm text-muted">{preview.typographyTa}</p>
              <p lang="ta" className="font-display text-4xl font-bold leading-snug">
                காப்பீடு மற்றும் சொத்து, எளிமையாக.
              </p>
            </div>
          </div>
        </section>

        <section aria-labelledby="buttons" className="mb-14">
          <h3 id="buttons" className="mb-5 font-display text-2xl font-bold">
            {preview.buttons}
          </h3>
          <div className="flex flex-wrap gap-3 rounded-3xl border border-line bg-white p-6">
            <Button href="#buttons">Primary</Button>
            <Button href="#buttons" variant="dark">
              Dark
            </Button>
            <Button href="#buttons" variant="outline">
              Outline
            </Button>
            <span className="rounded-full bg-iris-900 p-1.5">
              <Button href="#buttons" variant="light">
                Light
              </Button>
            </span>
          </div>
        </section>

        <section aria-labelledby="tags" className="mb-14">
          <h3 id="tags" className="mb-5 font-display text-2xl font-bold">
            {preview.placeholders}
          </h3>
          <div className="flex flex-col gap-4 rounded-3xl border border-line bg-white p-6">
            <p className="text-muted">{preview.placeholdersNote}</p>
            <div className="flex flex-wrap items-center gap-4">
              <PlaceholderTag>+91 00000 00000</PlaceholderTag>
              <PlaceholderTag>[REG. NO. TO ADD]</PlaceholderTag>
              <PlaceholderTag>[00]+</PlaceholderTag>
              <span className="rounded-full bg-iris-900 px-3 py-2">
                <PlaceholderTag tone="dark">Real client quote</PlaceholderTag>
              </span>
            </div>
          </div>
        </section>

        <section aria-labelledby="cards">
          <h3 id="cards" className="mb-5 font-display text-2xl font-bold">
            {preview.cards}
          </h3>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="flex flex-col gap-3 rounded-3xl border border-line bg-white p-7 transition-transform duration-300 hover:-translate-y-2 md:p-9">
              <h4 className="font-display text-3xl font-bold">{preview.cardInsuranceTitle}</h4>
              <p className="leading-7 text-muted">{preview.cardInsuranceText}</p>
            </div>
            <div className="flex flex-col gap-3 rounded-3xl bg-gradient-to-br from-iris-800 to-iris-900 p-7 text-iris-50 transition-transform duration-300 hover:-translate-y-2 md:p-9">
              <h4 className="font-display text-3xl font-bold">{preview.cardPropertyTitle}</h4>
              <p className="leading-7 text-iris-100">{preview.cardPropertyText}</p>
            </div>
          </div>
        </section>
      </main>

      <Footer lang={lang} nav={dict.nav} footer={dict.footer} />
    </>
  );
}
