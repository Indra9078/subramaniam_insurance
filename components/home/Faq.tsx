"use client";

import { useState } from "react";
import { PlaceholderTag } from "@/components/ui/PlaceholderTag";

type FaqProps = {
  title: string;
  answer: string;
  items: string[];
};

/** Accordion. Answers are placeholders until the client supplies his real FAQs. */
export function Faq({ title, answer, items }: FaqProps) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="mx-auto w-full max-w-[960px] scroll-mt-4 px-5 py-12 md:px-8 md:py-20"
    >
      <h2 className="font-display text-[2rem] font-bold leading-[1.1] tracking-tight md:text-6xl">
        {title}
      </h2>
      <div className="mt-8 flex flex-col gap-3.5 md:mt-9">
        {items.map((q, i) => {
          const isOpen = open === i;
          return (
            <div
              key={q}
              className="overflow-hidden rounded-[22px] border border-line bg-white"
            >
              <h3>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`faq-${i}`}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex min-h-[68px] w-full items-center justify-between gap-4 px-6 py-3 text-left text-base font-semibold md:px-7 md:text-lg"
                >
                  <span>{q}</span>
                  <span
                    aria-hidden="true"
                    className={`flex size-9 shrink-0 items-center justify-center rounded-full bg-paper text-[22px] transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}
                  >
                    +
                  </span>
                </button>
              </h3>
              {isOpen && (
                <div id={`faq-${i}`} className="px-6 pb-6 md:px-7">
                  <PlaceholderTag>{answer}</PlaceholderTag>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
