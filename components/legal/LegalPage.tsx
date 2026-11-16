import { PageHeader } from "@/components/layout/PageHeader";
import { Footer } from "@/components/layout/Footer";
import { PlaceholderTag } from "@/components/ui/PlaceholderTag";
import type { Dictionary } from "@/app/[lang]/dictionaries";

/** Shared layout for the privacy policy and terms. Text is a draft until approved. */
export function LegalPage({
  lang,
  dict,
  doc,
}: {
  lang: string;
  dict: Dictionary;
  doc: Dictionary["legal"]["privacy"];
}) {
  const l = dict.legal;
  return (
    <>
      <PageHeader
        lang={lang}
        dict={dict}
        crumbs={[{ label: doc.title }]}
        eyebrow={`${l.updated}: ${l.updatedPh}`}
        title={doc.title}
      />
      <main className="flex-1">
        <article className="mx-auto flex w-full max-w-[820px] flex-col gap-9 px-5 py-14 md:px-8 md:py-20">
          <PlaceholderTag block>{l.draftNote}</PlaceholderTag>
          {doc.sections.map((s, i) => (
            <section key={s.h} className="flex flex-col gap-3">
              <h2 className="font-display text-xl font-bold md:text-2xl">
                {i + 1}. {s.h}
              </h2>
              <p className="text-base leading-7 text-muted">{s.p}</p>
            </section>
          ))}
        </article>
      </main>
      <Footer lang={lang} nav={dict.nav} footer={dict.footer} />
    </>
  );
}
