"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/listings", label: "Listings" },
  { href: "/admin/products", label: "Plans" },
  { href: "/admin/requests", label: "Requests" },
  { href: "/admin/testimonials", label: "Testimonials" },
  { href: "/admin/faqs", label: "FAQs" },
  { href: "/admin/leads", label: "Leads" },
];

export function AdminNav() {
  const pathname = usePathname() ?? "";
  return (
    <nav aria-label="Admin" className="mx-auto max-w-[1180px] overflow-x-auto px-2 md:px-4">
      <ul className="flex gap-1 pb-2">
        {links.map((l) => {
          const active = l.href === "/admin" ? pathname === "/admin" : pathname.startsWith(l.href);
          return (
            <li key={l.href}>
              <Link
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={clsx(
                  "inline-flex min-h-11 items-center whitespace-nowrap rounded-full px-4 text-sm font-semibold",
                  active ? "bg-white text-iris-900 shadow-sm" : "text-white/90 hover:bg-white/15",
                )}
              >
                {l.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
