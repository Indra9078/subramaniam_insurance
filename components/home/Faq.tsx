import { FaqList } from "@/components/ui/FaqList";
import type { Faq as FaqRow } from "@/lib/types";
import type { Locale } from "@/app/[lang]/dictionaries";

type FaqProps = {
  lang: Locale;
  title: string;
  empty: string;
  faqs: FaqRow[];
};

/** Short FAQ on the home page (questions marked "show on home"), linking to the full page. */
export function Faq({ lang, title, empty, faqs }: FaqProps) {
  const items = faqs
    .filter((f) => f.showOnHome)
    .map((f) => ({ q: f.question[lang], a: f.answer[lang], sample: f.isSample }));
  return (
    <section
      id="faq"
      className="mx-auto w-full max-w-[960px] scroll-mt-4 px-5 py-12 md:px-8 md:py-20"
    >
      <h2 className="font-display text-[2rem] font-bold leading-[1.1] tracking-tight md:text-6xl">
        {title}
      </h2>
      <div className="mt-8 md:mt-9">
        {items.length > 0 ? (
          <FaqList items={items} />
        ) : (
          <p className="rounded-[22px] border border-dashed border-line bg-white p-6 text-muted">{empty}</p>
        )}
      </div>
    </section>
  );
}
