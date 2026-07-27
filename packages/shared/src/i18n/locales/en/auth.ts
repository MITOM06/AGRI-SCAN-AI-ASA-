/** Sign in, sign up, forgot password, OTP. */
export const auth = {
  // Sign in
  loginTitle: "Welcome back",
  loginSubtitle: "Sign in to keep managing your garden",
  loginButton: "Sign in",
  loginFailed: "Sign-in failed. Please try again later.",
  registrationSuccess: "Registration complete! Please sign in to continue.",

  // Sign up
  registerTitle: "Create a new account",
  registerSubtitle: "Start managing your garden the smart way",
  registerButton: "Create account",
  registerFailed: "Registration failed. Please check your details.",

  // Fields
  email: "Email",
  emailPlaceholder: "name@example.com",
  password: "Password",
  confirmPassword: "Confirm password",
  newPassword: "New password",
  fullName: "Full name",
  fullNamePlaceholder: "John Smith",
  forgotPasswordLink: "Forgot password?",

  // Password rules
  passwordRequirements: "Password requirements:",
  ruleMinLength: "At least 8 characters",
  ruleUpperCase: "Contains an uppercase letter",
  ruleLowerCase: "Contains a lowercase letter",
  ruleNumber: "Contains a number",
  ruleSpecialChar: "Contains a special character",

  // Terms
  agreePrefix: "I agree to the",
  termsOfService: "Terms of Service",
  and: "and",
  privacyPolicy: "Privacy Policy",

  // Social sign-in
  orContinueWith: "Or continue with",
  google: "Google",
  facebook: "Facebook",

  // Cross links
  noAccount: "Don't have an account?",
  registerNow: "Sign up now",
  haveAccount: "Already have an account?",

  // Forgot password
  forgotTitle: "Forgot password",
  forgotSubtitle:
    "Enter your registered email and we'll send you a reset link",
  forgotButton: "Send reset link",
  forgotSent:
    "If that email exists in our system, a password reset link has been sent.",
  backToLogin: "Back to sign in",

  // 4-step forgot-password flow (email → OTP → new password → done)
  forgotFlow: {
    step1Title: "Forgot password?",
    step1Subtitle: "Enter your email to receive a 6-digit OTP",
    step1Button: "Send code",
    step1Failed: "Could not send the email. Please try again.",

    step2Title: "Enter the code",
    step2Subtitle: "We sent a code to {email}",
    step2Label: "OTP (6 digits)",
    step2Hint: "* The OTP is valid for 60 seconds",
    step2Button: "Verify OTP",
    step2Checking: "Checking...",
    step2Failed: "The OTP is invalid or has expired.",

    step3Title: "Create a new password",
    step3Subtitle: "Choose a strong password to protect your account",
    step3Button: "Change password",
    step3Updating: "Updating...",
    step3Failed: "Password change failed. Your session may have expired.",

    step4Title: "All set!",
    step4Subtitle: "Your account password has been updated",
    step4Button: "Sign in with your new password",
  },

  // Reset / set password
  resetTitle: "Reset password",
  resetSubtitle: "Enter a new password for your account",
  resetButton: "Reset password",
  resetSuccess: "Password changed! Redirecting to sign in...",
  setPasswordTitle: "Set a password",
  setPasswordSubtitle:
    "Your account signs in through social login. Set a password to sign in directly.",
  setPasswordButton: "Set password",

  // OTP
  otpTitle: "Verify your email",
  otpSubtitle: "We sent a 6-digit code to {email}",
  otpLabel: "Verification code",
  otpButton: "Verify",
  otpResend: "Resend code",
  otpResendIn: "Resend code in {seconds}s",
  otpResent: "Verification code resent",
  otpFailed: "The OTP is invalid or has expired.",
  otpChangeEmail: "Use a different email",
  otpSentTo: "Enter the 6-digit OTP we sent to",
  otpVerifying: "Verifying...",
  otpResendNew: "Send a new code",
  otpResendFailed: "Could not resend the code. Try again later.",
  otpResentMessage: "A new OTP has been sent to your email.",

  // OAuth callback
  callbackProcessing: "Completing sign-in...",
  callbackFailed: "Sign-in failed. Please try again.",
  callbackSyncing: "Syncing your account...",
  callbackWait: "This will only take a moment",

  // zod messages — used as keys, never rendered directly
  validation: {
    emailRequired: "Email is required",
    emailInvalid: "Invalid email address",
    passwordMin6: "Password must be at least 6 characters",
    passwordMin8: "Password must be at least 8 characters",
    passwordUpperCase: "Password must contain at least 1 uppercase letter",
    passwordLowerCase: "Password must contain at least 1 lowercase letter",
    passwordNumber: "Password must contain at least 1 number",
    passwordSpecialChar: "Password must contain at least 1 special character",
    passwordMismatch: "Passwords do not match",
    fullNameMin: "Full name must be at least 2 characters",
    fullNameMax: "Full name must be at most 50 characters",
    fullNameLetters: "Full name may only contain letters and spaces",
    termsRequired: "You must agree to the Terms and Privacy Policy",
    otpLength: "The OTP must be exactly 6 digits",
    otpDigits: "The OTP must contain only 6 digits",
    tokenInvalid: "Invalid token",
  },
} as const;
