import type { PlanCategory } from "@/lib/types";

const themes: Record<PlanCategory, { bg: string; icon: React.ReactNode }> = {
  health: {
    bg: "from-[#ffd9c7] via-[#ffe9df] to-[#e9e5ff]",
    icon: (
      <>
        <path d="M60 14 L96 28 V58 C96 82 80 100 60 108 C40 100 24 82 24 58 V28 Z" fill="#2B2350" />
        <path d="M60 80 C48 71 44 65 44 60 A8.5 8.5 0 0 1 60 56.5 A8.5 8.5 0 0 1 76 60 C76 65 72 71 60 80 Z" fill="#FF8A5B" />
        <path d="M60 46 V56 M55 51 H65" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" />
      </>
    ),
  },
  life: {
    bg: "from-[#e9e5ff] via-[#f1eeff] to-[#ffe9df]",
    icon: (
      <>
        <path d="M18 56 Q60 -2 102 56 Q90 46 78 56 Q66 46 54 56 Q42 46 30 56 Q24 50 18 56 Z" fill="#FF8A5B" />
        <rect x="58" y="54" width="4" height="40" rx="2" fill="#2B2350" />
        <circle cx="42" cy="84" r="7" fill="#2B2350" /><path d="M32 108 V98 A10 10 0 0 1 52 98 V108 Z" fill="#2B2350" />
        <circle cx="80" cy="88" r="5.5" fill="#6E5BE0" /><path d="M72 108 V100 A8 8 0 0 1 88 100 V108 Z" fill="#6E5BE0" />
      </>
    ),
  },
  vehicle: {
    bg: "from-[#e7f5ec] via-[#f1faf4] to-[#e9e5ff]",
    icon: (
      <>
        <path d="M18 76 V64 L30 40 H90 L102 64 V76 Z" fill="#2B2350" />
        <path d="M34 46 H86 L95 64 H25 Z" fill="#C9BFFF" />
        <rect x="14" y="70" width="92" height="16" rx="6" fill="#352A66" />
        <circle cx="36" cy="88" r="10" fill="#FF8A5B" /><circle cx="36" cy="88" r="4" fill="#fff" />
        <circle cx="84" cy="88" r="10" fill="#FF8A5B" /><circle cx="84" cy="88" r="4" fill="#fff" />
        <circle cx="26" cy="72" r="3" fill="#FFD9A8" /><circle cx="94" cy="72" r="3" fill="#FFD9A8" />
      </>
    ),
  },
  corporate: {
    bg: "from-[#fff3cf] via-[#fff8e3] to-[#ffe9df]",
    icon: (
      <>
        <rect x="26" y="34" width="38" height="74" rx="3" fill="#2B2350" />
        <rect x="62" y="56" width="32" height="52" rx="3" fill="#352A66" />
        {[0, 1, 2, 3, 4].map((r) =>
          [0, 1].map((c) => <rect key={`${r}${c}`} x={32 + c * 16} y={42 + r * 13} width="8" height="8" rx="1.5" fill={(r + c) % 2 ? "#FFD9A8" : "#C9BFFF"} />),
        )}
        {[0, 1, 2].map((r) => <rect key={r} x="69" y={63 + r * 13} width="8" height="8" rx="1.5" fill="#FFD9A8" />)}
        <circle cx="96" cy="30" r="12" fill="#FF8A5B" /><path d="M90 30 L94.5 34.5 L102 26" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
};

/** Illustrated cover for a plan that has no uploaded image yet. */
export function PlanCover({ category, className = "" }: { category: PlanCategory; className?: string }) {
  const t = themes[category];
  return (
    <div aria-hidden="true" className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br ${t.bg} ${className}`}>
      <div className="absolute -right-10 -top-10 size-40 rounded-full bg-white/50 blur-2xl" />
      <div className="absolute -bottom-12 -left-8 size-44 rounded-full bg-[#ff8a5b]/20 blur-2xl" />
      <svg viewBox="0 0 120 120" className="relative h-[78%] w-auto drop-shadow-[0_10px_16px_rgba(43,35,80,.25)]">
        {t.icon}
      </svg>
    </div>
  );
}
