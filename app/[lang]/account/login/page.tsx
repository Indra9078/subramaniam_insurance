import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import { getDictionary, hasLocale } from "../../dictionaries";
import { AuthForm } from "@/components/account/AuthForm";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/layout/PageHeader";
import { getCurrentUser } from "@/lib/account/auth";
import { supabaseConfigProblem } from "@/lib/supabase/env";
import { safeNext } from "@/lib/validate";

export async function generateMetadata({ params }: PageProps<"/[lang]/account/login">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const d = await getDictionary(lang);
  return { title: d.account.loginTitle, robots: { index: false, follow: false } };
}

async function LoginContent({ params, searchParams }: PageProps<"/[lang]/account/login">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const sp = await searchParams;
  const dict = await getDictionary(lang);
  const next = safeNext(typeof sp.next === "string" ? sp.next : null, `/${lang}/account`);
  if (!supabaseConfigProblem() && (await getCurrentUser())) redirect(next);

  return (
    <>
      <main id="main" className="flex flex-1 flex-col">
        <PageHeader lang={lang} dict={dict} crumbs={[{ label: dict.account.loginTitle }]} eyebrow={dict.nav.account} title={dict.account.loginTitle} sub={dict.account.loginSub} />
        <div className="mx-auto w-full max-w-[520px] px-5 py-12 md:py-16">
          <div className="rounded-[2rem] border border-line bg-white p-6 shadow-[0_30px_60px_rgba(43,35,80,.12)] md:p-9">
            <AuthForm lang={lang} next={next} dict={dict} initial={sp.mode === "signup" ? "signup" : "login"} linkError={sp.error === "link"} />
          </div>
        </div>
      </main>
      <Footer lang={lang} dict={dict} />
    </>
  );
}

export default function LoginPage(props: PageProps<"/[lang]/account/login">) {
  return (
    <Suspense fallback={<main id="main" className="flex flex-1 items-center justify-center p-10 text-muted">…</main>}>
      <LoginContent {...props} />
    </Suspense>
  );
}
