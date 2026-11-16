import { Button } from "@/components/ui/Button";
import { PlaceholderTag } from "@/components/ui/PlaceholderTag";
import { site } from "@/lib/site";
import type { Dictionary } from "@/app/[lang]/dictionaries";

const field =
  "min-h-[50px] rounded-[14px] border border-[#cfccd6] bg-white px-3.5 text-base";

/** Layout of the contact section. The form is wired up in Stage 6. */
export function Contact({ dict }: { dict: Dictionary }) {
  const c = dict.contact;
  const f = c.form;
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
            <PlaceholderTag className="ml-2.5">{site.phoneDisplay}</PlaceholderTag>
          </Button>
          <Button href={site.whatsappHref}>{c.whatsapp}</Button>
        </div>
        <p className="text-sm leading-8 text-muted">
          {c.office} <PlaceholderTag>{c.address}</PlaceholderTag>
          <br />
          {c.hours} <PlaceholderTag>{c.hoursPh}</PlaceholderTag>
        </p>
      </div>

      <form className="flex min-w-0 flex-1 flex-col gap-[18px] rounded-[2rem] border border-line bg-white p-6 shadow-[0_30px_60px_rgba(43,35,80,.12)] md:p-9">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="f-name" className="text-sm font-semibold">
            {f.name}
          </label>
          <input id="f-name" name="name" type="text" autoComplete="name" className={field} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="f-phone" className="text-sm font-semibold">
            {f.phone}
          </label>
          <input id="f-phone" name="phone" type="tel" autoComplete="tel" className={field} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="f-interest" className="text-sm font-semibold">
            {f.interest}
          </label>
          <select id="f-interest" name="interest" className={field}>
            {f.interestOptions.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="f-time" className="text-sm font-semibold">
            {f.time}
          </label>
          <select id="f-time" name="time" className={field}>
            {f.timeOptions.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </div>
        <div className="flex items-start gap-2.5">
          <input id="f-consent" name="consent" type="checkbox" className="mt-0.5 size-5" />
          <label htmlFor="f-consent" className="text-sm leading-relaxed text-muted">
            {f.consent}
          </label>
        </div>
        <button
          type="button"
          aria-describedby="form-pending"
          className="btn-sheen min-h-[54px] rounded-full text-base font-semibold text-white"
        >
          {f.submit}
        </button>
        <p id="form-pending" className="text-center text-xs">
          <PlaceholderTag>{f.pending}</PlaceholderTag>
        </p>
      </form>
    </section>
  );
}
