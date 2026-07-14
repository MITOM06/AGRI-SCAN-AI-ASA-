# OTP Verification on Registration + Removing the Terms Checkbox from Login

Date: 2026-07-14 · Scope: `apps/backend`, `apps/web`, `apps/mobile`, `packages/shared`

## Goals
1. Harden registration: after filling in the registration form, send a 6-digit OTP to the email; only after the correct OTP is entered is the real account created, then redirect to the login page.
2. Remove the "agree to terms/policy" checkbox from the **login** page (keep it only on first-time registration).

## Design decisions (finalized)
- **Account creation via pending-in-Redis**: `register` only validates + hashes the password + temporarily stores `{ fullName, hashedPassword, otp }` in Redis; it does NOT create the user yet. The user is `create`d only after the correct OTP is entered. → no unverified garbage users, no User schema change.
- **Pending/OTP TTL = 5 minutes**.
- **No auto-login** after verify → redirect to `/login`.
- Endpoints: `POST /auth/register/verify`, `POST /auth/register/resend`.
- Scope: web + mobile.

## Flow
```
Register (web/mobile)
  → POST /auth/register  (validate + hash pw + store register_pending:{email} + send OTP)
  → OTP entry screen (with email)
  → POST /auth/register/verify {email, otp}
       OTP correct → check email still unclaimed → create user → delete pending
  → to /login ("registration successful, please log in")
Resend: POST /auth/register/resend {email} → generate a new OTP if pending still exists
```

## Backend (`apps/backend/src/modules/auth`)
- `register(data)`: keep the existing email-exists / OAuth checks. Generate an OTP, store `register_pending:${email}` = `{ fullName, hashedPassword, otp }` in Redis with a 5-min TTL, send the OTP email. Return `{ message }` (no token).
- `verifyRegisterOtp(email, otp)`: check `lockout:${email}` → get pending → compare the OTP with attempt-counting logic (using `register_attempts:${email}`, 5 attempts → `lockout` 30 min). Correct → double-check the email is still unclaimed → `usersService.create({ fullName, email, password: hashedPassword, isPasswordSet: true, authProviders: ['local'] })` → delete pending + attempts. Return `{ message }`.
- `resendRegisterOtp(email)`: if pending exists → generate a new OTP, update pending (keep the 5-min TTL), resend; otherwise BadRequest "please register again".
- Refactor: `private buildOtpEmailHtml(fullName, otp, purpose)` shared HTML template for both forgot-password and register.
- DTO: reuse `VerifyOtpDto` for verify; reuse `ForgotPasswordDto { email }` for resend.
- Controller: add `POST register/verify`, `POST register/resend`.

## Shared (`packages/shared`)
- `constants/api.constants.ts`: add `REGISTER_VERIFY: "/api/auth/register/verify"`, `REGISTER_RESEND: "/api/auth/register/resend"`.
- `api/auth.api.ts`: add `verifyRegister(email, otp)`, `resendRegisterOtp(email)`.
- `schemas/auth.schema.ts`: remove `terms` from `loginSchema`; keep `terms` in `registerSchema`; add `otpSchema = { otp: 6-digit string }`.

## Web (`apps/web`)
- `components/auth/LoginForm.tsx`: remove the terms checkbox block + the terms error.
- `components/auth/RegisterForm.tsx`: onSubmit calls register → `router.push("/register/verify?email=...")`. Keep the checkbox.
- New: `app/(main)/(auth)/register/verify/page.tsx` + `components/auth/RegisterOtpForm.tsx`: enter 6 digits, a 60s countdown + resend, verify correct → `/login?message=registration_success`.
- `hooks/useAuth.tsx`: add `verifyRegister`, `resendRegisterOtp`.

## Mobile (`apps/mobile`)
- `app/auth/register.tsx`: after register → `router.push({ pathname: "/auth/otp-verification", params: { email, mode: "register" } })`.
- `app/auth/otp-verification.tsx`: branch on `mode`: `register` → `verifyRegister` → `login?registered=true`, resend → `resendRegisterOtp`; default keeps the existing forgot-password flow.

## Quality gate
- Backend: `pnpm --filter backend build` + update `auth.service.spec.ts`, `auth.controller.spec.ts` (register no longer returns a token) + `test`.
- Shared/Web/Mobile: build.
