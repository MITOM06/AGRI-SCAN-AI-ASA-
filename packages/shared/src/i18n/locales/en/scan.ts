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
  invalidFile: "Invalid file",
  analysisIncomplete: "Could not finish analysing the image",
  scanError: "Something went wrong while scanning",
  detailFetchFailed: "Could not fetch the result details",

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

  // ── Mobile ────────────────────────────────────────────────────────────
  defaultChatTitle: "Conversation",
  defaultScanTitle: "Image scan",
  defaultPlantName: "Plant",

  // Sidebar
  historyTitle: "Activity history",
  tabChat: "Chats",
  tabScans: "Scans",
  noHistory: "No history yet",
  noScanHistory: "No scan history yet",

  // Welcome screen (mobile wording differs from web)
  welcomeSubtitleMobile:
    "Your smart farming assistant. Ask me about crop disease and plant care, or send a photo for a diagnosis.",
  inputPlaceholderMobile: "Type a message...",

  // Diagnosis result (mobile shows a card with labels)
  diseaseDetectedLabel: "Disease detected:",
  confidenceLabel: "Confidence:",
  symptomsLabel: "Symptoms:",
  treatmentMethods: "Treatment methods:",
  treatmentOrganic: "🌱 Biological (organic):",
  treatmentChemicalLabel: "🧪 Chemical:",
  treatmentPreventive: "🛡️ Preventive:",

  // Permissions
  permissionCameraTitle: "Camera permission",
  permissionCameraMessage:
    "Agri-Scan needs camera access so you can photograph your plants. Please open your phone's Settings and allow it.",
  permissionLibraryTitle: "Photo library permission",
  permissionLibraryMessage:
    "Agri-Scan needs photo library access so you can upload images for diagnosis. Please open your phone's Settings and allow it.",
  openSettings: "Open Settings",

  // Errors
  errorTitle: "Error",
  cameraNotSupportedWeb:
    "The camera isn't supported in the browser — please use the image picker instead.",
  cameraOpenFailed:
    "Could not open the camera. Note: emulators often don't support the camera.",
  oldSessionWarning:
    "You're viewing an older chat.\n\nTap '+' to start a new conversation before sending a message!",
  errorServerConnection: "Server connection error. Please try again later.",
  errorLoginRequired: "You need to sign in to use this feature.",
  errorDataPrefix: "Data error: {detail}",
  errorInvalidImage: "Invalid image.",
  errorImageTooLarge:
    "That image is too large (over 10MB). Please choose a smaller one.",
  errorAiOverloaded:
    "The AI is overloaded right now. Please wait a moment and try again.",
  errorNetworkOrCorrupt:
    "Network error or corrupted image. Please try a different photo.",
  errorGenericPrefix: "Error: {message}",
} as const;
