/** Scrolling band. Items are rendered twice so the loop is seamless. */
export function Marquee({ items }: { items: string[] }) {
  const row = (hidden: boolean) => (
    <div
      className="flex shrink-0 gap-10 pr-10 md:gap-14 md:pr-14"
      aria-hidden={hidden || undefined}
    >
      {items.map((item, i) => (
        <span key={i} className="flex gap-10 md:gap-14">
          <span>{item}</span>
          <span aria-hidden="true">✦</span>
        </span>
      ))}
    </div>
  );

  return (
    <div className="overflow-hidden bg-ember text-white">
      <div className="flex w-max animate-marquee whitespace-nowrap py-4 font-display text-xl font-bold md:py-5 md:text-2xl">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
