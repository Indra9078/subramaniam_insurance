"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import clsx from "clsx";
import { LeadForm, type LeadFormDict } from "@/components/forms/LeadForm";
import { PlaceholderTag } from "@/components/ui/PlaceholderTag";
import { logAssistantEvent } from "@/app/[lang]/actions";
import type { AssistantData } from "@/lib/assistant";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import { productSlugs, type ProductSlug } from "@/lib/products";
import { listingCovers, type ListingType } from "@/lib/types";
import { search, tokens, TOPIC_WORDS, type SearchEntry } from "./search";

/** The text the assistant needs (kept small so it is cheap to send to the browser). */
export type AssistantDict = {
  a: Dictionary["assistant"];
  products: Record<ProductSlug, { name: string; covers: string[]; suits: string[]; documents: string[] }>;
  insurers: Record<ProductSlug, { names: string[]; confirmed: boolean }>;
  types: Dictionary["realEstate"]["types"];
  hours: { label: string; ph: string };
  /** "To confirm" label for insurers the client has not confirmed yet. */
  confirm: string;
  form: LeadFormDict;
};

type Part = "covers" | "suits" | "documents";
type Node =
  | { k: "home" }
  | { k: "product"; p: ProductSlug }
  | { k: "info"; p: ProductSlug; part: Part }
  | { k: "faqs"; p: ProductSlug }
  | { k: "faq"; id: string }
  | { k: "callback"; ctx: ProductSlug | "property" | "general"; sell?: boolean }
  | { k: "property" }
  | { k: "ptype"; t: ListingType | "all" }
  | { k: "plist"; t: ListingType | "all"; area: string }
  | { k: "claims" }
  | { k: "talk" }
  | { k: "search"; q: string };

type Step = { id: number; user?: string; node: Node };
type Option = { label: string; go?: Node; href?: string; external?: boolean; secondary?: boolean; onClick?: () => void };

const STORE = "assistant-v1";
const isProduct = (v: string): v is ProductSlug => (productSlugs as readonly string[]).includes(v);
const fill = (t: string, v: Record<string, string>) => t.replace(/\{(\w+)\}/g, (_, k: string) => v[k] ?? "");
const slugKey = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 30);

function topicOf(n: Node): string {
  switch (n.k) {
    case "home": return "home";
    case "product": return n.p;
    case "info": return `${n.p}:${n.part}`;
    case "faqs": return `${n.p}:faqs`;
    case "faq": return "faq";
    case "callback": return n.sell ? "property:sell" : `callback:${n.ctx}`;
    case "property": return "property";
    case "ptype": return `property:${n.t}`;
    case "plist": return `property:${n.t}:${slugKey(n.area)}`;
    case "claims": return "claims";
    case "talk": return "talk";
    case "search": return "search";
  }
}

export function AssistantPanel({
  lang,
  d,
  phoneHref,
  whatsappBase,
  siteUrl,
  onClose,
  headingRef,
}: {
  lang: "en" | "ta";
  d: AssistantDict;
  phoneHref: string;
  whatsappBase: string;
  siteUrl: string;
  onClose: (navigating?: boolean) => void;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
}) {
  const a = d.a;
  const [data, setData] = useState<AssistantData | null>(null);
  const [steps, setSteps] = useState<Step[]>(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(STORE) ?? "null");
      if (Array.isArray(saved) && saved.length) return saved as Step[];
    } catch {}
    return [{ id: 1, node: { k: "home" } }];
  });
  const [shown, setShown] = useState(steps[steps.length - 1].id);
  const [query, setQuery] = useState("");
  const logRef = useRef<HTMLDivElement>(null);
  const lastRef = useRef<HTMLDivElement>(null);
  const last = steps[steps.length - 1];

  // Move focus into the panel when it opens.
  useEffect(() => {
    headingRef.current?.focus();
  }, [headingRef]);

  useEffect(() => {
    fetch(`/api/assistant?lang=${lang}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((j: AssistantData | null) => setData(j ?? { faqs: [], listings: [] }))
      .catch(() => setData({ faqs: [], listings: [] }));
  }, [lang]);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORE, JSON.stringify(steps.slice(-30)));
    } catch {}
  }, [steps]);

  // Short "typing" pause before each new answer (skipped for reduced motion).
  useEffect(() => {
    if (shown === last.id) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = window.setTimeout(() => setShown(last.id), reduce ? 0 : 450);
    return () => window.clearTimeout(t);
  }, [last.id, shown]);

  // Scroll to and focus the newest answer so keyboard and screen-reader users land on it.
  useEffect(() => {
    if (shown !== last.id || steps.length < 2) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Scroll only the message list (scrollIntoView would also move the panel itself).
    const log = logRef.current;
    const el = lastRef.current;
    if (log && el) log.scrollTo({ top: Math.max(0, el.offsetTop - 12), behavior: reduce ? "auto" : "smooth" });
    el?.focus({ preventScroll: true });
  }, [shown, last.id, steps.length]);

  const log = (event: string, topic?: string, q?: string) => {
    void logAssistantEvent(event, topic, q, lang);
  };

  const go = (node: Node, user?: string) => {
    setSteps((s) => [...s, { id: (s[s.length - 1]?.id ?? 0) + 1, user, node }]);
    log("topic", topicOf(node));
  };
  // Going back shows the previous answer straight away (no typing pause).
  const back = () => {
    if (steps.length < 2) return;
    setShown(steps[steps.length - 2].id);
    setSteps(steps.slice(0, -1));
  };
  const restart = () => setSteps((s) => [{ id: (s[s.length - 1]?.id ?? 0) + 1, node: { k: "home" } }]);

  const waLink = (topic: string) => `${whatsappBase}?text=${encodeURIComponent(fill(a.waTopic, { topic }))}`;

  // ---- Search ------------------------------------------------------------
  type Hit = { label: string; node: Node };
  const entries = useMemo<SearchEntry<Hit>[]>(() => {
    const list: SearchEntry<Hit>[] = [];
    for (const p of productSlugs) {
      const pr = d.products[p];
      list.push({
        item: { label: pr.name, node: { k: "product", p } },
        words: tokens(`${pr.name} ${a.menu[p]} ${TOPIC_WORDS[p]}`),
        boost: 1.2,
      });
      list.push({
        item: { label: `${pr.name}: ${a.productMenu.documents}`, node: { k: "info", p, part: "documents" } },
        words: tokens(`${pr.name} ${TOPIC_WORDS[p]} ${TOPIC_WORDS.documents} ${a.productMenu.documents}`),
        boost: 0.6,
      });
    }
    list.push({ item: { label: a.menu.property, node: { k: "property" } }, words: tokens(`${a.menu.property} ${TOPIC_WORDS.property}`), boost: 1.2 });
    list.push({ item: { label: a.menu.claims, node: { k: "claims" } }, words: tokens(`${a.menu.claims} ${TOPIC_WORDS.claims}`), boost: 1.2 });
    list.push({ item: { label: a.menu.talk, node: { k: "talk" } }, words: tokens(`${a.menu.talk} ${TOPIC_WORDS.talk}`) });
    for (const f of data?.faqs ?? []) {
      list.push({ item: { label: f.q, node: { k: "faq", id: f.id } }, words: tokens(f.q), extra: tokens(f.a) });
    }
    return list;
  }, [a, d.products, data]);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim().slice(0, 120);
    if (!q) return;
    const found = search(q, entries).length > 0;
    log("search", found ? "match" : "nomatch", found ? undefined : q);
    setSteps((s) => [...s, { id: (s[s.length - 1]?.id ?? 0) + 1, user: q, node: { k: "search", q } }]);
    setQuery("");
  };

  // ---- Rendering helpers ---------------------------------------------------
  const Bubble = ({ children }: { children: ReactNode }) => (
    <div className="max-w-[92%] self-start rounded-[18px_18px_18px_6px] bg-white px-4 py-3 text-[15px] leading-relaxed text-ink shadow-[0_2px_10px_rgba(43,35,80,.06)]">
      {children}
    </div>
  );
  const Bullets = ({ items }: { items: string[] }) => (
    <ul className="mt-1 flex flex-col gap-1.5">
      {items.map((i) => (
        <li key={i} className="flex gap-2">
          <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-ember" />
          <span>{i}</span>
        </li>
      ))}
    </ul>
  );

  const contactRow = (topic: string, ctx: ProductSlug | "property" | "general" = "general"): Option[] => [
    { label: a.contact.call, href: phoneHref, onClick: () => log("contact", "call") },
    { label: a.contact.whatsapp, href: waLink(topic), external: true, onClick: () => log("contact", "whatsapp") },
    { label: a.contact.callback, go: { k: "callback", ctx } },
  ];

  const faqById = (id: string) => data?.faqs.find((f) => f.id === id);

  function render(node: Node): { body: ReactNode; options: Option[] } {
    switch (node.k) {
      case "home":
        return {
          body: <Bubble>{a.greeting}</Bubble>,
          options: [
            ...productSlugs.map((p) => ({ label: a.menu[p], go: { k: "product", p } as Node })),
            { label: a.menu.property, go: { k: "property" } },
            { label: a.menu.claims, go: { k: "claims" } },
            { label: a.menu.talk, go: { k: "talk" } },
          ],
        };
      case "product": {
        const pr = d.products[node.p];
        return {
          body: <Bubble>{fill(a.productIntro, { product: pr.name })}</Bubble>,
          options: [
            { label: a.productMenu.covers, go: { k: "info", p: node.p, part: "covers" } },
            { label: a.productMenu.suits, go: { k: "info", p: node.p, part: "suits" } },
            { label: a.productMenu.documents, go: { k: "info", p: node.p, part: "documents" } },
            { label: a.productMenu.faqs, go: { k: "faqs", p: node.p } },
            { label: a.productMenu.callback, go: { k: "callback", ctx: node.p } },
            { label: a.productMenu.page, href: `/${lang}/insurance/${node.p}`, secondary: true },
          ],
        };
      }
      case "info": {
        const pr = d.products[node.p];
        const ins = d.insurers[node.p];
        const others = (["covers", "suits", "documents"] as Part[]).filter((x) => x !== node.part);
        return {
          body: (
            <>
              <Bubble>
                <strong>{a.productMenu[node.part]}</strong>
                <Bullets items={pr[node.part]} />
              </Bubble>
              {node.part === "covers" && (
                <Bubble>
                  {fill(a.insurerLine, { insurers: ins.names.join(", ") })}{" "}
                  {!ins.confirmed && <PlaceholderTag>{d.confirm}</PlaceholderTag>}
                  <span className="mt-1 block text-sm text-muted">{a.termsNote}</span>
                </Bubble>
              )}
            </>
          ),
          options: [
            ...others.map((x) => ({ label: a.productMenu[x], go: { k: "info", p: node.p, part: x } as Node })),
            { label: a.productMenu.faqs, go: { k: "faqs", p: node.p } },
            ...contactRow(pr.name, node.p),
          ],
        };
      }
      case "faqs": {
        const list = (data?.faqs ?? []).filter((f) => f.category === node.p);
        return {
          body: <Bubble>{data ? (list.length ? a.faqsIntro : a.noFaqs) : a.typing + "…"}</Bubble>,
          options: [
            ...list.map((f) => ({ label: f.q, go: { k: "faq", id: f.id } as Node })),
            ...(list.length ? [] : contactRow(d.products[node.p].name, node.p)),
          ],
        };
      }
      case "faq": {
        const f = faqById(node.id);
        const topic = f ? (isProduct(f.category) ? d.products[f.category].name : f.q) : a.menu.talk;
        return {
          body: (
            <Bubble>
              {f ? (
                <>
                  <strong className="block">{f.q}</strong>
                  {f.sample ? <PlaceholderTag block className="mt-2">{f.a}</PlaceholderTag> : <span className="mt-1 block whitespace-pre-line">{f.a}</span>}
                </>
              ) : (
                a.search.none
              )}
            </Bubble>
          ),
          options: contactRow(topic, f && isProduct(f.category) ? f.category : f?.category === "real_estate" ? "property" : "general"),
        };
      }
      case "callback": {
        const intro = node.sell ? a.property.sellText : a.callbackIntro;
        return {
          body: (
            <>
              <Bubble>{intro}</Bubble>
              <div className="w-full rounded-[18px] border border-line bg-white p-4">
                {isProduct(node.ctx) ? (
                  <LeadForm kind="product" product={node.ctx} lang={lang} dict={d.form} idPrefix="assistant" source="Assistant" waHref={waLink(d.products[node.ctx].name)} />
                ) : (
                  <LeadForm kind="callback" defaultInterest={node.ctx === "property" ? "property" : "health"} lang={lang} dict={d.form} idPrefix="assistant" source="Assistant" waHref={waLink(a.menu.talk)} />
                )}
              </div>
            </>
          ),
          options: [],
        };
      }
      case "property": {
        const ls = data?.listings ?? [];
        const types = (Object.keys(d.types) as ListingType[]).filter((t) => ls.some((l) => l.type === t));
        return {
          body: <Bubble>{a.property.intro}</Bubble>,
          options: [
            ...(ls.length ? [{ label: a.property.anyType, go: { k: "ptype", t: "all" } as Node }] : []),
            ...types.map((t) => ({ label: `${d.types[t]} (${ls.filter((l) => l.type === t).length})`, go: { k: "ptype", t } as Node })),
            { label: a.property.sell, go: { k: "callback", ctx: "property", sell: true } },
            ...(ls.length ? [] : contactRow(a.menu.property, "property")),
          ],
        };
      }
      case "ptype": {
        const ls = (data?.listings ?? []).filter((l) => node.t === "all" || l.type === node.t);
        const areas = Array.from(new Map(ls.map((l) => [l.areaKey, l.area])));
        if (areas.length <= 1) return render({ k: "plist", t: node.t, area: "any" });
        return {
          body: <Bubble>{a.property.areas}</Bubble>,
          options: [
            ...areas.map(([key, label]) => ({ label, go: { k: "plist", t: node.t, area: key } as Node })),
            { label: a.property.anyArea, go: { k: "plist", t: node.t, area: "any" } },
          ],
        };
      }
      case "plist": {
        const ls = (data?.listings ?? []).filter(
          (l) => (node.t === "all" || l.type === node.t) && (node.area === "any" || l.areaKey === node.area),
        );
        return {
          body: (
            <>
              <Bubble>{ls.length ? a.property.results : a.property.none}</Bubble>
              {ls.slice(0, 3).map((l, i) => {
                const url = siteUrl ? `${siteUrl}/${lang}/real-estate/${l.slug}` : "";
                const wa = `${whatsappBase}?text=${encodeURIComponent(`${fill(a.waTopic, { topic: l.title })} ${url}`.trim())}`;
                return (
                  <article key={l.slug} className="w-full overflow-hidden rounded-[18px] border border-line bg-white">
                    <div className={`relative flex h-28 items-center justify-center bg-gradient-to-br ${listingCovers[i % listingCovers.length]}`}>
                      {l.photo ? (
                        <Image src={l.photo} alt={l.title} fill sizes="380px" className="object-cover" />
                      ) : (
                        <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase text-iris-900">{d.types[l.type]}</span>
                      )}
                    </div>
                    <div className="flex flex-col gap-1 p-3.5">
                      <p className="font-semibold">{l.sample ? <PlaceholderTag className="!rounded-xl">{l.title}</PlaceholderTag> : l.title}</p>
                      <p className="text-sm text-muted">{[l.area, l.size].filter(Boolean).join(" · ")}</p>
                      <p className="font-display font-bold text-ember">{l.price}</p>
                      <div className="mt-1 flex flex-wrap gap-2">
                        <Link href={`/${lang}/real-estate/${l.slug}`} onClick={() => onClose(true)} className="inline-flex min-h-10 items-center rounded-full bg-ink px-4 text-sm font-semibold text-white">
                          {a.property.view}
                        </Link>
                        <a href={wa} target="_blank" rel="noopener" onClick={() => log("contact", "whatsapp")} className="inline-flex min-h-10 items-center rounded-full bg-[#1f7a46] px-4 text-sm font-semibold text-white">
                          {a.property.enquire}
                        </a>
                      </div>
                    </div>
                  </article>
                );
              })}
            </>
          ),
          options: [
            ...(ls.length > 3 || ls.length === 0 ? [{ label: a.property.more, href: `/${lang}/real-estate`, secondary: true }] : []),
            ...contactRow(a.menu.property, "property"),
          ],
        };
      }
      case "claims": {
        const c = a.claims;
        return {
          body: (
            <>
              <Bubble>{c.intro}</Bubble>
              <div data-placeholder className="tag-glow tag-glow-block w-full max-w-[92%] self-start !rounded-[18px] text-[15px]">
                {[c.cashless, c.reimbursement].map((s) => (
                  <div key={s.t} className="mb-3">
                    <strong className="block">{s.t}</strong>
                    <ol className="mt-1 list-decimal pl-5">
                      {s.steps.map((x) => <li key={x}>{x}</li>)}
                    </ol>
                  </div>
                ))}
                <strong className="block">{c.keep.t}</strong>
                <ul className="mt-1 list-disc pl-5">
                  {c.keep.items.map((x) => <li key={x}>{x}</li>)}
                </ul>
              </div>
              <Bubble><strong>{c.emergency}</strong></Bubble>
            </>
          ),
          options: contactRow(a.menu.claims),
        };
      }
      case "talk":
        return {
          body: (
            <Bubble>
              {a.talk}
              <span className="mt-1 block text-sm text-muted">
                {d.hours.label} <PlaceholderTag>{d.hours.ph}</PlaceholderTag>
              </span>
            </Bubble>
          ),
          options: contactRow(a.menu.talk),
        };
      case "search": {
        const hits = search(node.q, entries);
        return {
          body: <Bubble>{hits.length ? a.search.results : a.search.none}</Bubble>,
          options: hits.length ? hits.map((h) => ({ label: h.label, go: h.node })) : contactRow(node.q),
        };
      }
    }
  }

  const OptionButton = ({ o }: { o: Option }) => {
    const cls = clsx(
      "inline-flex min-h-11 items-center rounded-full border px-4 py-2 text-left text-sm font-semibold transition-colors",
      o.secondary ? "border-line bg-transparent text-muted hover:border-ink" : "border-iris-200 bg-iris-50 text-iris-900 hover:bg-iris-100",
    );
    if (o.href) {
      const internal = o.href.startsWith("/");
      return internal ? (
        <Link href={o.href} className={cls} onClick={() => { o.onClick?.(); onClose(true); }}>
          {o.label}
        </Link>
      ) : (
        <a href={o.href} className={cls} target={o.external ? "_blank" : undefined} rel={o.external ? "noopener" : undefined} onClick={o.onClick}>
          {o.label}
        </a>
      );
    }
    return (
      <button type="button" className={cls} onClick={() => (o.go ? go(o.go, o.label) : o.onClick?.())}>
        {o.label}
      </button>
    );
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-3 bg-gradient-to-br from-iris-900 to-iris-800 px-4 py-3.5 text-white">
        <div className="min-w-0">
          <h2 ref={headingRef} tabIndex={-1} id="assistant-title" className="font-display text-lg font-bold outline-none">
            {a.name}
          </h2>
          <p className="text-xs leading-snug text-iris-100">{a.disclaimer}</p>
        </div>
        <div className="flex shrink-0 gap-1.5">
          <button type="button" onClick={restart} aria-label={a.restart} title={a.restart} className="flex size-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20">
            <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 12a9 9 0 1 0 3-6.7M3 4v5h5" /></svg>
          </button>
          <button type="button" onClick={() => onClose()} aria-label={a.close} title={a.close} className="flex size-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20">
            <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>
      </div>

      <div ref={logRef} role="log" aria-labelledby="assistant-title" className="relative flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto bg-paper px-3.5 py-4">
        {steps.map((s) => {
          const isLast = s.id === last.id;
          if (isLast && shown !== s.id) {
            return (
              <div key={s.id} className="flex flex-col gap-3">
                {s.user && <UserBubble text={s.user} label={a.you} />}
                <div className="typing-dots self-start rounded-[18px] bg-white px-4 py-3" aria-label={a.typing}>
                  <span /><span /><span />
                </div>
              </div>
            );
          }
          const { body, options } = render(s.node);
          return (
            <div key={s.id} ref={isLast ? lastRef : undefined} tabIndex={isLast ? -1 : undefined} className="flex flex-col gap-3 outline-none">
              {s.user && <UserBubble text={s.user} label={a.you} />}
              {body}
              {isLast && (options.length > 0 || steps.length > 1) && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {options.map((o) => <OptionButton key={o.label + (o.href ?? "")} o={o} />)}
                  {steps.length > 1 && (
                    <button type="button" onClick={back} className="inline-flex min-h-11 items-center rounded-full px-3 text-sm font-semibold text-muted underline-offset-4 hover:underline">
                      ← {a.back}
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <form onSubmit={submitSearch} role="search" className="flex gap-2 border-t border-line bg-white p-3">
        <label htmlFor="assistant-search" className="sr-only">{a.search.label}</label>
        <input
          id="assistant-search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          maxLength={120}
          placeholder={a.search.placeholder}
          autoComplete="off"
          className="min-h-11 min-w-0 flex-1 rounded-full border border-[#cfccd6] bg-white px-4 text-base focus:border-iris-500 focus:outline-none focus:ring-2 focus:ring-iris-200"
        />
        <button type="submit" className="btn-sheen min-h-11 shrink-0 rounded-full px-4 text-sm font-semibold text-white">
          {a.search.button}
        </button>
      </form>
    </div>
  );
}

function UserBubble({ text, label }: { text: string; label: string }) {
  return (
    <div className="max-w-[85%] self-end rounded-[18px_18px_6px_18px] bg-iris-800 px-4 py-2.5 text-[15px] text-white">
      <span className="sr-only">{label}: </span>
      {text}
    </div>
  );
}
