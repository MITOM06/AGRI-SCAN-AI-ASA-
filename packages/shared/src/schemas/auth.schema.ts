import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string()
    .min(1, { message: "Email không được để trống" })
    .email({ message: "Email không hợp lệ" }),
  password: z.string()
    .min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" })
});

export const registerSchema = z.object({
  fullName: z.string()
    .min(2, { message: "Họ tên phải có ít nhất 2 ký tự" })
    .max(50, { message: "Họ tên không được quá 50 ký tự" })
    .regex(/^[a-zA-ZÀ-ỹ\s]+$/, { message: "Họ tên chỉ được chứa chữ cái và khoảng trắng" }),
  email: z.string()
    .min(1, { message: "Email không được để trống" })
    .email({ message: "Email không hợp lệ" }),
  password: z.string()
    .min(8, { message: "Mật khẩu phải có ít nhất 8 ký tự" })
    .regex(/[A-Z]/, { message: "Mật khẩu phải chứa ít nhất 1 chữ hoa" })
    .regex(/[a-z]/, { message: "Mật khẩu phải chứa ít nhất 1 chữ thường" })
    .regex(/[0-9]/, { message: "Mật khẩu phải chứa ít nhất 1 số" })
    .regex(/[^A-Za-z0-9]/, { message: "Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt" }),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"],
});

export const forgotPasswordSchema = z.object({
  email: z.string()
    .min(1, { message: "Email không được để trống" })
    .email({ message: "Email không hợp lệ" })
});

export const otpSchema = z.object({
  otp: z.string()
    .length(6, { message: "Mã OTP phải có 6 ký tự" })
    .regex(/^[0-9]+$/, { message: "Mã OTP chỉ chứa số" })
});

export const resetPasswordSchema = z.object({
  password: z.string()
    .min(8, { message: "Mật khẩu phải có ít nhất 8 ký tự" })
    .regex(/[A-Z]/, { message: "Mật khẩu phải chứa ít nhất 1 chữ hoa" })
    .regex(/[a-z]/, { message: "Mật khẩu phải chứa ít nhất 1 chữ thường" })
    .regex(/[0-9]/, { message: "Mật khẩu phải chứa ít nhất 1 số" })
    .regex(/[^A-Za-z0-9]/, { message: "Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt" }),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"],
});

// Export types
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type OtpFormData = z.infer<typeof otpSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;