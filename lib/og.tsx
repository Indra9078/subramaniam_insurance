import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { site } from "@/lib/site";

export const ogSize = { width: 1200, height: 630 };
export const ogAlt = "A. Subramaniam: insurance and property advisor";

const font = (file: string) => readFile(join(process.cwd(), "assets/fonts", file));

/**
 * Branded link-preview image (WhatsApp, Facebook, LinkedIn, X).
 * English text only: the renderer does not shape Tamil script correctly.
 */
export async function renderOg({ eyebrow, title }: { lang?: string; eyebrow: string; title: string }) {
  const [display, body] = await Promise.all([
    font("space-grotesk-latin-700-normal.woff"),
    font("inter-latin-500-normal.woff"),
  ]);
  const long = title.length > 48;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "linear-gradient(135deg, #2B2350 0%, #352A66 55%, #221C3D 100%)",
          color: "#FFFFFF",
          fontFamily: "Space Grotesk",
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", right: -160, top: -120, width: 560, height: 560, borderRadius: 999, background: "radial-gradient(circle, rgba(242,96,43,.38), rgba(242,96,43,0) 65%)", display: "flex" }} />
        <div style={{ position: "absolute", left: -180, bottom: -220, width: 620, height: 620, borderRadius: 999, background: "radial-gradient(circle, rgba(142,124,255,.45), rgba(142,124,255,0) 65%)", display: "flex" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 26, color: "#FF8A5B" }}>
          <div style={{ width: 14, height: 14, borderRadius: 99, background: "#FF8A5B", display: "flex" }} />
          {eyebrow}
        </div>
        <div style={{ display: "flex", fontSize: long ? 64 : 80, lineHeight: 1.08, letterSpacing: -1.5, maxWidth: 1000 }}>
          {title}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", fontSize: 26 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ fontSize: 36 }}>A. Subramaniam</div>
            <div style={{ fontFamily: "Inter", color: "#C9BFFF", fontSize: 22, letterSpacing: 3 }}>
              INSURANCE · PROPERTY
            </div>
          </div>
          <div style={{ display: "flex", padding: "14px 26px", borderRadius: 999, background: "#BA3C0F", fontFamily: "Inter", fontSize: 26 }}>
            {site.phoneDisplay}
          </div>
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Space Grotesk", data: display, weight: 700, style: "normal" },
        { name: "Inter", data: body, weight: 500, style: "normal" },
      ],
    },
  );
}
