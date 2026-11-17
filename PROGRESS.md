# Progress: what has been done so far

Last updated: 2026-11-16

## Stage 1: Discovery and design direction. Done
- Reviewed the client information form, the Dribbble reference ("AI Financial Intelligence Website"), 7 reference screenshots and a screen recording.
- Decided: hybrid design (light editorial base plus soft purple dark sections), friendly and approachable tone, English and Tamil with a toggle.
- Goals set: calls for insurance and property, leads through WhatsApp or forms, plus a chatbot.
- Added an Admin stage (Stage 5) and a Chatbot stage (Stage 7) to the plan.
- Built a plan spreadsheet with three tabs: Build Stages, Tech Stack, Client Inputs.
- Built an animated home page design on a design canvas, with a working English/Tamil toggle, orbiting logos, mobile layout and glowing placeholders.

## Stage 2: Project setup and design system. Done
- Next.js 16 project with TypeScript and Tailwind CSS 4.
- Design tokens: colours, fonts (Space Grotesk, Inter, Noto Sans Tamil), glowing placeholder tags, sheen button.
- Language routing: `/en` and `/ta`, JSON dictionaries, `proxy.ts` redirects by browser language, toggle keeps the same page.
- Components: Button, PlaceholderTag, Marquee, Navbar with mobile menu, Footer, LanguageToggle, OrbitHero.
- Orbiting logos: icon badges on an inner ring, insurer name badges (LIC, Star Health, IFFCO-Tokio, HDFC) on an outer ring turning the other way. Sized in container units so it scales to phones. Stops for reduced motion.
- Checks: lint clean, production build passes, `/en` and `/ta` serve correctly, desktop English and mobile Tamil screenshots reviewed.
- Pushed to GitHub: https://github.com/Indra9078/subramaniam_insurance

## Stage 3: Home page (done, 2026-11-16)
- Full home page at `/en` and `/ta`: hero with orbiting logos, insurer band, Insurance and Real estate cards plus call back, WhatsApp and chat tiles, how it works, "why people trust me" with animated chat preview, featured properties, testimonials, FAQ accordion, contact section, footer.
- Sections live in `components/home/`. Every missing detail (phone, address, hours, stats, story, listings, testimonials, FAQ answers, IRDAI number) is a glowing placeholder tag.
- The contact form is layout only. Sending is connected in Stage 6. The chat preview is an animation, the real chatbot is Stage 7.
- The old design-system preview moved to `/en/design` and `/ta/design`.
- Checks: lint clean, production build passes, both languages serve, desktop and mobile screenshots reviewed (English and Tamil).
- The `/privacy` and `/terms` pages were added in Stage 4.

## Stage 4: Inner pages (done, 2026-11-16)
- New pages, each in English and Tamil: `/about`, `/insurance`, `/insurance/health`, `/insurance/life`, `/insurance/vehicle`, `/insurance/corporate`, `/real-estate`, `/real-estate/[id]`, `/faq`, `/contact`, `/privacy`, `/terms`. All 52 inner page versions are prerendered at build time.
- Shared pieces: `PageHeader` (purple band with navbar and breadcrumb), `CtaBand` (call, WhatsApp, call back), `FaqList` (accordion, used on home, FAQ and product pages), `ListingCard` and `ListingBrowser` (type and location filters), `LegalPage`.
- The navbar and footer now link to the real pages and highlight the current one. The home page links to the full FAQ and to all listings.
- Data files: `lib/site.ts` (phone, WhatsApp, email, all dummy), `lib/products.ts` (which insurer offers which product), `lib/listings.ts` (6 sample listings with English and Tamil fields, the same shape planned for the Stage 5 Supabase table).
- Each page has its own title and description in both languages (`lib/meta.ts`, title template in the layout).
- Dummy details as agreed: phone `+91 00000 00000`, email `hello@example.com`, sample listings with `[00,00,000]` prices, draft FAQ answers, draft privacy and terms text. Every one of them is a glowing placeholder. `PlaceholderTag` has a new `block` option for whole sentences and paragraphs.
- Checks: lint clean, production build passes, all pages tested in `/en` and `/ta` at 1440px and 390px (no horizontal scroll, no console errors), listing filters, mobile menu and language toggle tested in the browser.

## Stage 5: Admin page (done, 2026-11-16)
- Supabase project connected (URL and publishable key in `.env.local` and Vercel). No service-role key is used anywhere.
- Database: `supabase/migrations/0001_admin.sql` creates `admins`, `listings`, `listing_photos`, `testimonials`, `faqs`, `leads`, row level security and the public `listing-photos` bucket (5 MB, JPEG/PNG/WebP). Visitors can only read published content. Only emails in `admins` can write or read leads. The database refuses to publish a testimonial without written permission and a date.
- `supabase/seed.sql` holds 6 sample listings and 19 draft FAQs, all marked `is_sample` (they glow as placeholders). Saving an item in the admin marks it real.
- Admin at `/admin` (English only, noindex): login, dashboard (warns while samples are live), listings with photo upload (resized in the browser, reorder, cover), testimonials, FAQs by category with "show on home", leads with status, notes and CSV export (formula-safe).
- Security: `proxy.ts` refreshes the session and sends logged-out visitors to the login page. Every admin page, server action and the CSV route checks the session and the admins list again on the server (`lib/admin/auth.ts`).
- Public site: listings, FAQs (home, FAQ page, product pages) and testimonials read from Supabase through cached functions (`lib/data.ts`). Admin saves call `updateTag`, so changes show at once. Empty tables show friendly "coming soon" messages. FAQ content moved out of the dictionaries into the database.
- Listing URLs are now `/real-estate/[slug]`.
- Client contact details are live: phone and WhatsApp +91 97879 20117, email subramaniam9757@gmail.com. Address and hours are still placeholders.
- Checks: lint clean, production build passes, admin redirects to login, wrong password message works, admin pages send `X-Robots-Tag: noindex`, public pages checked in `/en` and `/ta` at 1440px and 390px with an empty database. Visitors cannot read leads or admins (checked).
- End-to-end admin test passed (automated browser test against the live Supabase project, admin account indrajitksofficial@gmail.com, all test data removed afterwards): login, sample warning, draft listing hidden from the public, upload of 2 photos (2400x1800 shrunk to a 32 KB JPEG), reorder, publish and feature, listing shown on EN and TA pages, home and detail page, empty title rejected, FAQ create, edit and delete (home and Tamil FAQ page), testimonial refused without permission then published and removed, leads page and CSV export, listing delete removes its photo files, logout, admin and CSV blocked when logged out.
- Fixes from the test: admin forms keep what was typed when a save is refused (React 19 resets forms by default). Removed or unpublished listings show a friendly "no longer listed" page (noindex) instead of a cached 404 that did not refresh. Admin pages no longer log "Date.now() while prerendering" (`connection()` before the session client). Listing saves and photo changes also refresh the listing pages by path.
- Known behaviour: after a listing changes, the very first visitor to that listing's page can see the previous version once while Next rebuilds it in the background; the next visit is fresh.
- Admin accounts: subramaniam9757@gmail.com (client) and indrajitksofficial@gmail.com (owner). Change the owner password, since it was shared in the build chat.
- Write-blocking for anonymous visitors was not probed live (to avoid writing to the production database). It is enforced by the row level security in the migration.
- Local note: in this cloud sandbox, build and start need `NODE_USE_ENV_PROXY=1` so Node can reach Supabase through the proxy. Not needed on Vercel or a normal machine.

## Stage 6: Lead capture (done, 2026-11-16)
- `supabase/migrations/0002_leads.sql`: the `submit_lead()` database function is the only way visitors can add a lead. It validates name, Indian mobile number, email and consent, and allows 5 enquiries per hour per device (hashed IP, raw IP never stored) and 3 per hour per phone number. New columns: product, listing, answers (`details`), consent version and time.
- Forms (`components/forms/LeadForm.tsx`, English and Tamil): call back (home and contact page), insurance enquiry on each product page with the agreed fields (health, life, vehicle, corporate), property enquiry on each listing. Consent wording links to the privacy policy. A hidden trap field and a 3-second timing check stop bots (they see a thank-you, nothing is saved). Fields are kept when a submission is refused. The thank-you message names the chosen call time and offers WhatsApp.
- Email alert to subramaniam9757@gmail.com through Resend, sent after the visitor gets the reply (`after()`), with tap-to-call and WhatsApp buttons and a link to the admin. The lead is always saved first; a failed email is only logged.
- WhatsApp: a typed-in message for each page (general, product, listing with link). Phone action bar (Call, WhatsApp, Enquire) on every public page on phones, floating WhatsApp button on larger screens. Footer shows phone and email.
- Admin leads: product, property, answers, WhatsApp button, delete button. CSV includes the new columns.
- Privacy policy names Supabase and Resend and says leads are kept only as long as needed (the owner deletes them by hand).
- Checks: lint clean, build passes. End-to-end browser test against the live database: invalid phone and missing consent refused with input kept, English call back, Tamil vehicle form, property form, honeypot and fast bots not saved, 4th enquiry from one phone blocked, WhatsApp texts per page, action bar on phones and floating button on desktop, leads and answers in the admin and CSV, delete works. One real alert email accepted by Resend. All test leads deleted. No horizontal scroll on the changed pages at 390px and 1440px in English and Tamil.
- Vercel needs `RESEND_API_KEY` (set by the owner). Optional: `NEXT_PUBLIC_SITE_URL` (links in WhatsApp messages and emails; otherwise Vercel's production URL), `LEAD_ALERT_TO`, `LEAD_ALERT_FROM`, `LEAD_HASH_SALT`.

## Stage 7: Guided assistant (done, 2026-11-16)
- Decision: no AI for now (cost and compliance). Built "Subramaniam's Helper", a free menu-driven assistant. The name stays in English; all menus and answers are in English or Tamil to match the page. It is built so AI can be added later without redoing the widget.
- Every public page: "Need help?" button (above the phone action bar on mobile, above the WhatsApp button on desktop). Full-screen panel on phones, side panel on desktop. Home "Try the assistant" button replaces the fake input in the chat preview.
- Paths: each insurance product (what it covers, who it is for, documents, real FAQs from the database, call back, full page), property (by type with counts, then by area, up to 3 cards with View and WhatsApp enquiry, sell or rent), claims help (general steps shown as a glowing draft until the client approves), talk to Mr. Subramaniam. Every answer offers Call, WhatsApp (topic typed in) and Request a call back (Stage 6 form inside the chat, lead saved with Source: Assistant).
- Keyword search over topics and FAQ questions in English, Tamil and Tanglish (word-start matching for Tamil endings; FAQ answers count half). No match shows the contact options.
- Content comes only from the dictionaries and the database through `/api/assistant` (cached). Sample listings and FAQs show as glowing placeholders, like the rest of the site. The panel's code and data load only when opened; the conversation is kept between pages (session storage).
- Accessibility: dialog with focus moved in on open and back to the button on close or Escape, newest answer focused, typing pause skipped for reduced motion, 44px+ tap targets.
- Usage counts (`supabase/migrations/0003_assistant.sql`): anonymous opens, topics, contact taps and searches; search text kept only when nothing matched, without digits. Admin dashboard shows "Assistant, last 30 days": opens, contact taps, top topics, searches with no answer. Privacy policy mentions the anonymous counts.
- Checks: lint clean, build passes, browser test of every path in English and Tamil on phone and desktop (search, back, start over, call back inside the chat, property cards, navigation, persistence, Escape focus, reduced motion, no horizontal scroll, no page errors), usage counts appear on the dashboard. Fixed during testing: Back flicker, Escape focus, a false search match, panel header scrolling away on phones. Test leads and test usage events deleted.

## Stage 8: Polish, speed, accessibility and SEO (done, 2026-11-17)
- SEO: every page has a canonical URL and English/Tamil/x-default alternates (`lib/meta.ts`), `sitemap.xml` (all pages in both languages plus real published listings), `robots.txt`, structured data (insurance agency and real-estate agent on every page; breadcrumbs; real listings; approved FAQs only, never samples). Uses `NEXT_PUBLIC_SITE_URL`, or the Vercel production URL until the domain exists.
- Hidden from search engines until launch: every page is noindex and robots.txt blocks crawling unless `SITE_INDEXING=on` (to be set in Stage 9). Lighthouse SEO shows 66 because of this; it returns to normal when switched on.
- Link previews: a branded 1200x630 image for every page type (`lib/og.tsx` + `opengraph-image.tsx` files). The image renderer cannot shape Tamil script, so preview images use the English title on both languages; the Tamil page's own title and description still show in Tamil in WhatsApp.
- Branded bilingual 404 page (`app/global-not-found.tsx` for unknown URLs, `app/[lang]/not-found.tsx`) and a friendly error page (`app/[lang]/error.tsx`). The old `/design` preview page and unused text keys are removed (en and ta both have 355 keys).
- Temporary "AS" monogram icons (favicon, app icon, phone home-screen icon, web manifest) until the logo is designed. Logo concepts kept in `design/logo/` for later.
- Security headers on every response: nosniff, referrer policy, no framing (X-Frame-Options and CSP frame-ancestors), permissions policy, HSTS.
- Accessibility: skip-to-content link (both languages), visible focus ring, all page content inside landmarks (main wraps headers and content; assistant in its own region), single h1 per page. Orange accent darkened from #C94312 to #BA3C0F so text passes 4.5:1 on every background. axe (WCAG 2.1 AA + best practice): 0 violations on 43 page views (20 pages x phone and desktop, assistant open, admin login).
- Speed: fonts moved to next/font (preloaded, size-matched fallback, only the weights used; Tamil font limited to Tamil characters and `display: optional`); orbit hero CSS only on the home page; glowing placeholder tags animate opacity on a separate layer instead of repainting shadows. Layout shift is now 0 on every page tested (was 0.13 on /ta).
- Lighthouse (phone, simulated slow 4G), before → after, performance / accessibility / best practices: /en 90/96/100 → 89–91/100/100, /ta 85/96/100 → 83–89/100/100, /en/insurance/health 93/100/100 → 88–94/100/100, /en/real-estate 94 → 93, /ta/contact 90 → 88–91. Scores vary a few points between runs. In the observed browser run the main heading paints with the first paint (about 0.25 s locally); the simulated 3.3 s LCP comes from Lighthouse assuming the heading waits for all JavaScript on a slow connection.
- Scroll animations: sections and cards fade up as they enter the screen (`components/ui/Reveal.tsx`). Content already on screen is never hidden, nothing shifts, reduced motion shows everything, and without JavaScript everything is visible. Checked: no section left hidden after scrolling.
- Reports: `docs/tamil-review.csv` (467 strings with English source and columns for the reviewer) and `docs/PLACEHOLDERS.md` (25 items still to supply or approve, with where each appears and how to replace it). The Google Sheet version needs an empty sheet shared by the owner (no Google Drive connector in this session to create one).

## Open items and risks

- Tamil text is my translation. A native speaker must review it before launch.
- Logo badges are plain text. Real logos need permission from LIC, Star Health, IFFCO-Tokio and HDFC.
- HDFC was not in the client form. Confirm which HDFC product he sells, or remove it.
- Client details still missing (see "Information still needed" in PLAN.md). All such content is shown as glowing placeholders.
- Star Health and LIC marketing approval must be confirmed in writing before launch.
- Optional later: switch the assistant to AI (Claude Haiku 5.5 is the low-cost option, about $1 per 1,000 replies). Needs a pay-per-use Anthropic API key.
- Claims help steps in the assistant are a draft; the client must approve them.
- Product pages use general wording only, with a "subject to policy terms" note. Star Health and LIC should approve this wording before launch.
- Which insurer the vehicle code is with, and whether corporate and group cover is sold, are still to confirm (shown as placeholders on those pages).
- FAQ answers, privacy policy and terms are drafts. The client (or a lawyer for the legal text) must approve them.
- The new Tamil text (about 450 lines) needs the native-speaker review.
- Alerts come from onboarding@resend.dev until the client's domain is verified in Resend (Stage 9). Mark the first alert as 'Not spam'.
- Sample listings and FAQs from `supabase/seed.sql` are live and glow as placeholders. Replace them with real content from the admin before launch.
- Supabase free projects pause after about a week without activity. Upgrade or keep traffic flowing after launch.
- Confirm in the Supabase dashboard that "Allow new users to sign up" is off.
- An unknown product URL shows the branded 404 with status 200 (Next streams it); it is marked noindex.
- Logo still to be designed (after development). Temporary monogram icons are in place.
- Link preview images are English-only (Tamil shaping limitation of the image renderer).

## Links
- Plan sheet: https://claude.ai/artifact/9mJ7HSBqCNtZyZCcJFsRDJ
- Home page design canvas: https://claude.ai/artifact/N38mQMDiY7wQEcRG1tyHTf
- Repo: https://github.com/Indra9078/subramaniam_insurance
