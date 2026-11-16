"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import clsx from "clsx";
import { LanguageToggle } from "./LanguageToggle";
import type { Dictionary } from "@/app/[lang]/dictionaries";

type NavbarProps = {
  lang: string;
  nav: Dictionary["nav"];
};

/** Dark navbar for use over the purple hero. Links collapse into a menu on phones. */
export function Navbar({ lang, nav }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname() ?? "";

  const links = [
    { href: `/${lang}/insurance`, label: nav.insurance },
    { href: `/${lang}/real-estate`, label: nav.realEstate },
    { href: `/${lang}/about`, label: nav.about },
    { href: `/${lang}/faq`, label: nav.faq },
    { href: `/${lang}/contact`, label: nav.contact },
  ];
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="relative z-20">
      <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-3 px-5 py-5 md:px-8">
        <Link
          href={`/${lang}`}
          className="font-display text-xl font-bold text-white md:text-[22px]"
        >
          A. Subramaniam
        </Link>

        <nav
          aria-label="Main"
          className="hidden gap-7 text-[15px] font-medium text-iris-100 lg:flex"
        >
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={isActive(l.href) ? "page" : undefined}
              className={clsx(
                "underline-offset-8 hover:text-white",
                isActive(l.href) && "text-white underline decoration-ember-soft decoration-2",
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 md:gap-3">
          <LanguageToggle lang={lang} label={nav.language} />
          <Link
            href={`/${lang}/contact`}
            className="btn-sheen hidden min-h-11 items-center rounded-full px-5 text-[15px] font-semibold text-white sm:inline-flex"
          >
            {nav.call}
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={nav.menu}
            className="flex size-11 items-center justify-center rounded-full border border-iris-200/45 bg-white/10 text-white lg:hidden"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              width="22"
              height="22"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-menu"
          aria-label="Mobile"
          className="mx-5 mb-2 flex flex-col gap-1 rounded-3xl border border-iris-200/30 bg-iris-950/95 p-3 backdrop-blur lg:hidden"
        >
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              aria-current={isActive(l.href) ? "page" : undefined}
              className={clsx(
                "flex min-h-12 items-center rounded-2xl px-4 text-base font-medium text-iris-50 hover:bg-white/10",
                isActive(l.href) && "bg-white/10",
              )}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href={`/${lang}/contact`}
            onClick={() => setOpen(false)}
            className="btn-sheen mt-1 flex min-h-12 items-center justify-center rounded-2xl px-4 text-base font-semibold text-white"
          >
            {nav.call}
          </Link>
        </nav>
      )}
    </header>
  );
}
