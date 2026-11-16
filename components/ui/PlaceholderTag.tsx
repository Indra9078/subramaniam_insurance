import clsx from "clsx";
import type { ReactNode } from "react";

/**
 * Marks content the client still has to supply (numbers, registration IDs,
 * testimonials, photos). It glows so nothing placeholder is missed before launch.
 * Use tone="dark" on dark backgrounds, and block for whole sentences or paragraphs.
 */
export function PlaceholderTag({
  children,
  tone = "light",
  block = false,
  className,
}: {
  children: ReactNode;
  tone?: "light" | "dark";
  block?: boolean;
  className?: string;
}) {
  const Tag = block ? "div" : "span";
  return (
    <Tag
      data-placeholder
      className={clsx(
        tone === "dark" ? "tag-glow-dark" : "tag-glow",
        block && "tag-glow-block",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
