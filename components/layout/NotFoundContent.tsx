import Link from "next/link";

/**
 * Bilingual "page not found" content. Not-found pages do not receive the page
 * language, so both languages are shown, each with its own links.
 */
const t = {
  en: { title: "Page not found", text: "This page may have moved or no longer exists.", home: "Home", insurance: "Insurance", property: "Real estate", contact: "Contact" },
  ta: { title: "பக்கம் கிடைக்கவில்லை", text: "இந்த பக்கம் நகர்த்தப்பட்டிருக்கலாம் அல்லது இப்போது இல்லை.", home: "முகப்பு", insurance: "காப்பீடு", property: "சொத்து", contact: "தொடர்பு" },
};

export function NotFoundContent() {
  return (
    <main id="main" className="relative flex flex-1 items-center overflow-hidden bg-gradient-to-br from-iris-900 via-iris-800 to-iris-950 text-iris-50">
      <div className="pointer-events-none absolute -right-24 -top-24 size-[420px] animate-drift rounded-full bg-[radial-gradient(circle,rgba(242,96,43,.3),transparent_65%)]" />
      <div className="relative mx-auto flex w-full max-w-[960px] flex-col gap-10 px-5 py-20 md:px-8">
        <p className="font-display text-7xl font-bold text-ember-soft md:text-8xl">404</p>
        {(["en", "ta"] as const).map((l, n) => {
          const Heading = n === 0 ? "h1" : "h2";
          return (
          <section key={l} lang={l} className="flex flex-col gap-4">
            <Heading className="font-display text-3xl font-bold text-white md:text-5xl">{t[l].title}</Heading>
            <p className="text-base text-iris-100 md:text-lg">{t[l].text}</p>
            <nav aria-label={t[l].title} className="flex flex-wrap gap-3">
              {[
                ["", t[l].home],
                ["/insurance", t[l].insurance],
                ["/real-estate", t[l].property],
                ["/contact", t[l].contact],
              ].map(([path, label], i) => (
                <Link
                  key={path}
                  href={`/${l}${path}`}
                  className={
                    i === 0
                      ? "btn-sheen inline-flex min-h-12 items-center rounded-full px-6 font-semibold text-white"
                      : "inline-flex min-h-12 items-center rounded-full border border-iris-200/50 px-5 font-semibold text-iris-50 hover:bg-white/10"
                  }
                >
                  {label}
                </Link>
              ))}
            </nav>
          </section>
          );
        })}
      </div>
    </main>
  );
}
