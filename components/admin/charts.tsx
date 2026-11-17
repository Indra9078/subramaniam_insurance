import type { ReactNode } from "react";

/*
  Dashboard charts: plain SVG / HTML rendered on the server. Colours are roles
  (--s1..--s3, --track) defined on the dashboard root; the categorical order
  orange, violet, aqua was checked with the palette validator (all-pairs).
  Forms follow the job: columns for change over time, ranked bars for
  magnitude, a segmented bar for one whole, stat tiles with sparklines for headline numbers.
*/

const GRID = "#f1d5bd";
const INK2 = "#6b4a3a";

export const fmtDay = (key: string, long = false) =>
  new Date(`${key}T12:00:00+05:30`).toLocaleDateString("en-IN", long ? { weekday: "short", day: "numeric", month: "short", year: "numeric" } : { day: "numeric", month: "short" });

/** A "nice" axis maximum: 1, 2, 4, 5, 8, 10 times a power of ten. */
function niceMax(v: number) {
  if (v <= 4) return 4;
  const p = 10 ** Math.floor(Math.log10(v));
  const m = v / p;
  return (m <= 2 ? 2 : m <= 4 ? 4 : m <= 5 ? 5 : m <= 8 ? 8 : 10) * p;
}

export function Card({ title, sub, children, className = "", action }: { title: string; sub?: string; children: ReactNode; className?: string; action?: ReactNode }) {
  return (
    <section className={`flex min-w-0 flex-col gap-4 rounded-[1.5rem] border border-line bg-white p-5 shadow-[0_8px_30px_rgba(194,65,12,.06)] md:p-6 ${className}`}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="font-display text-lg font-bold">{title}</h2>
          {sub && <p className="text-sm text-muted">{sub}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

// ---------------------------------------------------------------------------
// Stat tile with delta and sparkline
// ---------------------------------------------------------------------------
export function Sparkline({ values, color = "var(--s1)" }: { values: number[]; color?: string }) {
  if (values.length < 2 || values.every((v) => v === 0)) return <div className="h-9" aria-hidden="true" />;
  const W = 120, H = 36, max = Math.max(...values, 1);
  const pts = values.map((v, i) => `${((i / (values.length - 1)) * (W - 4) + 2).toFixed(1)},${(H - 4 - (v / max) * (H - 8)).toFixed(1)}`);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-9 w-full max-w-[140px]" preserveAspectRatio="none" aria-hidden="true">
      <polyline points={pts.join(" ")} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts[pts.length - 1].split(",")[0]} cy={pts[pts.length - 1].split(",")[1]} r="3" fill={color} stroke="#fff" strokeWidth="2" />
    </svg>
  );
}

export function StatTile({ label, value, prev, series, suffix = "", note, range, hero = false }: {
  label: string; value: number; prev: number; series: number[]; suffix?: string; note?: string; range: number; hero?: boolean;
}) {
  const diff = value - prev;
  const pct = prev > 0 ? Math.round((diff / prev) * 100) : null;
  const unit = suffix === "%" ? " pts" : "";
  const delta = diff === 0 ? "▬ no change" : `${diff > 0 ? "▲" : "▼"} ${suffix === "%" ? Math.abs(diff) + unit : pct !== null ? Math.abs(pct) + "%" : Math.abs(diff) + " new"}`;
  return (
    <div className={`flex min-w-0 flex-col gap-2 rounded-[1.5rem] border border-line bg-white p-5 shadow-[0_8px_30px_rgba(194,65,12,.06)] ${hero ? "lg:col-span-2 lg:p-7" : ""}`}>
      <p className="text-sm font-semibold text-muted">{label}</p>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <p className={`font-display font-bold leading-none tracking-tight ${hero ? "text-6xl" : "text-4xl"}`}>
          {value.toLocaleString("en-IN")}
          {suffix && <span className="ml-0.5 text-2xl text-muted">{suffix}</span>}
        </p>
        <Sparkline values={series} />
      </div>
      <p className="text-xs text-muted">
        <span className="font-semibold text-ink">{delta}</span> vs previous {range} days{note ? ` · ${note}` : ""}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Stacked columns over time
// ---------------------------------------------------------------------------
export type Series = { name: string; color: string; values: number[] };

export function ColumnChart({ days, series, title }: { days: string[]; series: Series[]; title: string }) {
  const W = 760, H = 270, ml = 34, mr = 6, mt = 12, mb = 28;
  const plotW = W - ml - mr, plotH = H - mt - mb;
  const n = days.length;
  const totals = days.map((_, i) => series.reduce((s, x) => s + x.values[i], 0));
  const max = niceMax(Math.max(...totals, 0));
  const slot = plotW / n;
  const barW = Math.min(34, Math.max(2.5, slot * 0.64));
  const y = (v: number) => mt + plotH * (1 - v / max);
  const step = Math.ceil(n / 7);
  const ticks = [0, 1, 2, 3, 4].map((t) => (max / 4) * t);
  const sums = series.map((s) => s.values.reduce((a, b) => a + b, 0));

  return (
    <figure className="flex flex-col gap-3">
      <ul className="flex flex-wrap gap-x-5 gap-y-1.5 text-sm">
        {series.map((s, i) => (
          <li key={s.name} className="flex items-center gap-2">
            <span aria-hidden="true" className="size-3 rounded-[4px]" style={{ background: s.color }} />
            <span className="text-muted">{s.name}</span>
            <span className="font-semibold">{sums[i]}</span>
          </li>
        ))}
      </ul>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={`${title}. ${totals.reduce((a, b) => a + b, 0)} in total over ${n} days.`}>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={ml} x2={W - mr} y1={y(t)} y2={y(t)} stroke={GRID} strokeWidth="1" />
            <text x={ml - 7} y={y(t) + 4} textAnchor="end" fontSize="11" fill={INK2}>{Math.round(t * 10) / 10}</text>
          </g>
        ))}
        {days.map((d, i) => {
          const x = ml + i * slot + (slot - barW) / 2;
          let acc = 0;
          const tip = [fmtDay(d, true), ...series.map((s) => `${s.name}: ${s.values[i]}`)].join("\n");
          return (
            <g key={d}>
              {series.map((s) => {
                const v = s.values[i];
                if (!v) return null;
                const top = y(acc + v);
                const h = Math.max(3, y(acc) - top - (acc ? 2 : 0));
                const yy = y(acc) - h - (acc ? 2 : 0);
                acc += v;
                return <rect key={s.name} x={x} y={yy} width={barW} height={h} rx={Math.min(3, barW / 2)} fill={s.color} />;
              })}
              <rect x={ml + i * slot} y={mt} width={slot} height={plotH} fill="transparent" data-tip={tip} tabIndex={0} role="img" aria-label={tip.replaceAll("\n", ", ")} className="outline-none focus-visible:fill-[#c2410c]/10" />
              {(i % step === 0 || i === n - 1) && (
                <text x={ml + i * slot + slot / 2} y={H - 8} textAnchor="middle" fontSize="11" fill={INK2}>{fmtDay(d)}</text>
              )}
            </g>
          );
        })}
      </svg>
      <details className="text-sm">
        <summary className="inline-flex min-h-10 cursor-pointer items-center font-semibold text-ember">View as a table</summary>
        <div className="mt-2 max-h-64 overflow-auto rounded-[12px] border border-line">
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 bg-paper">
              <tr>
                <th className="px-3 py-2 font-semibold">Date</th>
                {series.map((s) => <th key={s.name} className="px-3 py-2 font-semibold">{s.name}</th>)}
              </tr>
            </thead>
            <tbody>
              {days.map((d, i) => (
                <tr key={d} className="border-t border-line">
                  <td className="px-3 py-1.5">{fmtDay(d, true)}</td>
                  {series.map((s) => <td key={s.name} className="px-3 py-1.5">{s.values[i]}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </figure>
  );
}

// ---------------------------------------------------------------------------
// Ranked horizontal bars (magnitude, one hue)
// ---------------------------------------------------------------------------
export function RankedBars({ rows, empty, label = (k: string) => k, color = "var(--s1)" }: {
  rows: [string, number][]; empty: string; label?: (k: string) => string; color?: string;
}) {
  if (!rows.length) return <p className="rounded-[12px] border border-dashed border-line p-5 text-center text-sm text-muted">{empty}</p>;
  const max = Math.max(...rows.map((r) => r[1]), 1);
  const total = rows.reduce((s, r) => s + r[1], 0);
  return (
    <ol className="flex flex-col gap-2.5">
      {rows.map(([k, n]) => {
        const tip = `${label(k)}\n${n} (${Math.round((n / total) * 100)}% of shown)`;
        return (
          <li key={k} className="grid grid-cols-[minmax(0,9.5rem)_1fr_auto] items-center gap-3 text-sm sm:grid-cols-[minmax(0,12rem)_1fr_auto]" data-tip={tip} tabIndex={0} aria-label={tip.replaceAll("\n", ", ")}>
            <span className="truncate" title={label(k)}>{label(k)}</span>
            <span className="h-3 rounded-full bg-[var(--track)]" aria-hidden="true">
              <span className="block h-full rounded-r-full rounded-l-[3px]" style={{ width: `${Math.max(4, (n / max) * 100)}%`, background: color }} />
            </span>
            <span className="min-w-6 text-right font-semibold tabular-nums">{n}</span>
          </li>
        );
      })}
    </ol>
  );
}

// ---------------------------------------------------------------------------
// One whole split into a few parts
// ---------------------------------------------------------------------------
export function SegmentedBar({ parts, empty }: { parts: { label: string; value: number; color: string; text?: string }[]; empty: string }) {
  const total = parts.reduce((s, p) => s + p.value, 0);
  if (!total) return <p className="rounded-[12px] border border-dashed border-line p-5 text-center text-sm text-muted">{empty}</p>;
  return (
    <div className="flex flex-col gap-3">
      <div className="flex h-12 gap-[2px] overflow-hidden rounded-[10px]" role="img" aria-label={parts.map((p) => `${p.label} ${p.value}`).join(", ")}>
        {parts.filter((p) => p.value > 0).map((p) => {
          const pct = Math.round((p.value / total) * 100);
          const tip = `${p.label}\n${p.value} (${pct}%)`;
          return (
            <div key={p.label} data-tip={tip} tabIndex={0} aria-label={tip.replaceAll("\n", ", ")} className="flex items-center justify-center text-sm font-bold outline-none focus-visible:ring-2 focus-visible:ring-ink" style={{ width: `${(p.value / total) * 100}%`, background: p.color, color: p.text ?? "#fff" }}>
              {pct >= 12 ? `${pct}%` : ""}
            </div>
          );
        })}
      </div>
      <ul className="flex flex-wrap gap-x-5 gap-y-1.5 text-sm">
        {parts.map((p) => (
          <li key={p.label} className="flex items-center gap-2">
            <span aria-hidden="true" className="size-3 rounded-[4px]" style={{ background: p.color }} />
            <span className="text-muted">{p.label}</span>
            <span className="font-semibold">{p.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
