"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const SELECTOR = "main section, main article, main [data-reveal]";

/**
 * Fades sections and cards in as they scroll into view. Content is fully visible
 * without JavaScript and for reduced motion (see .reveal-ready in globals.css).
 * Elements already on screen are never hidden, so nothing flickers.
 */
export function Reveal() {
  const pathname = usePathname();
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(SELECTOR));
    const vh = window.innerHeight;
    for (const el of els) {
      if (el.getBoundingClientRect().top < vh * 0.95) el.classList.add("is-visible");
    }
    document.documentElement.classList.add("reveal-ready");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    els.filter((el) => !el.classList.contains("is-visible")).forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);
  return null;
}
