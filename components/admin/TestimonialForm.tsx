import { ActionForm } from "./ActionForm";
import { Check, Field, Fieldset, TextArea } from "./fields";
import { saveTestimonial } from "@/app/admin/actions";

export type TestimonialRecord = {
  id: string;
  name: string;
  area: string;
  quote_en: string;
  quote_ta: string;
  permission_received: boolean;
  permission_date: string | null;
  published: boolean;
  sort: number;
};

export function TestimonialForm({ t }: { t?: TestimonialRecord }) {
  return (
    <ActionForm action={saveTestimonial.bind(null, t?.id ?? null)} submitLabel={t ? "Save changes" : "Add testimonial"}>
      <Fieldset title="Client">
        <Field label="Client name" name="name" defaultValue={t?.name} required hint="As the client agreed to be named, e.g. R. Kumar." />
        <Field label="Area" name="area" defaultValue={t?.area} placeholder="e.g. Coimbatore" />
      </Fieldset>
      <Fieldset title="Quote">
        <TextArea label="Quote (English)" name="quote_en" rows={5} defaultValue={t?.quote_en} />
        <TextArea label="Quote (Tamil)" name="quote_ta" rows={5} lang="ta" defaultValue={t?.quote_ta} hint="Leave empty to show the English quote." />
      </Fieldset>
      <Fieldset title="Permission and publishing" cols={1}>
        <p className="text-sm leading-6 text-muted">
          Only publish real words from a real client who has given written permission (a signed note,
          email or WhatsApp message). Keep a copy of that permission.
        </p>
        <Check label="Written permission received" name="permission_received" defaultChecked={t?.permission_received} />
        <Field label="Date permission received" name="permission_date" type="date" defaultValue={t?.permission_date} />
        <Check label="Published on the website" name="published" defaultChecked={t?.published} hint="Needs permission and a date." />
        <Field label="Order" name="sort" type="number" defaultValue={t?.sort ?? 0} hint="Lower numbers show first." />
      </Fieldset>
    </ActionForm>
  );
}
