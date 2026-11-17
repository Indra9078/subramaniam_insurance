import { ActionForm } from "./ActionForm";
import { Check, Field, Fieldset, Select, TextArea } from "./fields";
import { saveListing } from "@/app/admin/actions";
import { listingTypes } from "@/lib/types";

export type ListingRecord = {
  id: string;
  slug: string;
  type: string;
  status: string;
  featured: boolean;
  sort: number;
  title_en: string;
  title_ta: string;
  location_en: string;
  location_ta: string;
  price_en: string;
  price_ta: string;
  size_en: string;
  size_ta: string;
  description_en: string;
  description_ta: string;
  features_en: string[];
  features_ta: string[];
  is_sample: boolean;
};

const typeLabels: Record<string, string> = {
  plot: "Plot",
  house: "House",
  apartment: "Apartment",
  commercial: "Commercial",
};

/** English and Tamil fields side by side (stacked on phones). */
export function ListingForm({ listing }: { listing?: ListingRecord }) {
  const l = listing;
  return (
    <ActionForm action={saveListing.bind(null, l?.id ?? null)} submitLabel={l ? "Save changes" : "Create listing"}>
      <Fieldset title="Basics">
        <Select
          label="Property type"
          name="type"
          defaultValue={l?.type ?? "plot"}
          options={listingTypes.map((t) => ({ value: t, label: typeLabels[t] }))}
        />
        <Select
          label="Status"
          name="status"
          defaultValue={l?.status ?? "draft"}
          options={[
            { value: "draft", label: "Draft (hidden from the website)" },
            { value: "pending", label: "Pending approval (hidden)" },
            { value: "published", label: "Published" },
            { value: "sold", label: "Sold (still shown, marked sold)" },
            { value: "rejected", label: "Rejected (hidden, owner sees the note)" },
          ]}
        />
        <Field
          label="Web address (slug)"
          name="slug"
          defaultValue={l?.slug}
          hint="Leave empty to create it from the English title. Lowercase letters, numbers and dashes."
        />
        <Field label="Order" name="sort" type="number" defaultValue={l?.sort ?? 0} hint="Lower numbers show first." />
        <Check
          label="Featured on the home page"
          name="featured"
          defaultChecked={l?.featured}
          hint="The first three featured, published listings appear on the home page."
        />
      </Fieldset>

      <Fieldset title="Title and details">
        <Field label="Title (English)" name="title_en" defaultValue={l?.title_en} required />
        <Field label="Title (Tamil)" name="title_ta" lang="ta" defaultValue={l?.title_ta} hint="Leave empty to show the English title." />
        <Field label="Location (English)" name="location_en" defaultValue={l?.location_en} placeholder="e.g. Coimbatore" />
        <Field label="Location (Tamil)" name="location_ta" lang="ta" defaultValue={l?.location_ta} />
        <Field label="Price (English)" name="price_en" defaultValue={l?.price_en} placeholder="e.g. ₹ 45,00,000 or Price on request" />
        <Field label="Price (Tamil)" name="price_ta" lang="ta" defaultValue={l?.price_ta} />
        <Field label="Size (English)" name="size_en" defaultValue={l?.size_en} placeholder="e.g. 1,200 sq ft" />
        <Field label="Size (Tamil)" name="size_ta" lang="ta" defaultValue={l?.size_ta} />
      </Fieldset>

      <Fieldset title="Description and features">
        <TextArea label="Description (English)" name="description_en" rows={6} defaultValue={l?.description_en} />
        <TextArea label="Description (Tamil)" name="description_ta" rows={6} lang="ta" defaultValue={l?.description_ta} />
        <TextArea
          label="Features (English)"
          name="features_en"
          rows={5}
          defaultValue={l?.features_en.join("\n")}
          hint="One feature per line."
        />
        <TextArea
          label="Features (Tamil)"
          name="features_ta"
          rows={5}
          lang="ta"
          defaultValue={l?.features_ta.join("\n")}
          hint="One feature per line."
        />
      </Fieldset>
    </ActionForm>
  );
}
