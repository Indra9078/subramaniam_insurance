import { FaqList } from "@/components/ui/FaqList";
import { getFaqs } from "@/lib/data";
import { jsonLd } from "@/lib/meta";
import type { FaqCategory } from "@/lib/types";
import type { Locale } from "@/app/[lang]/dictionaries";

/**
 * Questions and answers for one topic, placed at the bottom of a page. Managed in
 * the admin under FAQs (pick the category). Renders nothing when the topic has no
 * questions, so pages never show an empty box.
 */
export async function PageFaq({
  lang,
  title,
  categories,
  limit = 8,
}: {
  lang: Locale;
  title: string;
  categories: FaqCategory[];
  limit?: number;
}) {
  const all = await getFaqs();
  const faqs = all.filter((f) => categories.includes(f.category)).slice(0, limit);
  if (!faqs.length) return null;
  const approved = faqs.filter((f) => !f.isSample);
  const ld = approved.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: approved.map((q) => ({
          "@type": "Question",
          name: q.question[lang],
          acceptedAnswer: { "@type": "Answer", text: q.answer[lang] },
        })),
      }
    : null;
  return (
    <section className="mx-auto w-full max-w-[960px] px-5 pb-14 md:px-8 md:pb-20">
      <h2 className="font-display text-[1.75rem] font-bold leading-[1.1] tracking-tight md:text-4xl">{title}</h2>
      <div className="mt-7">
        <FaqList items={faqs.map((q) => ({ q: q.question[lang], a: q.answer[lang], sample: q.isSample }))} firstOpen={false} />
      </div>
      {ld && <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(ld)} />}
    </section>
  );
}
