import { PlaceholderTag } from "@/components/ui/PlaceholderTag";
import type { Testimonial } from "@/lib/types";
import type { Dictionary, Locale } from "@/app/[lang]/dictionaries";

/**
 * Real quotes only, published from the admin page once written permission is
 * on record. Until then three placeholder cards show.
 */
export function Testimonials({
  lang,
  dict,
  testimonials,
}: {
  lang: Locale;
  dict: Dictionary;
  testimonials: Testimonial[];
}) {
  const t = dict.testimonials;
  return (
    <section className="mx-auto w-full max-w-[1240px] px-5 py-12 md:px-8 md:py-20">
      <h2 className="font-display text-[2rem] font-bold leading-[1.1] tracking-tight md:text-6xl">
        {t.title}
      </h2>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.length > 0
          ? testimonials.map((item) => (
              <figure
                key={item.id}
                className="flex flex-col gap-4 rounded-[1.75rem] border border-line bg-white p-7 transition-transform duration-300 hover:-translate-y-2 md:p-8"
              >
                <blockquote className="text-base leading-7 md:text-lg">“{item.quote[lang]}”</blockquote>
                <figcaption className="mt-auto text-sm font-semibold text-muted">
                  {[item.name, item.area].filter(Boolean).join(", ")}
                </figcaption>
              </figure>
            ))
          : [0, 1, 2].map((i) => (
              <figure
                key={i}
                className="flex flex-col gap-4 rounded-[1.75rem] border border-line bg-white p-7 md:p-8"
              >
                <blockquote>
                  <PlaceholderTag>{t.quote}</PlaceholderTag>
                </blockquote>
                <figcaption className="text-sm text-muted">{t.who}</figcaption>
              </figure>
            ))}
      </div>
    </section>
  );
}
