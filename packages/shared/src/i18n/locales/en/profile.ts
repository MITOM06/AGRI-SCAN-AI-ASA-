/** User profile page. */
export const profile = {
  loginRequired: "Please sign in to view this page.",

  // Plan
  currentPlan: "Current plan",
  expiresOn: "Expires:",
  upgradePlan: "Upgrade plan",

  // Stats
  stats: "Statistics",
  statScans: "Plants scanned",
  statDiseases: "Diseases found",
  statChats: "Conversations",

  // Set password
  setPassword: "Set a password",
  setPasswordDesc:
    "You signed in with Google. Set a password so you can also sign in with your email in future.",
  setPasswordSuccess: "Password set successfully!",
  setPasswordPlaceholder:
    "At least 8 characters with upper case, lower case and a number",
  savePassword: "Save password",
  errorPasswordShort: "Password must be at least 8 characters",
  errorPasswordWeak:
    "Password must contain at least 1 upper case letter, 1 lower case letter, 1 number and 1 special character",
  errorGeneric: "Something went wrong. Please try again.",

  // Recent activity
  recentActivity: "Recent activity",
  sampleActivityTitle: "Leaf spot diagnosis",
  sampleActivityMeta: "Tomato plant • 2 hours ago",
  sampleActivityRisk: "High risk",
  viewAllActivity: "View all activity",
} as const;
