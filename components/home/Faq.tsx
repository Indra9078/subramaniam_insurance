import Link from "next/link";
import { FaqList } from "@/components/ui/FaqList";

type FaqProps = {
  lang: string;
  title: string;
  answer: string;
  items: string[];
  viewAll: string;
};

/** Short FAQ on the home page, linking to the full FAQ page. */
export function Faq({ lang, title, answer, items, viewAll }: FaqProps) {
  return (
    <section
      id="faq"
      className="mx-auto w-full max-w-[960px] scroll-mt-4 px-5 py-12 md:px-8 md:py-20"
    >
      <h2 className="font-display text-[2rem] font-bold leading-[1.1] tracking-tight md:text-6xl">
        {title}
      </h2>
      <div className="mt-8 md:mt-9">
        <FaqList items={items.map((q) => ({ q, a: answer }))} />
      </div>
      <Link
        href={`/${lang}/faq`}
        className="mt-6 inline-flex min-h-11 items-center font-semibold text-ember underline-offset-4 hover:underline"
      >
        {viewAll} →
      </Link>
    </section>
  );
}
