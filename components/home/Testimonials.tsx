import { PlaceholderTag } from "@/components/ui/PlaceholderTag";
import type { Dictionary } from "@/app/[lang]/dictionaries";

/** Real quotes only, with written permission. Placeholders until supplied. */
export function Testimonials({ dict }: { dict: Dictionary }) {
  const t = dict.testimonials;
  return (
    <section className="mx-auto w-full max-w-[1240px] px-5 py-12 md:px-8 md:py-20">
      <h2 className="font-display text-[2rem] font-bold leading-[1.1] tracking-tight md:text-6xl">
        {t.title}
      </h2>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <figure
            key={i}
            className="flex flex-col gap-4 rounded-[1.75rem] border border-line bg-white p-7 transition-transform duration-300 hover:-translate-y-2 md:p-8"
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
