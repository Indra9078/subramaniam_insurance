import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "../../../dictionaries";
import { UserListingForm } from "@/components/account/UserListingForm";
import { UserPhotos } from "@/components/account/UserPhotos";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/layout/PageHeader";
import { requireUser } from "@/lib/account/auth";
import { photoUrl } from "@/lib/supabase/env";
import { isUuid } from "@/lib/validate";

export const metadata: Metadata = { robots: { index: false, follow: false } };

async function EditListing({ params, searchParams }: PageProps<"/[lang]/account/listings/[id]">) {
  const { lang, id } = await params;
  if (!hasLocale(lang) || !isUuid(id)) notFound();
  const sp = await searchParams;
  const dict = await getDictionary(lang);
  const user = await requireUser(lang, `/${lang}/account/listings/${id}`);
  const { data } = await user.supabase.from("listings").select("*, listing_photos(id, path, sort)").eq("id", id).eq("owner_id", user.id).maybeSingle();
  if (!data) notFound();
  const f = dict.listingForm;
  const pick = (k: string) => String((lang === "ta" ? data[`${k}_ta`] || data[`${k}_en`] : data[`${k}_en`] || data[`${k}_ta`]) ?? "");
  const features: string[] = (lang === "ta" ? data.features_ta : data.features_en)?.length ? (lang === "ta" ? data.features_ta : data.features_en) : (data.features_en?.length ? data.features_en : data.features_ta) ?? [];
  const photos = [...(data.listing_photos as { id: string; path: string; sort: number }[])].sort((a, b) => a.sort - b.sort).map((p) => ({ id: p.id, url: photoUrl(p.path) }));
  const editable = data.status === "pending" || data.status === "rejected";

  return (
    <>
      <main id="main" className="flex flex-1 flex-col">
        <PageHeader
          lang={lang}
          dict={dict}
          crumbs={[{ href: `/${lang}/account`, label: dict.nav.account }, { label: f.editTitle }]}
          eyebrow={dict.account.listingStatus[data.status as keyof typeof dict.account.listingStatus] ?? data.status}
          title={pick("title") || f.editTitle}
        />
        <div className="mx-auto flex w-full max-w-[760px] flex-col gap-8 px-5 py-12 md:px-8 md:py-16">
          {(sp.created || sp.saved) && (
            <p role="status" className="rounded-[12px] bg-[#e1f4e8] p-4 text-sm font-semibold text-[#1f7a46]">{sp.created ? f.created : dict.account.saved}</p>
          )}
          {data.review_note && (
            <p className="rounded-[12px] bg-[#ffe3e0] p-4 text-sm"><strong>{dict.account.reviewNote}:</strong> {data.review_note}</p>
          )}
          {editable ? (
            <>
              <UserPhotos listingId={id} photos={photos} dict={dict} />
              <div className="rounded-[1.75rem] border border-line bg-white p-6 md:p-9">
                <UserListingForm
                  lang={lang}
                  dict={dict}
                  listing={{ id, type: data.type, title: pick("title"), location: pick("location"), price: pick("price"), size: pick("size"), description: pick("description"), features }}
                />
              </div>
            </>
          ) : (
            <p className="rounded-[1.25rem] border border-line bg-white p-6 text-muted">{dict.account.lockedNote}</p>
          )}
          <Link href={`/${lang}/account`} className="inline-flex min-h-11 items-center font-semibold text-ember underline-offset-4 hover:underline">← {f.back}</Link>
        </div>
      </main>
      <Footer lang={lang} dict={dict} />
    </>
  );
}

export default function EditListingPage(props: PageProps<"/[lang]/account/listings/[id]">) {
  return (
    <Suspense fallback={<main id="main" className="flex flex-1 items-center justify-center p-10 text-muted">…</main>}>
      <EditListing {...props} />
    </Suspense>
  );
}
