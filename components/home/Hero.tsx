import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { OrbitHero } from "@/components/hero/OrbitHero";
import { Button } from "@/components/ui/Button";
import { PlaceholderTag } from "@/components/ui/PlaceholderTag";
import { site } from "@/lib/site";
import { waLink } from "@/lib/whatsapp";
import type { Dictionary } from "@/app/[lang]/dictionaries";

export function Hero({ lang, dict }: { lang: string; dict: Dictionary }) {
  const { hero } = dict;
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-iris-900 via-iris-800 to-iris-950 text-iris-50">
      {/* Blurred insurance + real-estate scene (public/images/hero-bg.jpg: swap in a real photo any time). */}
      <Image
        src="/images/hero-bg.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="pointer-events-none select-none object-cover opacity-55"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-iris-950/90 via-iris-900/55 to-iris-900/10 lg:via-iris-900/45" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-iris-950/80 to-transparent" />
      <div className="pointer-events-none absolute -left-32 -top-20 size-[520px] animate-drift rounded-full bg-[radial-gradient(circle,rgba(142,124,255,.55),transparent_65%)]" />
      <div className="pointer-events-none absolute -right-24 top-44 size-[620px] animate-drift rounded-full bg-[radial-gradient(circle,rgba(242,96,43,.32),transparent_65%)] [animation-direction:reverse] [animation-duration:18s]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,.12)_1px,transparent_1px)] [background-size:32px_32px] opacity-50" />

      <Navbar lang={lang} nav={dict.nav} />

      <div id="content" tabIndex={-1} className="relative mx-auto flex max-w-[1240px] flex-col items-center gap-10 outline-none px-5 pb-16 pt-6 md:px-8 lg:flex-row lg:gap-12 lg:pb-28 lg:pt-10">
        <div className="flex min-w-0 flex-1 flex-col gap-6 lg:gap-7">
          <div className="inline-flex items-center gap-2.5 self-start rounded-full border border-iris-200/35 bg-white/10 px-4 py-2 text-sm font-medium text-iris-100">
            <span className="size-2 shrink-0 rounded-full bg-ember-soft shadow-[0_0_10px_#ff8a5b]" />
            {hero.eyebrow}
          </div>
          <h1 className="font-display text-[2.5rem] font-bold leading-[1.08] tracking-tight text-white sm:text-6xl lg:text-7xl">
            {hero.titleA} <span className="gradient-text">{hero.titleB}</span>
          </h1>
          <p className="max-w-xl text-base leading-7 text-iris-100/90 md:text-lg">
            {hero.sub}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-3.5">
            <Button href={site.phoneHref}>{hero.btnInsurance}</Button>
            <Button href={site.phoneHref} variant="light">
              {hero.btnProperty}
            </Button>
            <Button href={waLink(dict.whatsappText.general)} variant="outlineLight">
              {hero.btnWhatsapp}
            </Button>
          </div>
          <ul className="grid max-w-xl grid-cols-3 gap-2.5 sm:gap-3">
            {dict.why.stats.map((label, i) => (
              <li key={label} className="rounded-[18px] border border-iris-200/30 bg-white/10 p-3 backdrop-blur-sm sm:p-4">
                <div className="font-display text-xl font-bold text-white sm:text-3xl">
                  <PlaceholderTag tone="dark">{["[00]+", "[000]+", "[00]+"][i]}</PlaceholderTag>
                </div>
                <div className="mt-1.5 text-[11px] leading-snug text-iris-100 sm:text-sm">{label}</div>
              </li>
            ))}
          </ul>
          <p className="text-sm text-iris-200">
            {hero.phone}{" "}
            <a href={site.phoneHref} className="font-semibold text-white underline-offset-4 hover:underline">
              {site.phoneDisplay}
            </a>
          </p>
        </div>

        <div className="w-full max-w-[540px] flex-1">
          <OrbitHero coreLabel={dict.orbit.core} label={dict.orbit.label} />
        </div>
      </div>
    </div>
  );
}
