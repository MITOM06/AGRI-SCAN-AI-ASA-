/**
 * Guide content in the mobile app: the handbook (app/tips.tsx) and the
 * first-run intro (app/onboarding.tsx).
 */

/** Handbook — the article list is still static data inside the screen. */
export const tips = {
  title: "The Agri-Scan Handbook",
  subtitle:
    "Expert knowledge, fertilising tips and plant-care advice in one place.",
  searchPlaceholder: "Search articles and tips...",
  author: "By AgriExpert",

  catFertilizer: "Fertiliser",
  catIrrigation: "Irrigation",
  catPests: "Pests & disease",
  readMinutes: "{minutes} min read",

  post1Title: "How to compost at home without any smell",
  post2Title: "The right watering schedule for durian in the dry season",
  post3Title: "Keeping thrips off your roses in hot weather",
} as const;

/** The three intro slides shown on first launch. */
export const onboarding = {
  skip: "Skip",
  start: "Get started",

  slide1Title: "Accurate photo scanning",
  slide1Desc:
    "One photo is all it takes — the AI recognises over 500 plant diseases instantly.",
  slide2Title: "A plant doctor, 24/7",
  slide2Desc:
    "The AI assistant answers your questions and suggests safe, biological treatment plans.",
  slide3Title: "A community of farmers",
  slide3Desc:
    "Connect, share experience and learn growing techniques from thousands of experts.",
} as const;
