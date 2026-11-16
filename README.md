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
- `components/ui` Button, PlaceholderTag, Marquee. `components/layout` Navbar, Footer, LanguageToggle. `components/hero` OrbitHero.

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

1. Design direction (done) 2. Setup and design system (this) 3. Home page 4. Inner pages
5. Admin page 6. Lead capture 7. Chatbot 8. Polish 9. Launch 10. Blog and reels (optional)
