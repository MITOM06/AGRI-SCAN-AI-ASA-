/** Plan upgrade & payment. */
export const billing = {
  // Upgrade page
  title: "Upgrade your plan",
  subtitle: "Pick the plan that fits how you farm",
  period: "month",

  guestBanner:
    "You're browsing as a guest. Please {login} or {register} an account to upgrade your plan.",
  guestBannerLogin: "sign in",
  guestBannerRegister: "sign up for",

  // FREE plan
  freeDescription: "Discover what the AI can do",
  freeFeature1: "3 images/day (upload or camera)",
  freeFeature2: "10 messages (prompts)/day",
  freeFeature3: "Basic diagnosis model",
  freeFeature4: "Community support",
  freeCtaGuest: "Sign up free",
  freeCtaDowngrade: "Downgrade to Free",

  // PREMIUM plan
  premiumDescription: "Unlock the full experience",
  premiumFeature1: "10 images/day (upload or camera)",
  premiumFeature2: "50 messages (prompts)/day",
  premiumFeature3: "Advanced agricultural AI model",
  premiumFeature4: "Valid for 30 days",
  premiumCta: "Upgrade to Plus",

  // VIP plan
  vipDescription: "Maximise your yield",
  vipFeature1: "20 images/day (upload or camera)",
  vipFeature2: "Unlimited messages (prompts)/day",
  vipFeature3: "Expert AI model",
  vipFeature4: "Valid for 30 days",
  vipCta: "Upgrade to Pro",

  currentPlan: "Current plan",
  tagPopular: "POPULAR",
  includesPlus: "Everything in Plus, plus:",

  enterpriseQuestion: "Need a custom enterprise plan?",
  contactUs: "Get in touch",

  // Sign-in required modal
  loginRequiredTitle: "Please sign in",
  loginRequiredDesc:
    "You need to sign in or create an account to upgrade. We'll bring you straight back to this page afterwards.",
  loginNow: "Sign in now",
  createAccount: "Create an account",
} as const;
