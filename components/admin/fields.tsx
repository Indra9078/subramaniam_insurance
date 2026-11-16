import type { ReactNode } from "react";

/** Plain form fields for the admin area. Large tap targets for phone use. */
const input =
  "min-h-12 w-full rounded-[12px] border border-[#cfccd6] bg-white px-3.5 text-base focus:border-iris-500 focus:outline-none focus:ring-2 focus:ring-iris-200";

export function Field({
  label,
  name,
  defaultValue,
  hint,
  required,
  type = "text",
  lang,
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue?: string | number | null;
  hint?: string;
  required?: boolean;
  type?: string;
  lang?: string;
  placeholder?: string;
}) {
  return (
    <label className="flex min-w-0 flex-col gap-1.5">
      <span className="text-sm font-semibold">
        {label}
        {required && <span className="text-ember"> *</span>}
      </span>
      <input
        name={name}
        type={type}
        lang={lang}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue ?? ""}
        className={input}
      />
      {hint && <span className="text-xs text-muted">{hint}</span>}
    </label>
  );
}

export function TextArea({
  label,
  name,
  defaultValue,
  hint,
  rows = 4,
  lang,
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  hint?: string;
  rows?: number;
  lang?: string;
  required?: boolean;
}) {
  return (
    <label className="flex min-w-0 flex-col gap-1.5">
      <span className="text-sm font-semibold">
        {label}
        {required && <span className="text-ember"> *</span>}
      </span>
      <textarea
        name={name}
        rows={rows}
        lang={lang}
        required={required}
        defaultValue={defaultValue ?? ""}
        className={`${input} py-3 leading-relaxed`}
      />
      {hint && <span className="text-xs text-muted">{hint}</span>}
    </label>
  );
}

export function Select({
  label,
  name,
  defaultValue,
  options,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="flex min-w-0 flex-col gap-1.5">
      <span className="text-sm font-semibold">{label}</span>
      <select name={name} defaultValue={defaultValue} className={input}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function Check({
  label,
  name,
  defaultChecked,
  hint,
}: {
  label: string;
  name: string;
  defaultChecked?: boolean;
  hint?: string;
}) {
  return (
    <label className="flex items-start gap-3 rounded-[12px] border border-line bg-white p-3.5">
      <input name={name} type="checkbox" defaultChecked={defaultChecked} className="mt-0.5 size-5 shrink-0" />
      <span className="flex flex-col gap-0.5">
        <span className="text-sm font-semibold">{label}</span>
        {hint && <span className="text-xs text-muted">{hint}</span>}
      </span>
    </label>
  );
}

/** A titled group of fields. */
export function Fieldset({ title, children, cols = 2 }: { title: string; children: ReactNode; cols?: 1 | 2 }) {
  return (
    <fieldset className="flex flex-col gap-4 rounded-[1.25rem] border border-line bg-white/60 p-4 md:p-6">
      <legend className="px-1 font-display text-lg font-bold">{title}</legend>
      <div className={cols === 2 ? "grid gap-4 md:grid-cols-2" : "flex flex-col gap-4"}>{children}</div>
    </fieldset>
  );
}

export function PageTitle({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <h1 className="font-display text-2xl font-bold md:text-3xl">{title}</h1>
      {children}
    </div>
  );
}

export function Badge({ children, tone = "grey" }: { children: ReactNode; tone?: "grey" | "green" | "orange" | "purple" }) {
  const tones = {
    grey: "bg-[#ecebef] text-muted",
    green: "bg-[#e1f4e8] text-[#1f7a46]",
    orange: "bg-[#ffe9df] text-ember",
    purple: "bg-iris-100 text-[#3f2fb0]",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${tones[tone]}`}>
      {children}
    </span>
  );
}

export function Loading() {
  return <p className="text-muted">Loading…</p>;
}
