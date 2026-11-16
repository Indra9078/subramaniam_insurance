import { ActionForm } from "./ActionForm";
import { Check, Field, Fieldset, Select, TextArea } from "./fields";
import { saveFaq } from "@/app/admin/actions";
import { faqCategories } from "@/lib/types";

export const faqCategoryLabels: Record<string, string> = {
  general: "General",
  health: "Health insurance",
  life: "Life insurance",
  vehicle: "Vehicle insurance",
  corporate: "Corporate and group insurance",
  real_estate: "Real estate",
};

export type FaqRecord = {
  id: string;
  category: string;
  question_en: string;
  question_ta: string;
  answer_en: string;
  answer_ta: string;
  sort: number;
  published: boolean;
  show_on_home: boolean;
  is_sample: boolean;
};

export function FaqForm({ f }: { f?: FaqRecord }) {
  return (
    <ActionForm action={saveFaq.bind(null, f?.id ?? null)} submitLabel={f ? "Save changes" : "Add FAQ"}>
      <Fieldset title="Where it shows">
        <Select
          label="Category"
          name="category"
          defaultValue={f?.category ?? "general"}
          options={faqCategories.map((c) => ({ value: c, label: faqCategoryLabels[c] }))}
        />
        <Field label="Order" name="sort" type="number" defaultValue={f?.sort ?? 0} hint="Lower numbers show first." />
        <Check label="Published" name="published" defaultChecked={f?.published ?? true} />
        <Check
          label="Also show on the home page"
          name="show_on_home"
          defaultChecked={f?.show_on_home}
          hint="Keep it to about four questions."
        />
      </Fieldset>
      <Fieldset title="Question and answer">
        <Field label="Question (English)" name="question_en" defaultValue={f?.question_en} required />
        <Field label="Question (Tamil)" name="question_ta" lang="ta" defaultValue={f?.question_ta} />
        <TextArea label="Answer (English)" name="answer_en" rows={6} defaultValue={f?.answer_en} required />
        <TextArea label="Answer (Tamil)" name="answer_ta" rows={6} lang="ta" defaultValue={f?.answer_ta} />
      </Fieldset>
      <p className="text-sm text-muted">
        Insurance answers should stay general (no prices, no promises about claims). Each product page already shows a
        &quot;subject to policy terms&quot; note.
      </p>
    </ActionForm>
  );
}
