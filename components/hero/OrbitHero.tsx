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
  health: (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke}>
      <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  ),
  property: (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke}>
      <path d="M3 11l9-7 9 7" />
      <path d="M5 10v10h14V10" />
      <path d="M10 20v-6h4v6" />
    </svg>
  ),
  vehicle: (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke}>
      <path d="M5 16v-4l2-5h10l2 5v4" />
      <path d="M3 16h18" />
      <circle cx="7.5" cy="17.5" r="1.5" />
      <circle cx="16.5" cy="17.5" r="1.5" />
    </svg>
  ),
};

const inner = [
  { angle: 0, icon: "health" },
  { angle: 120, icon: "property" },
  { angle: 240, icon: "vehicle" },
];

const outer = [
  { angle: 20, name: "LIC" },
  { angle: 110, name: "Star Health" },
  { angle: 200, name: "IFFCO-Tokio" },
  { angle: 290, name: "HDFC" },
];

type CSSVars = React.CSSProperties & Record<`--${string}`, string>;

const itemStyle = (angle: number, radius: string): CSSVars => ({
  "--a": `${angle}deg`,
  "--r": radius,
});

export function OrbitHero({
  coreLabel,
  label,
}: {
  coreLabel: string;
  label: string;
}) {
  return (
    <div className="orbit" role="img" aria-label={label}>
      <div className="orbit__path orbit__path--outer-faint" />
      <div className="orbit__path orbit__path--outer" />
      <div className="orbit__path orbit__path--inner" />

      <div className="orbit__core">
        <div className="orbit__core-mark">AS</div>
        <div className="orbit__core-label">{coreLabel}</div>
      </div>

      <div className="orbit__ring" style={{ "--dur": "30s" } as CSSVars}>
        {inner.map(({ angle, icon }) => (
          <div
            key={icon}
            className="orbit__item"
            style={itemStyle(angle, "23.1cqw")}
          >
            <div className="orbit__upright" style={itemStyle(angle, "0")}>
              <div className="orbit__badge orbit__badge--icon">
                {icons[icon]}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div
        className="orbit__ring orbit__ring--reverse"
        style={{ "--dur": "46s" } as CSSVars}
      >
        {outer.map(({ angle, name }) => (
          <div
            key={name}
            className="orbit__item"
            style={itemStyle(angle, "37.96cqw")}
          >
            <div className="orbit__upright" style={itemStyle(angle, "0")}>
              <div className="orbit__badge orbit__badge--pill">{name}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
