/**
 * SAMPLE LISTINGS. Every field is a placeholder until real listings come from
 * the admin page (Stage 5, Supabase). The shape mirrors the planned table:
 * one row per listing with English and Tamil text.
 */
export type ListingType = "plot" | "house" | "apartment" | "commercial";
type Text = { en: string; ta: string };

export type Listing = {
  id: string;
  type: ListingType;
  location: Text;
  title: Text;
  price: Text;
  size: Text;
  description: Text;
  features: { en: string[]; ta: string[] };
  cover: string;
};

const chennai = { en: "Chennai", ta: "சென்னை" };
const coimbatore = { en: "Coimbatore", ta: "கோயம்புத்தூர்" };
const madurai = { en: "Madurai", ta: "மதுரை" };
const price = { en: "₹ [00,00,000]", ta: "₹ [00,00,000]" };
const description = {
  en: "Sample description. The client adds the real details, approvals and photos from the admin page.",
  ta: "மாதிரி விளக்கம். உண்மையான விவரங்கள், அனுமதிகள் மற்றும் படங்களை வாடிக்கையாளர் அட்மின் பக்கத்தில் சேர்ப்பார்.",
};

export const listings: Listing[] = [
  {
    id: "sample-plot-1",
    type: "plot",
    location: coimbatore,
    title: { en: "Residential plot near main road", ta: "பிரதான சாலை அருகே குடியிருப்பு மனை" },
    price,
    size: { en: "[1,200] sq ft", ta: "[1,200] சதுர அடி" },
    description,
    features: {
      en: ["Clear title (to verify)", "Road access", "Water and power nearby"],
      ta: ["தெளிவான பட்டா (சரிபார்க்க)", "சாலை வசதி", "அருகில் தண்ணீர் மற்றும் மின்சாரம்"],
    },
    cover: "from-iris-100 to-[#ffe9df]",
  },
  {
    id: "sample-house-1",
    type: "house",
    location: madurai,
    title: { en: "2 BHK independent house", ta: "2 BHK தனி வீடு" },
    price,
    size: { en: "[1,100] sq ft", ta: "[1,100] சதுர அடி" },
    description,
    features: {
      en: ["2 bedrooms", "Car parking", "Close to schools"],
      ta: ["2 படுக்கையறைகள்", "கார் நிறுத்தம்", "பள்ளிகள் அருகில்"],
    },
    cover: "from-iris-100 to-[#e7f5ec]",
  },
  {
    id: "sample-apartment-1",
    type: "apartment",
    location: chennai,
    title: { en: "3 BHK apartment with lift", ta: "லிஃப்ட் வசதியுடன் 3 BHK அடுக்குமாடி" },
    price,
    size: { en: "[1,450] sq ft", ta: "[1,450] சதுர அடி" },
    description,
    features: {
      en: ["3 bedrooms", "Lift and power backup", "Covered parking"],
      ta: ["3 படுக்கையறைகள்", "லிஃப்ட் மற்றும் மின் காப்பு", "மூடிய வாகன நிறுத்தம்"],
    },
    cover: "from-iris-100 to-[#ffe0d2]",
  },
  {
    id: "sample-commercial-1",
    type: "commercial",
    location: chennai,
    title: { en: "Ground floor shop space", ta: "தரை தள கடை இடம்" },
    price,
    size: { en: "[600] sq ft", ta: "[600] சதுர அடி" },
    description,
    features: {
      en: ["Main road frontage", "Suitable for retail", "Shared parking"],
      ta: ["பிரதான சாலை முகப்பு", "சில்லறை வணிகத்திற்கு ஏற்றது", "பொது வாகன நிறுத்தம்"],
    },
    cover: "from-iris-100 to-[#fff3cf]",
  },
  {
    id: "sample-plot-2",
    type: "plot",
    location: madurai,
    title: { en: "Corner plot in a gated layout", ta: "கேட்டட் லேஅவுட்டில் மூலை மனை" },
    price,
    size: { en: "[2,400] sq ft", ta: "[2,400] சதுர அடி" },
    description,
    features: {
      en: ["Corner plot", "Gated layout", "Approval to verify"],
      ta: ["மூலை மனை", "கேட்டட் லேஅவுட்", "அனுமதி சரிபார்க்க"],
    },
    cover: "from-iris-100 to-[#e7f5ec]",
  },
  {
    id: "sample-house-2",
    type: "house",
    location: coimbatore,
    title: { en: "3 BHK villa with garden", ta: "தோட்டத்துடன் 3 BHK வில்லா" },
    price,
    size: { en: "[1,800] sq ft", ta: "[1,800] சதுர அடி" },
    description,
    features: {
      en: ["3 bedrooms", "Garden", "Quiet street"],
      ta: ["3 படுக்கையறைகள்", "தோட்டம்", "அமைதியான தெரு"],
    },
    cover: "from-iris-100 to-[#ffe9df]",
  },
];

export const getListing = (id: string) => listings.find((l) => l.id === id);
