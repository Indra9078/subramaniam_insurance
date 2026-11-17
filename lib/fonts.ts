import localFont from "next/font/local";

/**
 * Self-hosted fonts through next/font: the main Latin fonts are preloaded and get
 * a size-matched fallback, so text appears sooner and does not jump when they load.
 */
export const spaceGrotesk = localFont({
  src: [
    { path: "../node_modules/@fontsource/space-grotesk/files/space-grotesk-latin-600-normal.woff2", weight: "600" },
    { path: "../node_modules/@fontsource/space-grotesk/files/space-grotesk-latin-700-normal.woff2", weight: "700" },
  ],
  variable: "--font-sg",
  display: "swap",
});

export const inter = localFont({
  src: [
    { path: "../node_modules/@fontsource/inter/files/inter-latin-400-normal.woff2", weight: "400" },
    { path: "../node_modules/@fontsource/inter/files/inter-latin-500-normal.woff2", weight: "500" },
    { path: "../node_modules/@fontsource/inter/files/inter-latin-600-normal.woff2", weight: "600" },
  ],
  variable: "--font-inter",
  display: "swap",
});

/** Tamil glyphs only (unicode-range), so English pages fetch it just for the "தமிழ்" toggle. */
export const notoTamil = localFont({
  src: [
    { path: "../node_modules/@fontsource/noto-sans-tamil/files/noto-sans-tamil-tamil-400-normal.woff2", weight: "400" },
    { path: "../node_modules/@fontsource/noto-sans-tamil/files/noto-sans-tamil-tamil-500-normal.woff2", weight: "500" },
    { path: "../node_modules/@fontsource/noto-sans-tamil/files/noto-sans-tamil-tamil-600-normal.woff2", weight: "600" },
    { path: "../node_modules/@fontsource/noto-sans-tamil/files/noto-sans-tamil-tamil-700-normal.woff2", weight: "700" },
  ],
  variable: "--font-tamil",
  // "optional": if the font is not ready in time, the phone's own Tamil font is
  // used for that visit, so Tamil text never jumps (no layout shift).
  display: "optional",
  preload: false,
  adjustFontFallback: false,
  declarations: [{ prop: "unicode-range", value: "U+0B80-0BFF, U+200C-200D, U+25CC" }],
});

export const fontVariables = `${spaceGrotesk.variable} ${inter.variable} ${notoTamil.variable}`;
