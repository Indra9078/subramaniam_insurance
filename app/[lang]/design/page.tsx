import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "../dictionaries";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
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
export default async function PreviewPage({ params }: PageProps<"/[lang]/design">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const { preview } = dict;

  return (
    <>
      <Hero lang={lang} dict={dict} />

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
              <PlaceholderTag>[Sample]</PlaceholderTag>
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
