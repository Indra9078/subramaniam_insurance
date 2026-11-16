"use client";

import { useId, useState } from "react";
import { PlaceholderTag } from "@/components/ui/PlaceholderTag";

export type FaqItem = { q: string; a: string; sample?: boolean };

/** Accordion of questions. Sample answers (not yet approved) glow as placeholders. */
export function FaqList({
  items,
  firstOpen = true,
}: {
  items: FaqItem[];
  firstOpen?: boolean;
}) {
  const [open, setOpen] = useState<number | null>(firstOpen ? 0 : null);
  const baseId = useId();

  return (
    <div className="flex flex-col gap-3.5">
      {items.map((item, i) => {
        const isOpen = open === i;
        const panelId = `${baseId}-${i}`;
        return (
          <div
            key={`${item.q}-${i}`}
            className="overflow-hidden rounded-[22px] border border-line bg-white"
          >
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex min-h-[68px] w-full items-center justify-between gap-4 px-6 py-3 text-left text-base font-semibold md:px-7 md:text-lg"
              >
                <span>{item.q}</span>
                <span
                  aria-hidden="true"
                  className={`flex size-9 shrink-0 items-center justify-center rounded-full bg-paper text-[22px] transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}
                >
                  +
                </span>
              </button>
            </h3>
            {isOpen && (
              <div id={panelId} className="px-6 pb-6 md:px-7">
                {item.sample ? (
                  <PlaceholderTag block>{item.a}</PlaceholderTag>
                ) : (
                  <p className="whitespace-pre-line text-base leading-7 text-muted">{item.a}</p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
