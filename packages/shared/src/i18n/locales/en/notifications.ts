/**
 * Notifications screen (mobile app).
 * The list is hard-coded sample data in the screen — not wired to an API yet.
 */
export const notifications = {
  title: "Notifications",
  markAllRead: "Mark all read",

  sample1Title: "Leaf fungus risk detected",
  sample1Desc:
    "High humidity over the next 3 days could cause fungus on your tomato plants. Protect them with a biological spray.",
  sample1Time: "2 hours ago",

  sample2Title: "AI model updated to v2.0",
  sample2Desc:
    "The AI doctor can now recognise 50 more diseases with up to 98% accuracy. Try a scan now!",
  sample2Time: "Yesterday",

  sample3Title: "Diagnosis complete",
  sample3Desc:
    "Crab-eye spot on your rose has been saved to your history. Please follow the treatment plan.",
  sample3Time: "2 days ago",

  sample4Title: "This week's care tip",
  sample4Desc:
    "How to compost at home without any smell, so plants grow twice as fast.",
  sample4Time: "3 days ago",
} as const;
