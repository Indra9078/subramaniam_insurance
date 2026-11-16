import { Button } from "@/components/ui/Button";
import { PlaceholderTag } from "@/components/ui/PlaceholderTag";
import { LeadForm } from "@/components/forms/LeadForm";
import { site } from "@/lib/site";
import { waLink } from "@/lib/whatsapp";
import type { Dictionary } from "@/app/[lang]/dictionaries";

/** Contact section with the call-back form (home and contact pages). */
export function Contact({ lang, dict }: { lang: string; dict: Dictionary }) {
  const c = dict.contact;
  const wa = waLink(dict.whatsappText.general);
  return (
    <section
      id="contact"
      className="mx-auto flex w-full max-w-[1240px] scroll-mt-4 flex-col gap-10 px-5 py-14 md:px-8 md:py-24 lg:flex-row lg:gap-12"
    >
      <div className="flex min-w-0 flex-1 flex-col gap-5">
        <h2 className="font-display text-[2rem] font-bold leading-[1.1] tracking-tight md:text-[3.25rem]">
          {c.title}
        </h2>
        <p className="text-base leading-7 text-muted md:text-lg">{c.sub}</p>
        <div className="flex flex-wrap gap-3">
          <Button href={site.phoneHref} variant="dark">
            {c.call}
            <span className="ml-2.5">{site.phoneDisplay}</span>
          </Button>
          <Button href={wa}>{c.whatsapp}</Button>
        </div>
        <p className="text-sm leading-8 text-muted">
          {c.office} <PlaceholderTag>{c.address}</PlaceholderTag>
          <br />
          {c.hours} <PlaceholderTag>{c.hoursPh}</PlaceholderTag>
        </p>
      </div>

      <div className="min-w-0 flex-1 rounded-[2rem] border border-line bg-white p-6 shadow-[0_30px_60px_rgba(43,35,80,.12)] md:p-9">
        <LeadForm kind="callback" lang={lang} dict={dict} waHref={wa} />
      </div>
    </section>
  );
}
