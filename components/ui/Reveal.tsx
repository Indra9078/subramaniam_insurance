"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const SELECTOR = "main section, main article, main [data-reveal]";

/**
 * Fades sections and cards in as they scroll into view. Content is fully visible
 * without JavaScript and for reduced motion (see .reveal-ready in globals.css).
 * Elements already on screen are never hidden, so nothing flickers, and elements
 * that appear later (content streamed in behind a loading boundary, or a new route)
 * are picked up by a MutationObserver, so nothing can stay invisible.
 */
export function Reveal() {
  const pathname = usePathname();
  useEffect(() => {
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
    const seen = new WeakSet<Element>();
    const prime = (el: HTMLElement) => {
      if (seen.has(el) || el.classList.contains("is-visible")) return;
      seen.add(el);
      if (el.getBoundingClientRect().top < window.innerHeight * 0.95) el.classList.add("is-visible");
      else io.observe(el);
    };
    const scan = (root: ParentNode) => {
      if (root instanceof HTMLElement && root.matches(SELECTOR)) prime(root);
      root.querySelectorAll<HTMLElement>(SELECTOR).forEach(prime);
    };

    scan(document);
    document.documentElement.classList.add("reveal-ready");

    let queued = false;
    const pending = new Set<Node>();
    const mo = new MutationObserver((records) => {
      for (const r of records) r.addedNodes.forEach((n) => n.nodeType === 1 && pending.add(n));
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        pending.forEach((n) => n instanceof HTMLElement && scan(n));
        pending.clear();
      });
    });
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      mo.disconnect();
      io.disconnect();
    };
  }, [pathname]);
  return null;
}
