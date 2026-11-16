import { Button } from "@/components/ui/Button";
import { site } from "@/lib/site";
import type { Dictionary } from "@/app/[lang]/dictionaries";

/** Closing call to action: call, WhatsApp or request a call back. */
export function CtaBand({
  lang,
  dict,
  title,
  text,
}: {
  lang: string;
  dict: Dictionary;
  title?: string;
  text?: string;
}) {
  const c = dict.cta;
  return (
    <section className="mx-auto w-full max-w-[1240px] px-5 pb-16 md:px-8 md:pb-24">
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-iris-800 to-iris-950 p-7 text-iris-50 md:p-12">
        <div className="pointer-events-none absolute -bottom-24 -right-16 size-80 animate-drift rounded-full bg-[radial-gradient(circle,rgba(242,96,43,.35),transparent_70%)]" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex max-w-2xl flex-col gap-3">
            <h2 className="font-display text-[1.75rem] font-bold leading-tight md:text-4xl">
              {title ?? c.title}
            </h2>
            <p className="text-base leading-7 text-iris-100 md:text-lg">{text ?? c.text}</p>
            <p className="text-sm text-iris-200">
              {dict.hero.phone}{" "}
              <a href={site.phoneHref} className="font-semibold text-white underline-offset-4 hover:underline">
                {site.phoneDisplay}
              </a>
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button href={site.phoneHref} variant="light">
              {c.call}
            </Button>
            <Button href={site.whatsappHref} variant="outlineLight">
              {c.whatsapp}
            </Button>
            <Button href={`/${lang}/contact`}>{c.contact}</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
