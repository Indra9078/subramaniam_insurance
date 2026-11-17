import "@/app/orbit.css";
import type { ReactNode } from "react";

/*
  Orbiting logos in free space: icon badges on an inner ring and insurer name
  badges on an outer ring that turns the other way.
  Insurer badges are plain text wordmarks. Swap in official logo files only
  after the client has permission from each company to use them.
*/

const stroke = {
  fill: "none",
  stroke: "#fff",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const icons: Record<string, ReactNode> = {
  sell: (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke}>
      <path d="M3 11l9-7 9 7" />
      <path d="M5 10v10h14V10" />
      <path d="M9.5 15.5l1.7 1.7 3.3-3.4" />
    </svg>
  ),
  buy: (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke}>
      <path d="M3 11l9-7 9 7" />
      <path d="M5 10v10h14V10" />
      <circle cx="10" cy="14.5" r="1.8" />
      <path d="M11.8 14.5H16M14.5 14.5v2" />
    </svg>
  ),
  consult: (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke}>
      <path d="M4 5h16v11H9l-5 4z" />
      <path d="M8.5 9.5h7M8.5 12.5h4" />
    </svg>
  ),
};

/** Services on the inner ring. `lines` are the two short lines shown under each badge. */
const inner = [
  { angle: 0, icon: "sell", lines: ["Property", "Selling"] },
  { angle: 120, icon: "buy", lines: ["Property", "Buying"] },
  { angle: 240, icon: "consult", lines: ["Consulting", ""] },
];

/** Insurers the client works with, shown as name badges on the outer ring (text only: logos need permission). */
export const orbitInsurers = [
  "LIC",
  "Tata AIA Life Insurance",
  "Star Health Insurance",
  "IFFCO-Tokio Vehicle Insurance",
  "United India Vehicle Insurance",
  "HDFC Life Insurance",
];
// Offset 30° from the inner badges. Both rings turn together, so spacing never changes.
const outer = orbitInsurers.map((name, i) => ({ angle: 30 + i * 60, name }));

type CSSVars = React.CSSProperties & Record<`--${string}`, string>;

const itemStyle = (angle: number, radius: string): CSSVars => ({
  "--a": `${angle}deg`,
  "--r": radius,
});

export const orbitServices = inner.map((i) => i.lines.join(" ").trim());

export function OrbitHero({
  coreLabel,
  label,
}: {
  coreLabel: string;
  label: string;
}) {
  return (
    <>
    <div className="orbit" role="img" aria-label={`${label}: ${orbitInsurers.join(", ")}, ${inner.map((i) => i.lines.join(" ").trim()).join(", ")}`}>
      <div className="orbit__path orbit__path--outer-faint" />
      <div className="orbit__path orbit__path--outer" />
      <div className="orbit__path orbit__path--inner" />

      <div className="orbit__core">
        <div className="orbit__core-mark">AS</div>
        <div className="orbit__core-label">{coreLabel}</div>
      </div>

      <div className="orbit__ring" style={{ "--dur": "40s" } as CSSVars}>
        {inner.map(({ angle, icon, lines }) => (
          <div
            key={icon}
            className="orbit__item"
            style={itemStyle(angle, "23.1cqw")}
          >
            <div className="orbit__upright" style={itemStyle(angle, "0")}>
              <div className="orbit__badge orbit__badge--stack">
                <span className="orbit__badge--icon">{icons[icon]}</span>
                <span className="orbit__caption">
                  {lines[0]}
                  {lines[1] && <br />}
                  {lines[1]}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="orbit__ring" style={{ "--dur": "40s" } as CSSVars}>
        {outer.map(({ angle, name }) => (
          <div
            key={name}
            className="orbit__item"
            style={itemStyle(angle, "39.5cqw")}
          >
            <div className="orbit__upright" style={itemStyle(angle, "0")}>
              <div className="orbit__badge orbit__badge--pill">{name}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
    <ul className="mt-3 hidden flex-wrap justify-center gap-x-4 gap-y-1 text-sm font-semibold text-iris-100 max-[384px]:flex">
      {orbitServices.map((name) => (
        <li key={name} className="flex items-center gap-1.5">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-ember-soft" />
          {name}
        </li>
      ))}
    </ul>
    </>
  );
}
