import type { Plan } from "@/lib/types";

/**
 * SAMPLE PLANS. Shown on /insurance until the database has plans (and while the
 * Stage 9 migration has not been run). Every one is marked as a sample, so it glows
 * as a placeholder. The same data is in supabase/seed_products.sql.
 * Generated from design data; edit plans in the admin (Products) instead.
 */
export const samplePlans: Plan[] = [
  {
    "id": "sample-family-health-shield",
    "slug": "sample-family-health-shield",
    "category": "health",
    "insurer": "Star Health Insurance",
    "featured": true,
    "name": {
      "en": "Family Health Shield",
      "ta": "குடும்ப ஆரோக்கிய கவசம்"
    },
    "summary": {
      "en": "Hospital cover for the whole family in one plan.",
      "ta": "முழு குடும்பத்திற்கும் ஒரே திட்டத்தில் மருத்துவமனை காப்பீடு."
    },
    "description": {
      "en": "A floater plan that covers hospital stays and treatment for you, your spouse and children under one sum insured. Sample content: the client adds the real plan details.",
      "ta": "உங்களுக்கும் துணைவர் மற்றும் குழந்தைகளுக்கும் ஒரே காப்பீட்டு தொகையில் மருத்துவமனை சிகிச்சையை உள்ளடக்கும் குடும்ப திட்டம். மாதிரி உள்ளடக்கம்: உண்மையான திட்ட விவரங்களை வாடிக்கையாளர் சேர்ப்பார்."
    },
    "features": {
      "en": [
        "Hospital stay and treatment",
        "Cashless treatment at network hospitals",
        "Day care procedures",
        "Pre and post hospitalisation costs"
      ],
      "ta": [
        "மருத்துவமனையில் தங்குதல் மற்றும் சிகிச்சை",
        "நெட்வொர்க் மருத்துவமனைகளில் பணமில்லா சிகிச்சை",
        "டே கேர் சிகிச்சைகள்",
        "மருத்துவமனைக்கு முன் மற்றும் பின் செலவுகள்"
      ]
    },
    "image": null,
    "isSample": true
  },
  {
    "id": "sample-senior-care-cover",
    "slug": "sample-senior-care-cover",
    "category": "health",
    "insurer": "Star Health Insurance",
    "featured": false,
    "name": {
      "en": "Senior Care Cover",
      "ta": "மூத்தோர் பராமரிப்பு காப்பீடு"
    },
    "summary": {
      "en": "Health cover designed for parents and senior citizens.",
      "ta": "பெற்றோர் மற்றும் மூத்த குடிமக்களுக்கான ஆரோக்கிய காப்பீடு."
    },
    "description": {
      "en": "A health plan for people above 60, with cover for hospital stays and regular health check-ups. Sample content: the client adds the real plan details.",
      "ta": "60 வயதிற்கு மேற்பட்டோருக்கான ஆரோக்கிய திட்டம், மருத்துவமனை சிகிச்சை மற்றும் வழக்கமான உடல் பரிசோதனைகளுடன். மாதிரி உள்ளடக்கம்: உண்மையான திட்ட விவரங்களை வாடிக்கையாளர் சேர்ப்பார்."
    },
    "features": {
      "en": [
        "Hospital stay and treatment",
        "Annual health check-up",
        "Ambulance charges",
        "Cashless treatment at network hospitals"
      ],
      "ta": [
        "மருத்துவமனையில் தங்குதல் மற்றும் சிகிச்சை",
        "ஆண்டு உடல் பரிசோதனை",
        "ஆம்புலன்ஸ் கட்டணம்",
        "நெட்வொர்க் மருத்துவமனைகளில் பணமில்லா சிகிச்சை"
      ]
    },
    "image": null,
    "isSample": true
  },
  {
    "id": "sample-term-protection-plan",
    "slug": "sample-term-protection-plan",
    "category": "life",
    "insurer": "LIC",
    "featured": true,
    "name": {
      "en": "Term Protection Plan",
      "ta": "டெர்ம் பாதுகாப்பு திட்டம்"
    },
    "summary": {
      "en": "Pure life cover to protect your family's income.",
      "ta": "உங்கள் குடும்பத்தின் வருமானத்தை பாதுகாக்கும் தூய ஆயுள் காப்பீடு."
    },
    "description": {
      "en": "A term plan that pays your family a lump sum if something happens to you during the policy term. Sample content: the client adds the real plan details.",
      "ta": "பாலிசி காலத்தில் உங்களுக்கு ஏதாவது நேர்ந்தால் உங்கள் குடும்பத்திற்கு ஒரு தொகையை வழங்கும் டெர்ம் திட்டம். மாதிரி உள்ளடக்கம்: உண்மையான திட்ட விவரங்களை வாடிக்கையாளர் சேர்ப்பார்."
    },
    "features": {
      "en": [
        "Pure protection for your family",
        "Choose your cover amount and term",
        "Nominee benefit",
        "Tax benefits as per prevailing rules"
      ],
      "ta": [
        "உங்கள் குடும்பத்திற்கு தூய பாதுகாப்பு",
        "காப்பீட்டு தொகை மற்றும் காலத்தை தேர்ந்தெடுக்கலாம்",
        "நாமினி பலன்",
        "நடைமுறையில் உள்ள விதிகளின்படி வரி சலுகைகள்"
      ]
    },
    "image": null,
    "isSample": true
  },
  {
    "id": "sample-child-future-plan",
    "slug": "sample-child-future-plan",
    "category": "life",
    "insurer": "Tata AIA Life Insurance",
    "featured": false,
    "name": {
      "en": "Child Future Plan",
      "ta": "குழந்தை எதிர்கால திட்டம்"
    },
    "summary": {
      "en": "Save for your child's education and big goals.",
      "ta": "உங்கள் குழந்தையின் கல்வி மற்றும் பெரிய இலக்குகளுக்கு சேமியுங்கள்."
    },
    "description": {
      "en": "A savings plan that builds a fund for your child's education or marriage, with protection for the parent. Sample content: the client adds the real plan details.",
      "ta": "பெற்றோருக்கான பாதுகாப்புடன், குழந்தையின் கல்வி அல்லது திருமணத்திற்கான நிதியை உருவாக்கும் சேமிப்பு திட்டம். மாதிரி உள்ளடக்கம்: உண்மையான திட்ட விவரங்களை வாடிக்கையாளர் சேர்ப்பார்."
    },
    "features": {
      "en": [
        "Regular savings towards a goal",
        "Protection if the parent is not around",
        "Payouts timed for school and college",
        "Flexible premium payment options"
      ],
      "ta": [
        "இலக்கிற்கான வழக்கமான சேமிப்பு",
        "பெற்றோர் இல்லாத நிலையில் பாதுகாப்பு",
        "பள்ளி மற்றும் கல்லூரி நேரத்திற்கான தொகை",
        "நெகிழ்வான பிரீமியம் செலுத்தும் வாய்ப்புகள்"
      ]
    },
    "image": null,
    "isSample": true
  },
  {
    "id": "sample-retirement-income-plan",
    "slug": "sample-retirement-income-plan",
    "category": "life",
    "insurer": "HDFC Life Insurance",
    "featured": false,
    "name": {
      "en": "Retirement Income Plan",
      "ta": "ஓய்வூதிய வருமான திட்டம்"
    },
    "summary": {
      "en": "A steady income for your retirement years.",
      "ta": "ஓய்வு காலத்திற்கு நிலையான வருமானம்."
    },
    "description": {
      "en": "A pension-style plan that builds a corpus while you work and pays you a regular income after retirement. Sample content: the client adds the real plan details.",
      "ta": "நீங்கள் பணிபுரியும்போது நிதியை உருவாக்கி, ஓய்விற்கு பிறகு வழக்கமான வருமானம் தரும் ஓய்வூதிய வகை திட்டம். மாதிரி உள்ளடக்கம்: உண்மையான திட்ட விவரங்களை வாடிக்கையாளர் சேர்ப்பார்."
    },
    "features": {
      "en": [
        "Regular income after retirement",
        "Build a corpus over the years",
        "Choose when payouts start",
        "Cover for your spouse, where available"
      ],
      "ta": [
        "ஓய்விற்கு பிறகு வழக்கமான வருமானம்",
        "ஆண்டுகளில் நிதியை உருவாக்குதல்",
        "தொகை தொடங்கும் நேரத்தை தேர்ந்தெடுக்கலாம்",
        "கிடைக்கும் இடங்களில் துணைவருக்கான காப்பீடு"
      ]
    },
    "image": null,
    "isSample": true
  },
  {
    "id": "sample-car-comprehensive-cover",
    "slug": "sample-car-comprehensive-cover",
    "category": "vehicle",
    "insurer": "IFFCO-Tokio General Insurance",
    "featured": true,
    "name": {
      "en": "Car Comprehensive Cover",
      "ta": "கார் முழுமையான காப்பீடு"
    },
    "summary": {
      "en": "Own damage and third-party cover for your car.",
      "ta": "உங்கள் காருக்கு சொந்த சேதம் மற்றும் மூன்றாம் தரப்பு காப்பீடு."
    },
    "description": {
      "en": "A comprehensive car policy covering accidents, fire, theft and third-party liability, with easy renewals. Sample content: the client adds the real plan details.",
      "ta": "விபத்து, தீ, திருட்டு மற்றும் மூன்றாம் தரப்பு பொறுப்பை உள்ளடக்கும் முழுமையான கார் பாலிசி, எளிதான புதுப்பித்தலுடன். மாதிரி உள்ளடக்கம்: உண்மையான திட்ட விவரங்களை வாடிக்கையாளர் சேர்ப்பார்."
    },
    "features": {
      "en": [
        "Accident, fire and theft cover",
        "Third-party liability",
        "Optional add-ons such as zero depreciation",
        "Easy online renewal"
      ],
      "ta": [
        "விபத்து, தீ மற்றும் திருட்டு காப்பீடு",
        "மூன்றாம் தரப்பு பொறுப்பு",
        "ஜீரோ டெப்ரிசியேஷன் போன்ற விருப்ப கூடுதல்கள்",
        "எளிதான ஆன்லைன் புதுப்பித்தல்"
      ]
    },
    "image": null,
    "isSample": true
  },
  {
    "id": "sample-two-wheeler-secure",
    "slug": "sample-two-wheeler-secure",
    "category": "vehicle",
    "insurer": "United India Insurance",
    "featured": false,
    "name": {
      "en": "Two-Wheeler Secure",
      "ta": "இருசக்கர வாகன பாதுகாப்பு"
    },
    "summary": {
      "en": "Cover for your bike or scooter, from basic to comprehensive.",
      "ta": "உங்கள் பைக் அல்லது ஸ்கூட்டருக்கு அடிப்படை முதல் முழுமையான காப்பீடு."
    },
    "description": {
      "en": "A two-wheeler policy with third-party cover as required by law and optional own-damage protection. Sample content: the client adds the real plan details.",
      "ta": "சட்டப்படி தேவையான மூன்றாம் தரப்பு காப்பீடு மற்றும் விருப்ப சொந்த சேத பாதுகாப்புடன் இருசக்கர வாகன பாலிசி. மாதிரி உள்ளடக்கம்: உண்மையான திட்ட விவரங்களை வாடிக்கையாளர் சேர்ப்பார்."
    },
    "features": {
      "en": [
        "Third-party liability cover",
        "Optional own damage cover",
        "Personal accident cover for the owner",
        "Quick renewal support"
      ],
      "ta": [
        "மூன்றாம் தரப்பு பொறுப்பு காப்பீடு",
        "விருப்ப சொந்த சேத காப்பீடு",
        "உரிமையாளருக்கான தனிநபர் விபத்து காப்பீடு",
        "விரைவான புதுப்பித்தல் உதவி"
      ]
    },
    "image": null,
    "isSample": true
  },
  {
    "id": "sample-group-health-teams",
    "slug": "sample-group-health-teams",
    "category": "corporate",
    "insurer": "Star Health Insurance",
    "featured": false,
    "name": {
      "en": "Group Health for Teams",
      "ta": "குழுக்களுக்கான குழு ஆரோக்கியம்"
    },
    "summary": {
      "en": "Health cover for your employees under one policy.",
      "ta": "உங்கள் ஊழியர்களுக்கு ஒரே பாலிசியில் ஆரோக்கிய காப்பீடு."
    },
    "description": {
      "en": "A group health policy for small and medium businesses, with options to add family members. Sample content: the client adds the real plan details.",
      "ta": "சிறு மற்றும் நடுத்தர தொழில்களுக்கான குழு ஆரோக்கிய பாலிசி, குடும்ப உறுப்பினர்களை சேர்க்கும் வாய்ப்புடன். மாதிரி உள்ளடக்கம்: உண்மையான திட்ட விவரங்களை வாடிக்கையாளர் சேர்ப்பார்."
    },
    "features": {
      "en": [
        "One policy for the whole team",
        "Hospital cover for every employee",
        "Option to add family members",
        "Simple onboarding for new joiners"
      ],
      "ta": [
        "முழு குழுவிற்கும் ஒரே பாலிசி",
        "ஒவ்வொரு ஊழியருக்கும் மருத்துவமனை காப்பீடு",
        "குடும்ப உறுப்பினர்களை சேர்க்கும் வாய்ப்பு",
        "புதிய ஊழியர்களுக்கு எளிய சேர்க்கை"
      ]
    },
    "image": null,
    "isSample": true
  }
];
