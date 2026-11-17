"use client";

import { useEffect } from "react";

/**
 * One shared tooltip for every chart on the page. Marks carry `data-tip`
 * (lines separated by a newline; the first line is the title). Works with mouse,
 * touch and keyboard focus. Renders nothing itself.
 */
export function ChartTips() {
  useEffect(() => {
    const tip = document.createElement("div");
    tip.setAttribute("role", "tooltip");
    tip.className =
      "pointer-events-none fixed z-[60] hidden max-w-[260px] rounded-[12px] bg-[#2a1208] px-3 py-2 text-xs leading-5 text-white shadow-[0_12px_30px_rgba(42,18,8,.35)]";
    document.body.appendChild(tip);

    const show = (el: HTMLElement, x: number, y: number) => {
      const lines = (el.dataset.tip ?? "").split("\n");
      tip.replaceChildren();
      lines.forEach((line, i) => {
        const div = document.createElement("div");
        div.textContent = line;
        if (i === 0) div.className = "font-semibold";
        tip.appendChild(div);
      });
      tip.classList.remove("hidden");
      const r = tip.getBoundingClientRect();
      tip.style.left = `${Math.min(Math.max(8, x - r.width / 2), window.innerWidth - r.width - 8)}px`;
      tip.style.top = `${y - r.height - 12 < 8 ? y + 18 : y - r.height - 12}px`;
    };
    const target = (e: Event) => (e.target as HTMLElement | null)?.closest?.("[data-tip]") as HTMLElement | null;
    const move = (e: PointerEvent) => {
      const el = target(e);
      if (el) show(el, e.clientX, e.clientY);
      else tip.classList.add("hidden");
    };
    const focus = (e: FocusEvent) => {
      const el = target(e);
      if (!el) return;
      const r = el.getBoundingClientRect();
      show(el, r.left + r.width / 2, r.top);
    };
    const hide = () => tip.classList.add("hidden");
    document.addEventListener("pointermove", move);
    document.addEventListener("pointerleave", hide);
    document.addEventListener("focusin", focus);
    document.addEventListener("focusout", hide);
    document.addEventListener("scroll", hide, true);
    return () => {
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", hide);
      document.removeEventListener("focusin", focus);
      document.removeEventListener("focusout", hide);
      document.removeEventListener("scroll", hide, true);
      tip.remove();
    };
  }, []);
  return null;
}
