import clsx from "clsx";
import type { ReactNode } from "react";

/**
 * Marks content the client still has to supply (numbers, registration IDs,
 * testimonials, photos). It glows so nothing placeholder is missed before launch.
 * Use tone="dark" on dark backgrounds.
 */
export function PlaceholderTag({
  children,
  tone = "light",
  className,
}: {
  children: ReactNode;
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <span
      data-placeholder
      className={clsx(tone === "dark" ? "tag-glow-dark" : "tag-glow", className)}
    >
      {children}
    </span>
  );
}
