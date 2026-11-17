import { ActionForm } from "./ActionForm";
import { Check, Field, Fieldset, Select, TextArea } from "./fields";
import { saveProduct } from "@/app/admin/actions";
import { insurers } from "@/lib/site";
import { planCategories } from "@/lib/types";

export type ProductRecord = {
  id: string;
  slug: string;
  category: string;
  insurer: string;
  status: string;
  featured: boolean;
  sort: number;
  name_en: string;
  name_ta: string;
  summary_en: string;
  summary_ta: string;
  description_en: string;
  description_ta: string;
  features_en: string[];
  features_ta: string[];
  image_path: string | null;
  is_sample: boolean;
};

export const categoryLabels: Record<string, string> = {
  health: "Health insurance",
  life: "Life insurance",
  vehicle: "Vehicle insurance",
  corporate: "Corporate and group",
};

export function ProductForm({ product }: { product?: ProductRecord }) {
  const p = product;
  return (
    <ActionForm action={saveProduct.bind(null, p?.id ?? null)} submitLabel={p ? "Save changes" : "Create plan"}>
      <Fieldset title="Basics">
        <Select label="Category" name="category" defaultValue={p?.category ?? "health"} options={planCategories.map((c) => ({ value: c, label: categoryLabels[c] }))} />
        <Select
          label="Status"
          name="status"
          defaultValue={p?.status ?? "draft"}
          options={[
            { value: "draft", label: "Draft (hidden from the website)" },
            { value: "published", label: "Published" },
          ]}
        />
        <label className="flex min-w-0 flex-col gap-1.5">
          <span className="text-sm font-semibold">Insurer</span>
          <input name="insurer" list="insurer-list" defaultValue={p?.insurer ?? ""} placeholder="e.g. Star Health Insurance"
            className="min-h-12 w-full rounded-[12px] border border-[#cfccd6] bg-white px-3.5 text-base focus:border-iris-500 focus:outline-none focus:ring-2 focus:ring-iris-200" />
          <datalist id="insurer-list">
            {insurers.map((i) => <option key={i} value={i} />)}
          </datalist>
          <span className="text-xs text-muted">Use the official company name.</span>
        </label>
        <Field label="Web address (slug)" name="slug" defaultValue={p?.slug} hint="Leave empty to create it from the English name." />
        <Field label="Order" name="sort" type="number" defaultValue={p?.sort ?? 0} hint="Lower numbers show first." />
        <Check label="Featured" name="featured" defaultChecked={p?.featured} hint="Featured plans are listed first." />
      </Fieldset>

      <Fieldset title="Name and summary">
        <Field label="Name (English)" name="name_en" defaultValue={p?.name_en} required />
        <Field label="Name (Tamil)" name="name_ta" lang="ta" defaultValue={p?.name_ta} hint="Leave empty to show the English name." />
        <TextArea label="Short summary (English)" name="summary_en" rows={2} defaultValue={p?.summary_en} hint="One sentence shown on the plan card." />
        <TextArea label="Short summary (Tamil)" name="summary_ta" rows={2} lang="ta" defaultValue={p?.summary_ta} />
      </Fieldset>

      <Fieldset title="Details">
        <TextArea label="Description (English)" name="description_en" rows={6} defaultValue={p?.description_en} />
        <TextArea label="Description (Tamil)" name="description_ta" rows={6} lang="ta" defaultValue={p?.description_ta} />
        <TextArea label="Key benefits (English)" name="features_en" rows={5} defaultValue={p?.features_en.join("\n")} hint="One benefit per line." />
        <TextArea label="Key benefits (Tamil)" name="features_ta" rows={5} lang="ta" defaultValue={p?.features_ta.join("\n")} hint="One benefit per line." />
      </Fieldset>
      <p className="text-sm text-muted">
        Keep the wording general: no premiums, no promises about claims. Every plan page already carries a &quot;subject to policy terms&quot; note.
      </p>
    </ActionForm>
  );
}
