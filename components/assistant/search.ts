/**
 * Keyword search for the guided assistant. Matches whole words and word starts,
 * so Tamil words with endings ("காப்பீட்டிற்கு") still match their stem ("காப்பீடு").
 */
const STOP = new Set(
  "the a an is to for my i do how what can you of in on and me about with your it be are does need want get please is there have".split(" "),
);

export function tokens(text: string) {
  return text
    .toLowerCase()
    .normalize("NFC")
    .split(/[^\p{L}\p{M}\p{N}]+/u)
    .filter((t) => t.length >= 2 && !STOP.has(t));
}

function wordScore(q: string, words: string[]) {
  let best = 0;
  for (const w of words) {
    if (w === q) return 3;
    if (Math.min(w.length, q.length) >= 3 && (w.startsWith(q) || q.startsWith(w))) best = Math.max(best, 2);
    else if (q.length >= 4 && w.length >= 4 && w.slice(0, 4) === q.slice(0, 4)) best = Math.max(best, 1);
  }
  return best;
}

/** `words` are the title and keywords; `extra` (e.g. an FAQ answer) counts half. */
export type SearchEntry<T> = { item: T; words: string[]; extra?: string[]; boost?: number };

/**
 * Best matches first. An entry needs a score of at least 2, and at least half
 * the top score, so one strong match is not buried under weak ones.
 */
export function search<T>(query: string, entries: SearchEntry<T>[], limit = 4) {
  const q = tokens(query);
  if (!q.length) return [];
  const scored = entries
    .map((e) => ({
      e,
      score:
        q.reduce((sum, t) => sum + Math.max(wordScore(t, e.words), wordScore(t, e.extra ?? []) / 2), 0) *
        (e.boost ?? 1),
    }))
    .filter((r) => r.score >= 2)
    .sort((a, b) => b.score - a.score);
  const top = scored[0]?.score ?? 0;
  return scored
    .filter((r) => r.score >= top / 2)
    .slice(0, limit)
    .map((r) => r.e.item);
}

/** Extra words (English, Tamil and Tanglish) that point to each topic. */
export const TOPIC_WORDS: Record<string, string> = {
  health:
    "health medical medicine hospital hospitalisation mediclaim star family parents senior citizen surgery treatment cashless aarogya maruthuvam ஆரோக்கிய ஆரோக்கியம் மருத்துவ மருத்துவமனை மருத்துவம் பெற்றோர் குடும்ப சிகிச்சை ஸ்டார்",
  life:
    "life lic term pension retirement child children education savings endowment death nominee aayul ஆயுள் எல்ஐசி ஓய்வூதியம் சேமிப்பு குழந்தை நாமினி டெர்ம்",
  vehicle:
    "vehicle car bike scooter two wheeler motor auto taxi lorry truck renew renewal third party accident ncb vandi வாகன வாகனம் கார் பைக் வண்டி இருசக்கர புதுப்பி புதுப்பித்தல் விபத்து",
  corporate:
    "group company corporate business employees staff office factory shop team குழு நிறுவன நிறுவனம் ஊழியர் ஊழியர்கள் தொழில் கடை",
  property:
    "property plot land house home flat apartment villa site rent buy sell commercial shop real estate veedu nilam manai இடம் மனை வீடு நிலம் சொத்து வாடகை அடுக்குமாடி வாங்க விற்க வில்லா",
  claims:
    "claim claims cashless reimbursement settlement bill hospital discharge கிளைம் க்ளைம் பில் டிஸ்சார்ஜ்",
  talk:
    "call talk phone mobile number whatsapp contact speak agent advisor meet office அழை அழைக்க தொடர்பு பேச வாட்ஸ்அப் எண் அலுவலகம்",
  documents: "documents document papers proof id aadhaar rc licence ஆவண ஆவணங்கள் சான்று",
};
