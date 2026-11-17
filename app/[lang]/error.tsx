"use client";

import Link from "next/link";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

const t = {
  en: { title: "Sorry, something went wrong.", text: "Please try again. If it keeps happening, call or WhatsApp us.", retry: "Try again", home: "Go to home" },
  ta: { title: "மன்னிக்கவும், ஏதோ தவறு நடந்தது.", text: "மீண்டும் முயற்சிக்கவும். தொடர்ந்தால், அழைக்கவும் அல்லது வாட்ஸ்அப் செய்யவும்.", retry: "மீண்டும் முயற்சி", home: "முகப்புக்கு செல்ல" },
};

/** Friendly fallback when a page fails to render. */
export default function Error({ error, retry }: { error: unknown; retry: () => void }) {
  const lang = usePathname()?.startsWith("/ta") ? "ta" : "en";
  const c = t[lang];
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <main id="main" className="flex flex-1 items-center bg-paper">
      <div className="mx-auto flex w-full max-w-[720px] flex-col gap-5 px-5 py-20 md:px-8">
        <h1 className="font-display text-3xl font-bold md:text-5xl">{c.title}</h1>
        <p className="text-base text-muted md:text-lg">{c.text}</p>
        <p className="text-base">
          <a href="tel:+919787920117" className="font-semibold text-ember">+91 97879 20117</a>
          {" · "}
          <a href="https://wa.me/919787920117" className="font-semibold text-[#1f7a46]">WhatsApp</a>
        </p>
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={() => retry()} className="btn-sheen inline-flex min-h-12 items-center rounded-full px-6 font-semibold text-white">
            {c.retry}
          </button>
          <Link href={`/${lang}`} className="inline-flex min-h-12 items-center rounded-full border border-line bg-white px-6 font-semibold">
            {c.home}
          </Link>
        </div>
      </div>
    </main>
  );
}
