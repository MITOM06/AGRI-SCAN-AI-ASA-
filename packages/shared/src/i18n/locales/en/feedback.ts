/** Feedback & support page. */
export const feedback = {
  // Feedback types — the `value` (BUG, FEATURE, ...) is the API code, not translated
  typeBug: "Report a bug",
  typeFeature: "Feature request",
  typeComplaint: "Complaint",
  typeGeneral: "General feedback",

  // Not signed in
  loginTitle: "Please sign in",
  loginDesc:
    "You need to sign in to send feedback and follow how we handle it.",
  loginCta: "Sign in now",

  // Form
  formTitle: "Send feedback",
  formSubtitle: "We're always listening",
  labelType: "Feedback type",
  labelContent: "Details",
  contentPlaceholder: "Describe your issue or suggestion in detail...",
  submit: "Send feedback",

  // History
  historyTitle: "Feedback history",
  requestCount: "{count} requests",
  historyEmpty: "No feedback yet",
  historyEmptyDesc:
    "Nothing here yet. Use the form on the left to send feedback or report a problem.",
  statusAnswered: "Answered",
  statusProcessing: "In progress",

  // Messages
  loadHistoryFailed: "Could not load your feedback history.",
  errorEmptyContent: "Please enter your feedback.",
  submitSuccess: "Your feedback has been sent!",
  submitFailed: "Something went wrong while sending your feedback.",

  // ─── Mobile feedback screen (app/feedback.tsx), `m` prefix ───
  mTitle: "Support & Feedback",
  mTabSend: "Send feedback",
  mTabHistory: "My history",

  // Topic labels — `id` (GENERAL, BUG, ...) is the API code, never translated
  mCatGeneral: "General support",
  mCatBug: "Report a bug",
  mCatFeature: "Feature suggestion",
  mCatComplaint: "Complaint",

  mIntro:
    "Run into a problem, or have a good idea? Share it with Agri-Scan so we can improve the app!",
  mLabelCategory: "Feedback topic:",
  mLabelContent: "Details:",
  mContentPlaceholder: "Describe the problem you are running into...",
  mSubmit: "Send to the team",

  mErrorTooShort:
    "Please write at least 10 characters so the admins understand the issue.",
  mSubmitSuccessWebAlert: "🎉 Sent! Thanks for your feedback.",
  mSubmitSuccessTitle: "Sent!",
  mSubmitSuccessBody:
    "Thanks for your feedback. The team will review it as soon as possible.",
  mSubmitFailed: "Cannot send feedback right now.",

  mHistoryEmpty: "You have not sent any feedback yet.",
  mAdminReplied: "The team replied:",
  mPending: "Waiting for an admin...",
} as const;
