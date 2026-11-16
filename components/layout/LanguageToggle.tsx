"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const options = [
  { code: "en", label: "EN" },
  { code: "ta", label: "தமிழ்" },
] as const;

/** Switches between /en/... and /ta/... on the same page. */
export function LanguageToggle({
  lang,
  label,
  tone = "dark",
}: {
  lang: string;
  label: string;
  tone?: "dark" | "light";
}) {
  const pathname = usePathname() ?? `/${lang}`;
  const rest = pathname.replace(/^\/(en|ta)(?=\/|$)/, "");

  return (
    <div
      role="group"
      aria-label={label}
      className={clsx(
        "flex rounded-full border p-[3px]",
        tone === "dark"
          ? "border-iris-200/45 bg-white/10"
          : "border-line bg-white",
      )}
    >
      {options.map(({ code, label: text }) => {
        const active = code === lang;
        return (
          <Link
            key={code}
            href={`/${code}${rest}`}
            hrefLang={code}
            lang={code}
            aria-current={active ? "true" : undefined}
            className={clsx(
              "flex min-h-11 min-w-11 items-center justify-center rounded-full px-3.5 text-sm font-semibold transition-colors",
              active
                ? tone === "dark"
                  ? "bg-white text-iris-900"
                  : "bg-ink text-white"
                : tone === "dark"
                  ? "text-iris-50 hover:bg-white/10"
                  : "text-ink hover:bg-paper",
            )}
          >
            {text}
          </Link>
        );
      })}
    </div>
  );
}
