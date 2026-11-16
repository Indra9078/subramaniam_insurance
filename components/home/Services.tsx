import { Button } from "@/components/ui/Button";
import { PlaceholderTag } from "@/components/ui/PlaceholderTag";
import type { Dictionary } from "@/app/[lang]/dictionaries";

const bentoStyles = [
  "bg-[#ffe9df]",
  "bg-[#e7f5ec]",
  "bg-iris-100",
];

export function Services({ lang, dict }: { lang: string; dict: Dictionary }) {
  const s = dict.services;
  return (
    <section
      id="insurance"
      className="mx-auto w-full max-w-[1240px] scroll-mt-4 px-5 py-16 md:px-8 md:py-28"
    >
      <div className="flex max-w-3xl flex-col gap-3.5">
        <p className="text-sm font-semibold uppercase tracking-wider text-ember">
          {s.tag}
        </p>
        <h2 className="font-display text-[2rem] font-bold leading-[1.1] tracking-tight md:text-6xl">
          {s.title}
        </h2>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-5 md:mt-12 md:grid-cols-12 md:gap-[22px]">
        <article className="relative flex min-w-0 flex-col gap-5 overflow-hidden rounded-[2rem] border border-line bg-white p-7 transition-transform duration-300 hover:-translate-y-2 md:col-span-7 md:p-10">
          <div className="pointer-events-none absolute -right-14 -top-14 size-64 rounded-full bg-[radial-gradient(circle,rgba(242,96,43,.22),transparent_70%)]" />
          <h3 className="relative font-display text-3xl font-bold md:text-4xl">
            {s.insTitle}
          </h3>
          <p className="relative max-w-lg text-base leading-7 text-muted md:text-[17px]">
            {s.insText}
          </p>
          <ul className="relative flex flex-wrap gap-2.5">
            {s.insProducts.map((p) => (
              <li
                key={p}
                className="rounded-full bg-paper px-4 py-2.5 font-semibold"
              >
                {p}
              </li>
            ))}
          </ul>
          <div className="relative">
            <PlaceholderTag>{s.confirm}</PlaceholderTag>
          </div>
          <Button href={`/${lang}#contact`} className="relative self-start">
            {s.insBtn}
          </Button>
        </article>

        <article
          id="property"
          className="relative flex min-w-0 scroll-mt-4 flex-col gap-5 overflow-hidden rounded-[2rem] bg-gradient-to-br from-iris-800 to-iris-900 p-7 text-iris-50 transition-transform duration-300 hover:-translate-y-2 md:col-span-5 md:p-10"
        >
          <div className="pointer-events-none absolute -bottom-20 -right-20 size-72 animate-drift rounded-full bg-[radial-gradient(circle,rgba(142,124,255,.6),transparent_70%)]" />
          <h3 className="relative font-display text-3xl font-bold md:text-4xl">
            {s.propTitle}
          </h3>
          <p className="relative text-base leading-7 text-iris-100 md:text-[17px]">
            {s.propText}
          </p>
          <ul className="relative flex flex-wrap gap-2.5">
            {s.propTypes.map((p) => (
              <li
                key={p}
                className="rounded-full bg-white/12 px-4 py-2.5 font-semibold"
              >
                {p}
              </li>
            ))}
          </ul>
          <div className="relative">
            <PlaceholderTag tone="dark">{s.propConfirm}</PlaceholderTag>
          </div>
          <Button
            href={`/${lang}#contact`}
            variant="light"
            className="relative self-start"
          >
            {s.propBtn}
          </Button>
        </article>

        {s.bento.map((b, i) => (
          <article
            key={b.t}
            className={`flex min-w-0 flex-col gap-3 rounded-[1.75rem] p-7 transition-transform duration-300 hover:-translate-y-2 md:col-span-4 md:p-8 ${bentoStyles[i]}`}
          >
            <h3 className="font-display text-2xl font-bold">{b.t}</h3>
            <p className="text-[15px] leading-relaxed text-muted">{b.d}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
