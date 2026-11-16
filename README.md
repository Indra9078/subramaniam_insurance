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
- `components/ui` Button, PlaceholderTag, Marquee, CtaBand, FaqList. `components/layout` Navbar, Footer, LanguageToggle, PageHeader. `components/hero` OrbitHero. `components/home` home sections. `components/realestate` ListingCard, ListingBrowser. `components/legal` LegalPage.
- `lib/site.ts` phone, WhatsApp and email (dummy until supplied). `lib/products.ts` product slugs and insurers. `lib/listings.ts` sample listings (replaced by Supabase in Stage 5). `lib/meta.ts` page metadata helper.

## Pages

`/[lang]` home, `/about`, `/insurance`, `/insurance/{health,life,vehicle,corporate}`, `/real-estate`, `/real-estate/[id]`, `/faq`, `/contact`, `/privacy`, `/terms`.

## Supabase (Stage 5)

1. Copy `.env.example` to `.env.local` and fill in the project URL and publishable key. Add the same two variables in Vercel.
2. In the Supabase SQL editor run `supabase/migrations/0001_admin.sql`, then (optional) `supabase/seed.sql` for sample content.
3. Create the admin user under Authentication, Users (auto confirm) and turn off public sign-ups. Admin emails live in the `admins` table.
4. Admin is at `/admin`. Public pages read through `lib/data.ts` (cached, refreshed with `updateTag` on every admin save).

## Placeholders

Anything the client still has to supply is wrapped in `<PlaceholderTag>`, which glows purple.
Before launch, search the code for `PlaceholderTag` (or `data-placeholder` in the page) and make sure none are left.

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
6. Lead capture 7. Chatbot 8. Polish 9. Launch 10. Blog and reels (optional)
