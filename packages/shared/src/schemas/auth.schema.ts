import { z } from 'zod';

/**
 * Các `message` dưới đây là KEY i18n, không phải chuỗi hiển thị.
 * Component render bằng t(errors.field.message).
 *
 * translate() trả nguyên văn khi không tìm thấy key, nên thông báo lỗi do
 * backend trả về (một câu tiếng Việt/tiếng Anh hoàn chỉnh) vẫn hiển thị đúng
 * dù đi qua cùng một hàm t().
 */
const V = 'auth.validation';

export const loginSchema = z.object({
  email: z.string()
    .min(1, { message: `${V}.emailRequired` })
    .email({ message: `${V}.emailInvalid` }),
  password: z.string()
    .min(6, { message: `${V}.passwordMin6` }),
});

export const registerSchema = z.object({
  fullName: z.string()
    .min(2, { message: `${V}.fullNameMin` })
    .max(50, { message: `${V}.fullNameMax` })
    .refine(val => /^[\p{L}\p{M}\s]+$/u.test(val.normalize('NFC').trim()), {
    message: `${V}.fullNameLetters`
  }),
  email: z.string()
    .min(1, { message: `${V}.emailRequired` })
    .email({ message: `${V}.emailInvalid` }),
  password: z.string()
    .min(8, { message: `${V}.passwordMin8` })
    .regex(/[A-Z]/, { message: `${V}.passwordUpperCase` })
    .regex(/[a-z]/, { message: `${V}.passwordLowerCase` })
    .regex(/[0-9]/, { message: `${V}.passwordNumber` })
    .regex(/[^A-Za-z0-9]/, { message: `${V}.passwordSpecialChar` }),
  confirmPassword: z.string(),
  terms: z.boolean().refine(val => val === true, { message: `${V}.termsRequired` })
}).refine((data) => data.password === data.confirmPassword, {
  message: `${V}.passwordMismatch`,
  path: ["confirmPassword"],
});

// Schema cho ô nhập OTP 6 chữ số (xác thực đăng ký)
export const otpSchema = z.object({
  otp: z.string()
    .length(6, { message: `${V}.otpLength` })
    .regex(/^\d{6}$/, { message: `${V}.otpDigits` }),
});

export const forgotPasswordSchema = z.object({
  email: z.string()
    .min(1, { message: `${V}.emailRequired` })
    .email({ message: `${V}.emailInvalid` })
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, { message: `${V}.tokenInvalid` }),
  password: z.string()
    .min(8, { message: `${V}.passwordMin8` })
    .regex(/[A-Z]/, { message: `${V}.passwordUpperCase` })
    .regex(/[a-z]/, { message: `${V}.passwordLowerCase` })
    .regex(/[0-9]/, { message: `${V}.passwordNumber` })
    .regex(/[^A-Za-z0-9]/, { message: `${V}.passwordSpecialChar` }),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: `${V}.passwordMismatch`,
  path: ["confirmPassword"],
});

export const setPasswordSchema = z.object({
  newPassword: z.string()
    .min(8, { message: `${V}.passwordMin8` })
    .regex(/[A-Z]/, { message: `${V}.passwordUpperCase` })
    .regex(/[a-z]/, { message: `${V}.passwordLowerCase` })
    .regex(/[0-9]/, { message: `${V}.passwordNumber` })
    .regex(/[^A-Za-z0-9]/, { message: `${V}.passwordSpecialChar` }),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: `${V}.passwordMismatch`,
  path: ["confirmPassword"],
});



// Export types
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type OtpFormData = z.infer<typeof otpSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type SetPasswordFormData = z.infer<typeof setPasswordSchema>;
