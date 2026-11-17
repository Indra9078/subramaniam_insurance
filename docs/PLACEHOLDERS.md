# Placeholders to replace before launch

Everything below still shows a glowing purple tag (or sample content) on the site.
Nothing on this list may go live. Last checked: Stage 9 batch 1 (2026-11-17).

How to find them on a page: every placeholder carries `data-placeholder`. In the browser
console, `document.querySelectorAll('[data-placeholder]').length` should be `0` on every page before launch.

## From the client (details)

| # | Item | Where it appears | How to replace |
|---|---|---|---|
| 1 | IRDAI registration number | Footer (every page), About → Registration | Code: `components/layout/Footer.tsx`, dictionaries `about.irdaiPh` |
| 2 | IRDAI registration expiry date | About → Registration | Dictionaries `about.expiryPh` |
| 3 | Certificates and awards | About → Registration | Dictionaries `about.certificatesPh` |
| 4 | Portrait photo | About (top) | Add photo to `public/`, update `app/[lang]/about/page.tsx` |
| 5 | Short personal story | Home → Why people trust me; About → My story | Dictionaries `why.story`, `about.story` |
| 6 | Real numbers: years of experience, families served, claims assisted | Home hero (top); About | `components/home/Hero.tsx`, `app/[lang]/about/page.tsx` (only real, verifiable numbers) |
| 7 | Office address and map link | Home and Contact page contact section; Contact → Visit card | Dictionaries `contact.address` |
| 8 | Map | Contact page | `app/[lang]/contact/page.tsx` (embed or link) |
| 9 | Working days and hours | Contact section; assistant → Talk to Mr. Subramaniam | Dictionaries `contact.hoursPh` |
| 10 | Product details to confirm | Home → Insurance card | Dictionaries `services.confirm` (remove tag once confirmed) |
| 11 | Property types and areas covered | Home → Real estate card; Real estate page header | Dictionaries `services.propConfirm`, `realEstate.areasPh` |
| 12 | Which insurer for vehicle cover, and whether corporate / group cover is sold | Vehicle and Corporate product pages; assistant | `lib/products.ts` (`confirmed: true`) |
| 13 | Confirm "United Vehicle Insurance" means United India Insurance, and the exact insurer names on the globe | Home hero orbit, marquee, About, plan pages | `components/hero/OrbitHero.tsx`, `lib/site.ts`, `lib/products.ts` |
| 14 | Insurer logos (only with written permission) | Home hero, insurer band | Currently text names |

## From the client (approvals)

| # | Item | Where it appears | How to replace |
|---|---|---|---|
| 15 | FAQ answers (19 samples) | Home, About, Contact, Insurance, category and plan pages, Real estate, listings, assistant | Admin → FAQs: edit and save each (saving marks it real) or delete |
| 16 | Claims help steps (draft) | Assistant → Claims help | Dictionaries `assistant.claims` (remove the glow in `AssistantPanel.tsx` once approved) |
| 17 | Privacy policy and terms (draft) + "last updated" date | /privacy, /terms | Dictionaries `legal.*`; approval by client or lawyer |
| 18 | Testimonials (real, with written permission) | Home → What clients say | Admin → Testimonials |
| 19 | Star Health and LIC marketing approval | Whole site | Written confirmation before launch |
| 20 | Tamil text review by a native speaker | Every page | `docs/tamil-review.csv` (or the Google Sheet) |

## Sample content

| # | Item | Where it appears | How to replace |
|---|---|---|---|
| 21 | 6 sample listings (prices `[00,00,000]`) | Home featured, Real estate, listing pages, assistant | Admin → Listings: edit and save (marks real) or delete |
| 21b | 8 sample insurance plans (glow with a "Sample" tag) | Insurance page, plan pages | Admin → Plans: edit and save (marks real) or delete. Built-in fallback samples show only until the database file is run |
| 21c | Six praise placeholders | About | Admin → Testimonials (real quotes with written permission) |
| 21d | Hero backdrop is an illustration | Home and page headers | Replace `public/images/hero-bg.jpg` and `hero-bg-small.jpg` with a real photo if wanted |

## Branding and launch settings (launch stage)

| # | Item | Notes |
|---|---|---|
| 22 | Logo | Temporary "AS" monogram icons in `app/icon.png`, `app/apple-icon.png`, `app/favicon.ico`, `public/icons/`. Concepts in `design/logo/` |
| 23 | Domain | Set `NEXT_PUBLIC_SITE_URL` in Vercel |
| 24 | Search engines | Set `SITE_INDEXING=on` in Vercel at launch (until then every page is noindex) |
| 25 | Resend sender domain | Alerts come from onboarding@resend.dev until the domain is verified |
