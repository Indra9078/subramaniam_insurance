# A. Subramaniam: insurance and property website

Next.js 16 (App Router) + TypeScript + Tailwind CSS 4. English and Tamil.

## Run locally

```bash
npm install
npm run dev      # http://localhost:3000  (redirects to /en or /ta)
npm run build    # production build
npm run lint
```

## Structure

- `app/[lang]/` pages and layout. `lang` is `en` or `ta`.
- `app/[lang]/dictionaries/en.json`, `ta.json` all site text. Add every new string to both files.
- `proxy.ts` sends `/` to `/en` or `/ta` based on the browser language.
- `app/globals.css` design tokens (colors, fonts, glow tags, button sheen).
- `app/orbit.css` orbiting-logo hero. Sized in container units, so it scales to phones.
- `components/insurance`, `components/account` plan cards and visitor account forms. `components/ui` Button, PlaceholderTag, Marquee, CtaBand, FaqList. `components/layout` Navbar, Footer, LanguageToggle, PageHeader. `components/hero` OrbitHero. `components/home` home sections. `components/realestate` ListingCard, ListingBrowser. `components/legal` LegalPage.
- `lib/site.ts` phone, WhatsApp and email (dummy until supplied). `lib/products.ts` product slugs and insurers. `lib/listings.ts` sample listings (replaced by Supabase in Stage 5). `lib/meta.ts` page metadata helper.

## Pages

`/[lang]` home, `/about`, `/insurance`, `/insurance/{health,life,vehicle,corporate}`, `/real-estate`, `/real-estate/[id]`, `/faq`, `/contact`, `/privacy`, `/terms`.

## Supabase (Stage 5)

1. Copy `.env.example` to `.env.local` and fill in the project URL and publishable key. Add the same two variables in Vercel.
2. In the Supabase SQL editor run `supabase/migrations/0001_admin.sql`, `0002_leads.sql`, `0003_assistant.sql` and `0004_products_accounts.sql`, then (optional) `supabase/seed.sql` and `supabase/seed_products.sql` for sample listings, FAQs and plans.
3. Create the admin user under Authentication, Users (auto confirm) and turn off public sign-ups. Admin emails live in the `admins` table.
4. Admin is at `/admin`. Public pages read through `lib/data.ts` (cached, refreshed with `updateTag` on every admin save).

## Lead emails (Stage 6)

Set `RESEND_API_KEY` in Vercel (server only, no `NEXT_PUBLIC_` prefix). Optional: `LEAD_ALERT_TO` (comma separated, default the client's email),
`LEAD_ALERT_FROM` (default `onboarding@resend.dev` until a domain is verified), `NEXT_PUBLIC_SITE_URL`, `LEAD_HASH_SALT`.

## Visitor accounts, plans and property submissions (Stage 9)

- Visitors sign up at `/en/account` or `/ta/account` (Supabase Auth, email and password). In Supabase turn ON "Allow new users to sign up", set the Site URL and add `<site>/auth/callback` to the Redirect URLs. Admin rights still come only from the `admins` table.
- Plans: Admin > Plans (table `insurance_products`, images in bucket `product-images`). Without the table the site shows the built-in samples from `lib/sample-products.ts`.
- Property submissions are created pending and need approval in Admin > Listings. Plan requests appear in Admin > Requests.
- Database rules are tested with a local Postgres stand-in (see PROGRESS.md for the list of checks).

## Guided assistant (Stage 7)

`components/assistant/`: launcher (in the footer), panel (menus, search, call-back form) and keyword search.
Data comes from `/api/assistant?lang=en|ta`. Usage counts go through the `log_assistant_event` database function and show on the admin dashboard.

## SEO and launch switches (Stage 8)

- `NEXT_PUBLIC_SITE_URL`: the public address (no trailing slash). Without it the Vercel production URL is used.
- `SITE_INDEXING=on`: lets search engines index the site. Leave it unset until launch; until then every page is noindex and robots.txt blocks crawling.
- Sitemap at `/sitemap.xml`, robots at `/robots.txt`, link preview images from `opengraph-image.tsx` files (`lib/og.tsx`).
- Fonts load through `next/font` (`lib/fonts.ts`). Accessibility checks: axe and Lighthouse (see PROGRESS.md).

## Placeholders

Anything the client still has to supply is wrapped in `<PlaceholderTag>`, which glows purple.
Before launch, search the code for `PlaceholderTag` (or `data-placeholder` in the page) and make sure none are left. The full list is in `docs/PLACEHOLDERS.md`; the Tamil review list is `docs/tamil-review.csv`.

## Logos

The insurer badges are plain text. Use official logo files only after the client has
permission from each company (LIC, Star Health, IFFCO-Tokio, HDFC).

## Deploy to Vercel (testing)

1. Push this repo to GitHub.
2. On vercel.com choose Add New, Project, import the repo. Framework is detected as Next.js.
3. Deploy. Every push to `main` redeploys; pull requests get preview URLs.
4. Later: add the client's paid domain under Project Settings, Domains.

## Stages

1. Design direction (done) 2. Setup and design system (done) 3. Home page (done) 4. Inner pages (done) 5. Admin page (done)
6. Lead capture (done) 7. Guided assistant (done) 8. Polish and SEO (done) 9. Update and iterate (in progress) 10. Security build-up 11. Launch 12. Blog and reels (optional)
