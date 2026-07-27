/**
 * Static pages: About, Terms, Privacy Policy.
 *
 * This is legal content — the English translation is for readers' convenience;
 * the Vietnamese version remains the binding one.
 */
export const privacy = {
  title: "Privacy Policy",
  intro:
    "Agri-Scan is committed to protecting your personal information and data while you use the platform.",
  lastUpdated: "Last updated: 20/03/2026",

  s1Title: "1. Information we collect",
  s1Item1: "Account details such as your name, email and hashed password.",
  s1Item2: "Plant images you upload.",
  s1Item3: "Scan history, interactions and usage data.",
  s1Item4: "Device and browser information, used to improve your experience.",

  s2Title: "2. How we use your data",
  s2Item1: "To analyse images and return plant disease diagnoses.",
  s2Item2: "To improve the platform and our AI models.",
  s2Item3: "To provide customer support and handle feedback.",
  s2Item4: "To deliver related features, alerts and updates.",

  s3Title: "3. Data security",
  s3Body:
    "We apply appropriate technical and organisational measures to protect your data against unauthorised access, loss or misuse.",

  s4Title: "4. Your rights",
  s4Item1: "View and update your personal information.",
  s4Item2: "Request deletion of your data or account.",
  s4Item3: "Opt out of certain non-essential notifications.",

  s5Title: "5. Data sharing",
  s5Body:
    "We do not sell your personal data. Data may only be shared with operational partners where necessary, or when lawfully requested by a competent authority.",

  ctaTitle: "Questions about privacy?",
  ctaDesc: "Get in touch if you'd like anything clarified.",
  ctaButton: "Contact support",
} as const;

export const terms = {
  title: "Terms of Use",
  intro:
    "Welcome to Agri-Scan. By accessing and using our application you agree to the terms and conditions below.",
  effectiveFrom: "Effective from: 20/03/2026",

  s1Title: "1. AI service & plant disease detection",
  s1Body:
    "Agri-Scan provides AI tools that analyse crop images to help detect pests, diseases, nutrient deficiencies and other common plant problems.",
  s1Item1: "Results are produced by AI models and their training data.",
  s1Item2:
    "The system assists with diagnosis but cannot guarantee absolute accuracy in every case.",

  s2Title: "2. Disclaimer",
  s2Body:
    "Please note: results and recommendations from Agri-Scan are for reference only.",
  s2Item1:
    "Users should combine them with real-world advice from an agricultural engineer or a suitable expert.",
  s2Item2:
    "We are not liable for damage arising from applying the system's recommendations directly.",

  s3Title: "3. Plans and payment",
  s3Body:
    "Agri-Scan may offer both free and paid plans depending on the features involved.",
  s3Item1: "Service fees are shown clearly before payment.",
  s3Item2: "Some plans renew automatically unless you cancel them.",
  s3Item3:
    "Refund policy depends on the plan and on the specific terms stated at the time of purchase.",

  s4Title: "4. Intellectual property",
  s4Body1:
    "Agri-Scan's content, interface, logo, data and technology belong to us or to our respective licensors.",
  s4Body2:
    "You may not copy, redistribute, modify or otherwise exploit any part of the system without permission.",

  s5Title: "5. Termination",
  s5Body:
    "We may suspend or terminate an account if we detect breaches of these terms, abuse of the system, or activity that harms the platform.",

  ctaTitle: "Need more help?",
  ctaDesc: "If you have questions about these terms, please get in touch.",
  ctaButton: "Send feedback",
} as const;

export const about = {
  badge: "Smart Agriculture 4.0",
  heroLine1: "An expert",
  heroLine2: "in every garden",
  heroSubtitle:
    "Agri-Scan AI combines artificial intelligence with deep agricultural knowledge, letting farmers diagnose crop diseases in seconds from a phone camera.",
  heroCta: "Try the AI now",
  heroImageAlt: "A farmer using the app",
  heroBadge1: "100,000+ disease samples analysed",
  heroBadge2: "Up to 98% accuracy",

  statAccuracy: "Accuracy",
  statPlantTypes: "Plant species",
  statSpeed: "Diagnosis time",
  statSupport: "Always-on support",

  storyImageAlt1: "A farmer",
  storyImageAlt2: "A field",
  storyEyebrow: "Our story",
  storyTitle: "From worries in the field to a technology solution",
  storyPara1:
    "Vietnam is an agricultural country, yet every year farmers still face heavy losses from pests and disease. Misdiagnosis, pesticide overuse and late detection often bring serious consequences for both harvests and the environment.",
  storyPara2Prefix:
    "Seeing that problem, the Agri-Scan AI team built a breakthrough solution:",
  storyPara2Strong: "an AI image-recognition app",
  storyPara2Suffix:
    "that diagnoses crop diseases instantly from a single phone photo.",
  storyPara3:
    "We don't just provide a tool — we put an “agricultural expert” in every farmer's pocket, available 24/7.",

  techEyebrow: "Technology",
  techTitle: "The power behind Agri-Scan",
  techSubtitle:
    "Our system is built on the most advanced technology available, delivering outstanding accuracy and speed.",
  tech1Desc:
    "A deep learning model trained on millions of diseased leaf images, able to spot even the faintest symptoms.",
  tech2Title: "Natural language processing",
  tech2Desc:
    "An integrated LLM lets the AI converse naturally, explaining causes and treatment steps in plain language.",
  tech3Title: "Real-time processing",
  tech3Desc:
    "A cloud-native architecture processes images and returns a diagnosis in under 2 seconds.",

  valuesEyebrow: "Core values",
  valuesTitle: "The compass for everything we do",
  valuesSubtitle:
    "We're committed to delivering real, practical value to Vietnamese agriculture.",
  value1Title: "Accurate & transparent",
  value1Desc:
    "Diagnoses are grounded in scientific data, and we always flag low-confidence results.",
  value2Title: "Farmer-centred",
  value2Desc:
    "A simple, easy interface that suits every age group and level of tech familiarity.",
  value3Title: "Sustainable",
  value3Desc:
    "We favour biological treatments and help reduce harmful chemical use.",
  value4Title: "In it for the long haul",
  value4Desc:
    "Beyond diagnosis, we track and advise throughout the plant's whole growth cycle.",

  ctaTitle: "Ready to protect your harvest?",
  ctaDesc:
    "Experience the power of AI for diagnosing and treating crop disease today. Core features are completely free.",
  ctaButton: "Start scanning now",
} as const;
