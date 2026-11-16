import type { Dictionary } from "@/app/[lang]/dictionaries";

const dots = ["bg-ember", "bg-iris-500", "bg-ink"];

export function HowItWorks({ dict }: { dict: Dictionary }) {
  const h = dict.how;
  return (
    <section className="mx-auto w-full max-w-[1240px] px-5 py-12 md:px-8 md:py-24">
      <h2 className="font-display text-[2rem] font-bold leading-[1.1] tracking-tight md:text-6xl">
        {h.title}
      </h2>
      <ol className="relative mt-10 grid gap-10 md:mt-14 md:grid-cols-3 md:gap-7">
        {/* dashed connector, desktop only */}
        <svg
          aria-hidden="true"
          viewBox="0 0 1000 4"
          preserveAspectRatio="none"
          className="absolute left-[8%] top-[34px] hidden h-1 w-[84%] md:block"
        >
          <line
            x1="0"
            y1="2"
            x2="1000"
            y2="2"
            stroke="#c94312"
            strokeWidth="3"
            strokeDasharray="8 10"
            className="[animation:dashmove_3s_linear_infinite]"
          />
        </svg>
        {h.steps.map((step, i) => (
          <li key={step.t} className="relative flex flex-col gap-3.5">
            <span
              className={`flex size-[68px] items-center justify-center rounded-full font-display text-[26px] font-bold text-white shadow-[0_0_0_8px_#f4f2ee] ${dots[i]}`}
            >
              {i + 1}
            </span>
            <h3 className="font-display text-2xl font-bold">{step.t}</h3>
            <p className="leading-relaxed text-muted">{step.d}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
