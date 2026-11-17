import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "../dictionaries";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { ProfileForm } from "@/components/account/ProfileForm";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/layout/PageHeader";
import { requireUser, getProfile } from "@/lib/account/auth";
import { deleteMyListing, signOutUser } from "./actions";

export async function generateMetadata({ params }: PageProps<"/[lang]/account">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const d = await getDictionary(lang);
  return { title: d.nav.account, robots: { index: false, follow: false } };
}

const chip: Record<string, string> = {
  new: "bg-iris-100 text-[#3f2fb0]", contacted: "bg-[#fff3cf] text-[#7a5a00]", in_progress: "bg-[#ffe9df] text-[#BA3C0F]",
  completed: "bg-[#e1f4e8] text-[#1f7a46]", closed: "bg-[#ecebef] text-muted",
  pending: "bg-[#fff3cf] text-[#7a5a00]", published: "bg-[#e1f4e8] text-[#1f7a46]", rejected: "bg-[#ffe3e0] text-[#a02318]",
  sold: "bg-[#ecebef] text-muted", draft: "bg-[#ecebef] text-muted",
};
const Chip = ({ kind, children }: { kind: string; children: React.ReactNode }) => (
  <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${chip[kind] ?? chip.draft}`}>{children}</span>
);

async function Dashboard({ params }: Pick<PageProps<"/[lang]/account">, "params">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const a = dict.account;
  const user = await requireUser(lang, `/${lang}/account`);
  const profile = await getProfile(user);
  const [reqs, lists] = await Promise.all([
    user.supabase
      .from("insurance_requests")
      .select("id, product_name, insurer, status, advisor_note, created_at, plan:insurance_products(slug)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
    user.supabase
      .from("listings")
      .select("id, slug, status, type, title_en, title_ta, location_en, location_ta, review_note, listing_photos(count)")
      .eq("owner_id", user.id)
      .order("created_at", { ascending: false }),
  ]);
  const when = (iso: string) => new Date(iso).toLocaleDateString(lang === "ta" ? "ta-IN" : "en-IN", { dateStyle: "medium", timeZone: "Asia/Kolkata" });
  const first = (profile.full_name || user.email.split("@")[0]).split(" ")[0];

  return (
    <>
      <main id="main" className="flex flex-1 flex-col">
        <PageHeader lang={lang} dict={dict} crumbs={[{ label: dict.nav.account }]} eyebrow={dict.nav.account} title={fillName(a.hello, first)}>
          <form action={signOutUser.bind(null, lang)}>
            <button type="submit" className="inline-flex min-h-11 items-center rounded-full border border-iris-200/50 px-5 text-sm font-semibold text-iris-50 hover:bg-white/10">
              {a.logout}
            </button>
          </form>
        </PageHeader>

        <div className="mx-auto flex w-full max-w-[1000px] flex-col gap-10 px-5 py-12 md:px-8 md:py-16">
          <section className="flex flex-col gap-5 rounded-[1.75rem] border border-line bg-white p-6 md:p-8">
            <h2 className="font-display text-2xl font-bold">{a.detailsTitle}</h2>
            <ProfileForm lang={lang} dict={dict} name={profile.full_name} phone={profile.phone} email={profile.email || user.email} />
          </section>

          <section className="flex flex-col gap-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-display text-2xl font-bold">{a.requestsTitle}</h2>
              <Link href={`/${lang}/insurance#plans`} className="inline-flex min-h-11 items-center rounded-full border border-line bg-white px-5 text-sm font-semibold hover:border-ink">{a.browse}</Link>
            </div>
            {reqs.error ? (
              <p className="rounded-[1.25rem] border border-dashed border-line bg-white p-6 text-muted">{a.errors.generic}</p>
            ) : reqs.data.length === 0 ? (
              <p className="rounded-[1.25rem] border border-dashed border-line bg-white p-6 text-muted">{a.noRequests}</p>
            ) : (
              <ul className="flex flex-col gap-3">
                {reqs.data.map((r) => {
                  const plan = r.plan as { slug: string } | { slug: string }[] | null;
                  const slug = Array.isArray(plan) ? plan[0]?.slug : plan?.slug;
                  return (
                    <li key={r.id} className="flex flex-col gap-2 rounded-[1.25rem] border border-line bg-white p-5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-semibold">
                          {slug ? <Link href={`/${lang}/insurance/plans/${slug}`} className="underline-offset-4 hover:underline">{r.product_name}</Link> : r.product_name}
                          {r.insurer && <span className="ml-2 text-sm font-normal text-muted">{r.insurer}</span>}
                        </span>
                        <Chip kind={r.status}>{a.requestStatus[r.status as keyof typeof a.requestStatus] ?? r.status}</Chip>
                      </div>
                      <p className="text-sm text-muted">{a.requested}: {when(r.created_at)}</p>
                      {r.advisor_note && (
                        <p className="rounded-[12px] bg-iris-50 p-3 text-sm"><strong>{a.advisorNote}:</strong> {r.advisor_note}</p>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          <section className="flex flex-col gap-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-display text-2xl font-bold">{a.listingsTitle}</h2>
              <Link href={`/${lang}/account/listings/new`} className="btn-sheen inline-flex min-h-12 items-center rounded-full px-6 font-semibold text-white">+ {a.list}</Link>
            </div>
            {lists.error ? (
              <p className="rounded-[1.25rem] border border-dashed border-line bg-white p-6 text-muted">{a.errors.generic}</p>
            ) : lists.data.length === 0 ? (
              <p className="rounded-[1.25rem] border border-dashed border-line bg-white p-6 text-muted">{a.noListings}</p>
            ) : (
              <ul className="flex flex-col gap-3">
                {lists.data.map((l) => {
                  const title = (lang === "ta" ? l.title_ta || l.title_en : l.title_en || l.title_ta) || "—";
                  const place = lang === "ta" ? l.location_ta || l.location_en : l.location_en || l.location_ta;
                  const photos = (l.listing_photos as { count: number }[])[0]?.count ?? 0;
                  const editable = l.status === "pending" || l.status === "rejected";
                  return (
                    <li key={l.id} className="flex flex-col gap-3 rounded-[1.25rem] border border-line bg-white p-5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-semibold">{title}</span>
                        <Chip kind={l.status}>{a.listingStatus[l.status as keyof typeof a.listingStatus] ?? l.status}</Chip>
                      </div>
                      <p className="text-sm text-muted">{[dict.realEstate.types[l.type as keyof typeof dict.realEstate.types], place, `${photos} ${a.photos}`].filter(Boolean).join(" · ")}</p>
                      {l.review_note && <p className="rounded-[12px] bg-[#ffe3e0] p-3 text-sm"><strong>{a.reviewNote}:</strong> {l.review_note}</p>}
                      <div className="flex flex-wrap items-center gap-2">
                        {editable && (
                          <Link href={`/${lang}/account/listings/${l.id}`} className="inline-flex min-h-11 items-center rounded-full bg-ink px-5 text-sm font-semibold text-white">{a.edit}</Link>
                        )}
                        {(l.status === "published" || l.status === "sold") && (
                          <>
                            <Link href={`/${lang}/real-estate/${l.slug}`} className="inline-flex min-h-11 items-center rounded-full border border-line px-5 text-sm font-semibold hover:border-ink">{a.view}</Link>
                            <span className="text-xs text-muted">{a.lockedNote}</span>
                          </>
                        )}
                        {editable && <ConfirmButton action={deleteMyListing.bind(null, lang, l.id)} label={a.remove} message={a.confirmRemove} />}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>
      </main>
      <Footer lang={lang} dict={dict} />
    </>
  );
}

const fillName = (t: string, name: string) => t.replace("{name}", name);

export default function AccountPage(props: PageProps<"/[lang]/account">) {
  return (
    <Suspense fallback={<main id="main" className="flex flex-1 items-center justify-center p-10 text-muted">…</main>}>
      <Dashboard params={props.params} />
    </Suspense>
  );
}
