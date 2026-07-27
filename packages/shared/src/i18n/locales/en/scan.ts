/** AI diagnosis screen + chatbot. */
export const scan = {
  // Starter prompts
  suggestLeafDiagnosis: "Diagnose a disease from a leaf photo",
  suggestNpk: "How to apply NPK fertiliser to rice",
  suggestDurianSeason: "Planting calendar for durian",
  suggestNaturalPest: "Natural pest control tips",

  // Conversation history groups
  groupToday: "Today",
  groupYesterday: "Yesterday",
  group7Days: "Last 7 days",
  group30Days: "Last 30 days",

  // Diagnosis result
  unknownDisease: "Unidentified",
  resultHeading: "Diagnosis result",
  diseaseDetected: "Disease detected:",
  confidence: "Confidence:",
  symptomsHeading: "Symptoms",
  treatmentHeading: "Treatment",
  treatmentBiological: "Biological",
  treatmentChemical: "Chemical",
  treatmentPrevention: "Prevention",

  // Messages
  analysisFailed: "⚠️ Could not finish analysing the image. Please try again.",
  noAnswer: "The assistant has no reply yet.",
  loginRequired: "You need to sign in to use image scanning.",
  genericError: "Something went wrong. Please try again.",

  // Sidebar
  newChat: "New conversation",
  upgradePlan: "Upgrade plan",
  upgradeSubtitle: "Unlock premium features",

  // Welcome screen
  welcomeTitle: "Hello, how can I help you?",
  welcomeSubtitle:
    "Ask me about crop diseases and plant care, or send a photo for an accurate diagnosis.",

  // Conversation
  senderYou: "You",
  senderAssistant: "Agri-Scan AI",
  uploadImage: "Upload image",
  takePhoto: "Take a photo",
  inputPlaceholder: "Ask Agri-Scan AI anything...",
  disclaimer:
    "Agri-Scan AI can make mistakes. Please double-check important information.",
} as const;
