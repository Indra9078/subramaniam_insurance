"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import type { AssistantDict } from "./AssistantPanel";
import { logAssistantEvent } from "@/app/[lang]/actions";

// The panel (and its data) only loads when a visitor opens the assistant.
const AssistantPanel = dynamic(() => import("./AssistantPanel").then((m) => m.AssistantPanel), {
  ssr: false,
});

const OPEN_KEY = "assistant-open";
export const OPEN_EVENT = "open-assistant";

/** Floating "Need help?" button and the guided assistant panel. */
export function AssistantLauncher(props: {
  lang: "en" | "ta";
  d: AssistantDict;
  phoneHref: string;
  whatsappBase: string;
  siteUrl: string;
}) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const show = useCallback(() => {
    setOpen(true);
    void logAssistantEvent("open", undefined, undefined, props.lang);
  }, [props.lang]);

  // Re-open after moving between pages if it was open; listen for "Try the assistant" buttons.
  useEffect(() => {
    let reopen = false;
    try {
      reopen = sessionStorage.getItem(OPEN_KEY) === "1";
    } catch {}
    // After hydration, so the server and browser render the same closed state first.
    const t = reopen ? window.setTimeout(() => setOpen(true), 0) : undefined;
    window.addEventListener(OPEN_EVENT, show);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener(OPEN_EVENT, show);
    };
  }, [show]);

  useEffect(() => {
    try {
      sessionStorage.setItem(OPEN_KEY, open ? "1" : "0");
    } catch {}
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        // The button is hidden while the panel is open; focus it once it shows again.
        window.setTimeout(() => buttonRef.current?.focus(), 0);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const close = (navigating?: boolean) => {
    setOpen(false);
    if (!navigating) window.setTimeout(() => buttonRef.current?.focus(), 0);
  };

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={show}
        aria-expanded={open}
        aria-controls="assistant-panel"
        className={`fixed bottom-[84px] right-4 z-30 inline-flex min-h-12 items-center gap-2 rounded-full bg-iris-900 px-4 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(43,35,80,.35)] transition-transform hover:scale-105 md:bottom-24 md:right-6 ${open ? "invisible" : ""}`}
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12Z" />
        </svg>
        {props.d.a.open}
      </button>

      {open && (
        <div
          id="assistant-panel"
          role="dialog"
          aria-modal="false"
          aria-labelledby="assistant-title"
          className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-paper md:inset-auto md:bottom-6 md:right-6 md:h-[min(680px,calc(100vh-3rem))] md:w-[400px] md:rounded-[1.5rem] md:border md:border-line md:shadow-[0_30px_80px_rgba(27,26,31,.25)]"
        >
          <AssistantPanel {...props} onClose={close} headingRef={headingRef} />
        </div>
      )}
    </>
  );
}

/** Any "Try the assistant" button on the page. */
export function AssistantTrigger({ label, className }: { label: string; className?: string }) {
  return (
    <button type="button" onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))} className={className}>
      {label}
    </button>
  );
}
