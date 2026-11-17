import { NextResponse, type NextRequest } from "next/server";
import { createSessionClient } from "@/lib/supabase/server";
import { safeNext } from "@/lib/validate";

/**
 * Landing page for the confirmation link in the sign-up email. Exchanges the one-time
 * code for a session, then sends the visitor to their account (or the page they came from).
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const next = safeNext(searchParams.get("next"), "/en/account");
  const code = searchParams.get("code");
  if (code) {
    const supabase = await createSessionClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(next, origin));
  }
  const lang = next.startsWith("/ta") ? "ta" : "en";
  return NextResponse.redirect(new URL(`/${lang}/account/login?error=link`, origin));
}
