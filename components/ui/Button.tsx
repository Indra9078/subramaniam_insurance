import Link from "next/link";
import clsx from "clsx";
import type { ReactNode } from "react";

type Variant = "primary" | "light" | "dark" | "outline" | "outlineLight";

const variants: Record<Variant, string> = {
  primary: "btn-sheen text-white",
  light: "bg-white text-iris-900 hover:bg-iris-50",
  dark: "bg-ink text-white hover:bg-iris-900",
  outline: "border border-line bg-white text-ink hover:border-ink",
  outlineLight: "border border-iris-200/55 text-iris-50 hover:bg-white/10",
};

type ButtonProps = {
  href: string;
  variant?: Variant;
  children: ReactNode;
  className?: string;
};

export function Button({
  href,
  variant = "primary",
  children,
  className,
}: ButtonProps) {
  return (
    <Link
      href={href}
      className={clsx(
        "inline-flex min-h-12 items-center justify-center rounded-full px-7 text-base font-semibold transition-colors",
        variants[variant],
        className,
      )}
    >
      {children}
    </Link>
  );
}
