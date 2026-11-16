# Plan: A. Subramaniam insurance and property website

Last updated: 2026-11-16

## Goal
A modern personal-brand website for A. Subramaniam (insurance and real estate) that turns visitors into enquiries.

- **Main goals:** calls for both insurance and property, leads through WhatsApp or forms, plus a chatbot.
- **Languages:** English and Tamil, with a toggle button.
- **Audience:** Tamil Nadu mostly, service across India.
- **Tone:** friendly and approachable.

## About the client (from the client form)
- Senior Sales Manager at Star Health Insurance, LIC agent, holds a vehicle insurance code.
- Works with LIC, Star Health Insurance and IFFCO-Tokio General Insurance (HDFC to be confirmed).
- Products: health, life, vehicle, corporate and group (to be confirmed).

## Working agreement
We build stage by stage. Before each stage starts, the stage details are shared and approved. Nothing is built ahead of approval.

## Design direction (decided)
Hybrid of the two reference styles:
- **Light editorial base:** pale grey background, big friendly headlines, orange accent, isometric tiles (from the Dribbble "AI Financial Intelligence Website" reference).
- **Soft purple dark sections:** not harsh black. Glowing orbs, glass cards, dashboard-style blocks (from the dark fintech references).
- **Motion:** floating tiles, drifting glow orbs, orbiting logos in the hero, scrolling insurer band, hover lifts, animated chat preview. All motion stops for visitors who prefer reduced motion.
- **Mobile first:** every page must work on a phone.
- **Placeholders:** any detail the client has not supplied is shown with a glowing purple tag so it is easy to find and replace. Nothing placeholder goes live.

Palette: paper `#F4F2EE`, ink `#1B1A1F`, ember (orange) `#C94312`, soft ember `#FF8A5B`, iris purples `#C9BFFF` to `#221C3D`.
Fonts: Space Grotesk (headings), Inter (body), Noto Sans Tamil (Tamil).

## Stack
| Layer | Choice |
|---|---|
| Build tool | Claude Code on Claude Pro, one approved stage at a time |
| Framework | Next.js 16 (App Router), TypeScript |
| Styling | Tailwind CSS 4, custom components |
| Languages | Locale routes `/en` and `/ta`, JSON dictionaries, `proxy.ts` redirect |
| Content | JSON/MDX for fixed pages; listings, testimonials, FAQs from the admin page |
| Database and auth | Supabase (Postgres, Auth, Storage), from Stage 5 |
| Forms and email | Server actions, Supabase table, Resend email alerts |
| Chatbot | Guided assistant built in (no AI, no running cost). Claude API can be added later with a pay-per-use key |
| Hosting | GitHub repo, Vercel for testing, paid domain later |
| Extras | WhatsApp click-to-chat, Google Analytics, Google Business link, schema markup |

## Stages
| # | Stage | What gets built | Status |
|---|---|---|---|
| 1 | Discovery and design direction | Sitemap, content inventory, design direction, language plan, lead and chatbot flow | Done |
| 2 | Project setup and design system | Next.js project, tokens, fonts, EN/TA toggle, mobile-first layout, shared components, orbiting-logo hero | Done |
| 3 | Home page | Hero, insurer band, services, how it works, why trust me, chatbot preview, featured properties, testimonials, FAQ, contact section. English and Tamil | Done |
| 4 | Inner pages | About, Insurance and 4 product pages, Real estate with listings and detail pages, FAQ, Contact, Privacy policy, Terms | Done |
| 5 | Admin page | Protected login. Add and edit property listings and photos, view and export leads, edit testimonials and FAQs | Done |
| 6 | Lead capture | Enquiry and quote forms per product, call-back request, WhatsApp, call buttons, Supabase, email alerts | Done |
| 7 | Chatbot | Guided assistant (no AI, free): English and Tamil menus, search, hands off to WhatsApp, call or form; anonymous usage counts | Done, awaiting your review |
| 8 | Polish | Animations, responsiveness, SEO, speed, accessibility, Tamil text review | Not started |
| 9 | Launch | Vercel deployment, domain, analytics, privacy policy and terms, handover note | Not started |
| 10 | Optional | Blog or resources, brand reel templates | Not started |

## Sitemap
Home, About, Insurance (Health, Life, Vehicle, Corporate and group), Real estate and listings, FAQ, Contact, Privacy policy, Terms, Admin (protected).

## Rules for content and compliance
- Show the IRDAI registration number on the site.
- Use only real, verifiable numbers (years, clients, claims). No invented testimonials; real quotes with written permission only.
- Insurer logos only with permission from each company. Until then, text names are used.
- Star Health and LIC may need to approve marketing material before publishing. Confirm in writing before launch.
- Footer line on every page: "Insurance is the subject matter of solicitation."
- Chatbot gives general guidance only. No quotes, no policy advice, always offers a call or WhatsApp hand-off.
- Forms include "I agree to be contacted" consent wording.
- Tamil text is reviewed by a native speaker before launch.

## Information still needed from the client
IRDAI registration numbers and expiry, years of experience and client numbers, short bio, products with details and quote fields, real estate details and listings, WhatsApp and call numbers, email, address, working hours, lead delivery method, logo and brand colours, portrait photos, testimonials with permission, certificates, about 10 FAQs, social links, blog decision, domain and analytics access, budget and launch date, insurer marketing approval, privacy policy and terms, consent wording, HDFC product confirmation.

## Links
- Plan sheet (stages, tech stack, client inputs): https://claude.ai/artifact/9mJ7HSBqCNtZyZCcJFsRDJ
- Home page design canvas: https://claude.ai/artifact/N38mQMDiY7wQEcRG1tyHTf
- Repo: https://github.com/Indra9078/subramaniam_insurance
