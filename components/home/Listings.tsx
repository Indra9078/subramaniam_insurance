import { PlaceholderTag } from "@/components/ui/PlaceholderTag";
import type { Dictionary } from "@/app/[lang]/dictionaries";

const covers = [
  "from-iris-100 to-[#ffe9df]",
  "from-iris-100 to-[#e7f5ec]",
  "from-iris-100 to-[#ffe0d2]",
];

/** Three placeholder cards. In Stage 5 these are filled from the admin page. */
export function Listings({ dict }: { dict: Dictionary }) {
  const l = dict.listings;
  return (
    <section className="mx-auto w-full max-w-[1240px] px-5 py-12 md:px-8 md:py-24">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 className="font-display text-[2rem] font-bold leading-[1.1] tracking-tight md:text-6xl">
          {l.title}
        </h2>
        <PlaceholderTag>{l.note}</PlaceholderTag>
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 md:mt-11">
        {covers.map((cover, i) => (
          <article
            key={i}
            className="overflow-hidden rounded-[1.75rem] border border-line bg-white transition-transform duration-300 hover:-translate-y-2"
          >
            <div
              className={`flex h-48 items-center justify-center bg-gradient-to-br md:h-52 ${cover}`}
            >
              <PlaceholderTag>{l.photo}</PlaceholderTag>
            </div>
            <div className="flex flex-col gap-2 p-6">
              <h3 className="font-display text-[22px] font-bold">{l.name}</h3>
              <p className="text-[15px] text-muted">
                <PlaceholderTag>{l.meta}</PlaceholderTag>
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
