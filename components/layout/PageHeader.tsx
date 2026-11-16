import Link from "next/link";
import type { ReactNode } from "react";
import { Navbar } from "@/components/layout/Navbar";
import type { Dictionary } from "@/app/[lang]/dictionaries";

type Crumb = { href?: string; label: string };

/** Purple header band for inner pages: navbar, breadcrumb, eyebrow, title and intro. */
export function PageHeader({
  lang,
  dict,
  crumbs,
  eyebrow,
  title,
  sub,
  children,
}: {
  lang: string;
  dict: Dictionary;
  crumbs: Crumb[];
  eyebrow: string;
  title: string;
  sub?: string;
  children?: ReactNode;
}) {
  const trail: Crumb[] = [{ href: `/${lang}`, label: dict.common.home }, ...crumbs];
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-iris-900 via-iris-800 to-iris-950 text-iris-50">
      <div className="pointer-events-none absolute -left-32 -top-24 size-[460px] animate-drift rounded-full bg-[radial-gradient(circle,rgba(142,124,255,.5),transparent_65%)]" />
      <div className="pointer-events-none absolute -right-28 top-10 size-[420px] animate-drift rounded-full bg-[radial-gradient(circle,rgba(242,96,43,.28),transparent_65%)] [animation-direction:reverse] [animation-duration:18s]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,.12)_1px,transparent_1px)] [background-size:32px_32px] opacity-40" />

      <Navbar lang={lang} nav={dict.nav} />

      <div className="relative mx-auto flex max-w-[1240px] flex-col gap-5 px-5 pb-14 pt-4 md:px-8 md:pb-20 md:pt-8">
        <nav aria-label={dict.common.breadcrumb}>
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-iris-200">
            {trail.map((c, i) => {
              const last = i === trail.length - 1;
              return (
                <li key={`${c.label}-${i}`} className="flex items-center gap-2">
                  {c.href && !last ? (
                    <Link href={c.href} className="underline-offset-4 hover:text-white hover:underline">
                      {c.label}
                    </Link>
                  ) : (
                    <span aria-current={last ? "page" : undefined} className="text-iris-50">
                      {c.label}
                    </span>
                  )}
                  {!last && <span aria-hidden="true">/</span>}
                </li>
              );
            })}
          </ol>
        </nav>
        <p className="text-sm font-semibold uppercase tracking-wider text-ember-soft">
          {eyebrow}
        </p>
        <h1 className="max-w-4xl font-display text-[2.25rem] font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        {sub && (
          <p className="max-w-2xl text-base leading-7 text-iris-100/90 md:text-lg">{sub}</p>
        )}
        {children}
      </div>
    </div>
  );
}
