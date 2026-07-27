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

  // ── Checkout page ─────────────────────────────────────────────────────
  // Benefits listed in the right-hand column
  benefit1: "Advanced AI model",
  benefit2: "Higher message & upload limits",
  benefit3: "High-quality image generation",
  benefit4: "Extended memory",

  // Waiting / redirecting states
  redirectingToLogin:
    "You need to sign in to upgrade. Redirecting to the sign-in page...",
  checkingAccount: "Checking your account...",
  backToPlans: "Back to plans",

  // Success
  paymentSuccess: "Payment successful!",
  planActivatedPrefix: "The",
  planActivatedSuffix: "plan is now active on your account.",
  startUsing: "Start using it",

  // Card form
  paymentInfo: "Payment details",
  paymentMethod: "Payment method",
  cardNumber: "Card number",
  expiryDate: "Expiry date",
  cvc: "CVC",

  // Billing address
  billingAddress: "Billing address",
  fullName: "Full name",
  fullNamePlaceholder: "John Smith",
  country: "Country / Region",
  countryVietnam: "Vietnam",
  address: "Address",
  addressPlaceholder: "House number, street...",

  // Summary & CTA
  subscribeNowWithPrice: "Subscribe now — ₫{price}",
  subscribeNow: "Subscribe now",
  planNamed: "{name} plan",
  billedMonthly: "Billed monthly",
  monthlyPrice: "Monthly plan price",
  dueToday: "Due today",
  autoRenewPrefix: "Renews automatically at ₫{price}/month.",
  cancelAnytime: "Cancel anytime",
  autoRenewSuffix: "in Settings. By subscribing you agree to the",
  termsOfUse: "Terms of Use",
  securePayment: "Secure payment with SSL encryption",

  // Errors
  invalidPlan: "Invalid plan",
  paymentFailed: "Payment failed. Please try again.",

  // ── Mobile: upgrade screen (richer feature list than web) ──────────────
  tagPremium: "PREMIUM",

  mFreeFeature1: "Basic model",
  mFreeFeature2: "Limited messages and uploads",
  mFreeFeature3: "Limited image generation",
  mFreeFeature4: "Short-term memory",

  mPlusFeature1: "Advanced AI model (faster and more accurate)",
  mPlusFeature2: "Higher message and upload limits",
  mPlusFeature3: "High-quality image generation",
  mPlusFeature4: "Memory carried across conversations",
  mPlusFeature5: "Deep analysis mode",
  mPlusFeature6: "Priority support",

  mProFeature1: "Unlimited messages",
  mProFeature2: "Premium agricultural expert model",
  mProFeature3: "In-depth plant disease image analysis",
  mProFeature4: "Detailed report generation",
  mProFeature5: "API access for developers",
} as const;
