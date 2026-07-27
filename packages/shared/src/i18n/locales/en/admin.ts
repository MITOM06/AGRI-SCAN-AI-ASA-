/** Admin area: menu, dashboard, users, reports, feedback. */
export const admin = {
  // Sidebar menu
  menuDashboard: "Overview",
  menuUsers: "Users",
  menuReports: "Reports",
  menuFeedbacks: "Feedback",

  // Plan labels (shared by dashboard & reports)
  planFree: "FREE plan",
  planPremium: "PREMIUM plan",
  planVip: "VIP plan",

  // ── Overview ──────────────────────────────────────────────────────────
  dashboardTitle: "System overview",
  dashboardUpdatedAt: "Updated at: {time}",
  dashboardLoading: "Loading the dashboard...",
  dashboardLoadFailed: "Could not load dashboard data.",

  cardTotalUsers: "Total users",
  cardNewThisMonth: "+{count} this month",
  cardRevenueThisMonth: "Revenue this month",
  cardRevenueTotal: "Total: {amount}",
  cardTotalScans: "Total scans",
  cardScansStable: "Activity is steady",
  cardPendingFeedback: "Feedback awaiting reply",
  cardNeedsReplySoon: "Needs a reply soon",
  planRatio: "Subscription mix",

  // ── Users ─────────────────────────────────────────────────────────────
  usersTitle: "User management",
  usersSearchPlaceholder: "Search email, name...",
  usersFilterAllPlans: "All plans",
  colUser: "User",
  colRole: "Role",
  colCurrentPlan: "Current plan",
  colUsage: "Usage",
  colRegisteredAt: "Registered",
  colActions: "Actions",
  imageCount: "{count} images",
  actionDowngradeFree: "Downgrade to FREE",
  actionUpgradePremium: "Upgrade to PREMIUM",
  actionUpgradeVip: "Upgrade to VIP",
  usersEmpty: "No users found",
  usersEmptyHint: "Try a different search term or filter",
  usersShowing: "Showing",
  usersOfTotal: "{total} users",
  errorInvalidUserId: "Error: invalid user ID (undefined)!",
  errorPrefix: "Error: {message}",

  // ── Reports ───────────────────────────────────────────────────────────
  reportsTitle: "Reports & analytics",
  reportsLoading: "Loading reports...",
  reportsLoadFailed: "Could not load report data.",
  reportsNoData: "No report data available.",
  rangeLast7Days: "Last 7 days",
  rangeLast30Days: "Last 30 days",
  rangeThisYear: "This year",
  exportReport: "Export report",

  avgRevenuePerUser: "Average revenue / user",
  totalRevenue: "Total revenue: {amount}",
  conversionRate: "Conversion rate (Free > Paid)",
  paidUsers: "{count} paying users",
  avgUsage: "Average usage",
  perDay: "per day",
  avgOverLastDays: "Average over the last {days} days",
  revenueByPlan: "Revenue by plan",
  userDistribution: "User distribution",
  usageFrequency: "System usage (scans & chats)",
  seriesImageScans: "Image scans",
  seriesAiChats: "AI chats",

  // ── Feedback ──────────────────────────────────────────────────────────
  feedbacksTitle: "Feedback management",
  feedbacksPendingCount: "{count} feedback items awaiting a reply",
  feedbacksNoPending: "No feedback awaiting a reply",
  feedbacksFilterAll: "All statuses",
  feedbacksStatusPending: "Awaiting reply",
  feedbacksStatusReplied: "Replied",
  feedbacksLoading: "Loading feedback...",
  feedbacksEmpty: "No feedback",
  feedbacksEmptyHint: "Nothing matches the current filter.",
  feedbacksLoadFailed: "Could not load the feedback list.",
  feedbacksReplyFailed: "Could not send your reply to the user.",
  anonymousUser: "User",
  adminReplyLabel: "Admin reply:",
  replyNow: "Reply now",
  replyModalTitle: "Reply to feedback",
  replyContentLabel: "Your reply",
  replyPlaceholder: "Write a detailed reply...",
  replyCancel: "Cancel",
  replySubmit: "Send reply",

  // ── Mobile ────────────────────────────────────────────────────────────
  // Time-based greeting
  greetingMorning: "Good morning",
  greetingAfternoon: "Good afternoon",
  greetingEvening: "Good evening",
  adminFallbackName: "Administrator",

  // Bottom tabs
  mTabOverview: "Overview",
  mTabAccounts: "Accounts",
  mTabReports: "Reports",
  mTabFeedbacks: "Feedback",

  // Data loading errors
  mLoadOverviewFailed: "Could not load the overview.",
  mLoadUsersFailed: "Could not load the user list.",
  mLoadRevenueFailed: "Could not load the revenue report.",
  mLoadFeedbacksFailed: "Could not load the feedback list.",

  // Replying to feedback
  mErrorEmptyReply: "Please enter a reply.",
  mReplySent: "Your reply has been sent to the user.",
  mReplySendFailed: "Could not send the reply.",

  // Sign out
  mLogoutConfirm: "Are you sure you want to sign out of the admin area?",

  // Overview tab
  mTotalRevenue: "Total revenue",
  mRevenueThisMonth: "+ {amount} this month",
  mUsers: "Users",
  mNewThisMonth: "+ {count} new",
  mAiScans: "AI scans",
  mAnalyzed: "Analysed",
  mPlanRatio: "Membership mix",
  mPlanFreeLabel: "Basic plan (Free)",

  // Accounts tab
  mSearchPlaceholder: "Search email or name...",
  mNoNameYet: "No name set",

  // Reports tab
  mYearSummary: "This year's summary",
  mTransactions: "Transactions",
  mMonthlyDetail: "Monthly breakdown",
  mMonthN: "Month {n}",
  mTransactionCount: "Transactions:",
  mPlanNamed: "{plan} plan:",

  // Feedback tab
  mFilterPending: "Awaiting reply",
  mFilterReplied: "Replied",
  mNoFeedbackInSection: "No feedback in this section.",
  mAnonymousUser: "Anonymous user",
  mCreatedAtPrefix: "{date} at",
  mReplyPlaceholder: "Write the admin's reply...",
  mSendReply: "Send reply",
  mOpenReply: "Reply to this feedback",
  mAdminReplied: "Admin replied:",
  mRepliedAtPrefix: "Replied at:",
} as const;
