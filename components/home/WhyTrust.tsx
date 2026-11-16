import { AssistantTrigger } from "@/components/assistant/AssistantLauncher";
import { PlaceholderTag } from "@/components/ui/PlaceholderTag";
import type { Dictionary } from "@/app/[lang]/dictionaries";

const statPlaceholders = ["[00]+", "[000]+", "[00]+"];

/** Soft purple section: why people trust him, plus an animated chat preview. */
export function WhyTrust({ dict }: { dict: Dictionary }) {
  const w = dict.why;
  const c = dict.chat;
  return (
    <section
      id="about"
      className="relative mt-10 scroll-mt-4 overflow-hidden bg-gradient-to-b from-iris-900 via-iris-800 to-iris-950 text-iris-50 md:mt-24"
    >
      <div className="pointer-events-none absolute -bottom-32 -left-32 size-[520px] animate-drift rounded-full bg-[radial-gradient(circle,rgba(142,124,255,.5),transparent_65%)] [animation-direction:reverse] [animation-duration:18s]" />
      <div className="relative mx-auto flex max-w-[1240px] flex-col gap-12 px-5 py-16 md:px-8 md:py-28 lg:flex-row lg:items-center lg:gap-14">
        <div className="flex min-w-0 flex-1 flex-col gap-6 md:gap-7">
          <p className="text-sm font-semibold uppercase tracking-wider text-iris-200">
            {w.tag}
          </p>
          <h2 className="font-display text-[2rem] font-bold leading-[1.1] tracking-tight md:text-[3.25rem]">
            {w.title}
          </h2>
          <p className="max-w-xl text-base leading-7 text-[#d6d0f0] md:text-lg">
            {w.text} <PlaceholderTag tone="dark">{w.story}</PlaceholderTag>
          </p>
          <ul className="flex flex-wrap gap-4">
            {w.stats.map((label, i) => (
              <li
                key={label}
                className="min-w-[140px] flex-1 rounded-[22px] border border-iris-200/30 bg-white/8 p-5 transition-transform duration-300 hover:-translate-y-2 md:p-6"
              >
                <div className="font-display text-4xl font-bold md:text-[40px]">
                  <PlaceholderTag tone="dark">{statPlaceholders[i]}</PlaceholderTag>
                </div>
                <div className="mt-2 text-sm text-[#d6d0f0]">{label}</div>
              </li>
            ))}
          </ul>
        </div>

        <div
          className="flex w-full max-w-[520px] min-w-0 flex-1 flex-col gap-4 rounded-[2rem] border border-iris-200/35 bg-[rgba(14,10,32,.55)] p-5 shadow-[0_0_80px_rgba(142,124,255,.4)] md:p-6"
        >
          <div className="flex items-center justify-between">
            <div className="font-display text-lg font-semibold">{c.title}</div>
            <div className="flex items-center gap-2 text-[13px] text-iris-200">
              <span className="size-2 rounded-full bg-[#6ee7a0] shadow-[0_0_8px_#6ee7a0]" />
              EN / தமிழ்
            </div>
          </div>
          <div aria-hidden="true" className="chat-msg-1 max-w-[85%] self-start rounded-[18px_18px_18px_4px] bg-white/12 px-4 py-3.5 text-[15px] leading-relaxed">
            {c.msgs[0]}
          </div>
          <div aria-hidden="true" className="chat-msg-2 max-w-[85%] self-end rounded-[18px_18px_4px_18px] bg-iris-300 px-4 py-3.5 text-[15px] font-medium leading-relaxed text-[#120c2b]">
            {c.msgs[1]}
          </div>
          <div aria-hidden="true" className="chat-msg-3 max-w-[85%] self-start rounded-[18px_18px_18px_4px] bg-white/12 px-4 py-3.5 text-[15px] leading-relaxed">
            {c.msgs[2]}
          </div>
          <div className="typing-dots self-start px-3.5 py-2" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <div className="mt-1 flex gap-2.5">
            <AssistantTrigger
              label={dict.assistant.tryIt}
              className="btn-sheen flex min-h-12 w-full items-center justify-center rounded-full px-5 text-[15px] font-semibold text-white"
            />
          </div>
          <p className="text-xs text-[#bdb6da]">{c.note}</p>
        </div>
      </div>
    </section>
  );
}
