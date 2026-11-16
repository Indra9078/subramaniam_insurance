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
- Not yet built: `/privacy` and `/terms` pages linked in the footer (Stage 4).

## Open items and risks
- Tamil text is my translation. A native speaker must review it before launch.
- Logo badges are plain text. Real logos need permission from LIC, Star Health, IFFCO-Tokio and HDFC.
- HDFC was not in the client form. Confirm which HDFC product he sells, or remove it.
- Client details still missing (see "Information still needed" in PLAN.md). All such content is shown as glowing placeholders.
- Star Health and LIC marketing approval must be confirmed in writing before launch.
- The chatbot needs a separate pay-per-use Claude API key (not covered by Claude Pro).

## Links
- Plan sheet: https://claude.ai/artifact/9mJ7HSBqCNtZyZCcJFsRDJ
- Home page design canvas: https://claude.ai/artifact/N38mQMDiY7wQEcRG1tyHTf
- Repo: https://github.com/Indra9078/subramaniam_insurance
