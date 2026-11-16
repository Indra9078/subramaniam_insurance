import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["en", "ta"];
const defaultLocale = "en";

// Pick Tamil only when the browser asks for it first; otherwise English.
function getLocale(request: NextRequest): string {
  const header = request.headers.get("accept-language") ?? "";
  const first = header.split(",")[0]?.trim().toLowerCase() ?? "";
  return locales.find((l) => first === l || first.startsWith(`${l}-`)) ?? defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (hasLocale) return;

  request.nextUrl.pathname = `/${getLocale(request)}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  // Skip Next internals, API routes and any file with an extension (favicon, images).
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
