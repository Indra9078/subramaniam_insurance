import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "../../../dictionaries";
import { UserListingForm } from "@/components/account/UserListingForm";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/layout/PageHeader";
import { requireUser } from "@/lib/account/auth";

export async function generateMetadata({ params }: PageProps<"/[lang]/account/listings/new">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const d = await getDictionary(lang);
  return { title: d.listingForm.newTitle, robots: { index: false, follow: false } };
}

async function NewListing({ params }: Pick<PageProps<"/[lang]/account/listings/new">, "params">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  await requireUser(lang, `/${lang}/account/listings/new`);
  const f = dict.listingForm;
  return (
    <>
      <main id="main" className="flex flex-1 flex-col">
        <PageHeader
          lang={lang}
          dict={dict}
          crumbs={[{ href: `/${lang}/account`, label: dict.nav.account }, { label: f.newTitle }]}
          eyebrow={dict.nav.account}
          title={f.newTitle}
          sub={f.intro}
        />
        <div className="mx-auto w-full max-w-[760px] px-5 py-12 md:px-8 md:py-16">
          <div className="rounded-[1.75rem] border border-line bg-white p-6 md:p-9">
            <UserListingForm lang={lang} dict={dict} />
          </div>
          <Link href={`/${lang}/account`} className="mt-6 inline-flex min-h-11 items-center font-semibold text-ember underline-offset-4 hover:underline">← {f.back}</Link>
        </div>
      </main>
      <Footer lang={lang} dict={dict} />
    </>
  );
}

export default function NewListingPage(props: PageProps<"/[lang]/account/listings/new">) {
  return (
    <Suspense fallback={<main id="main" className="flex flex-1 items-center justify-center p-10 text-muted">…</main>}>
      <NewListing params={props.params} />
    </Suspense>
  );
}
