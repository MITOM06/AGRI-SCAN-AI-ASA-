"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Leaf,
  Mail,
  Lock,
  User,
  Loader2,
  ArrowRight,
  Eye,
  EyeOff,
} from "lucide-react";
import { registerSchema, type RegisterFormData } from "@agri-scan/shared";
import { motion } from "framer-motion";
import { useAuth } from "../../hooks/useAuth";

// Helper functions for password validation
const validatePasswordCriteria = (password: string) => {
  return {
    isLengthValid: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };
};

export function Register() {
  const router = useRouter();
  const { register: registerUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  // Watch password for real-time validation
  const password = watch("password", "");
  const passwordCriteria = validatePasswordCriteria(password);

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser(data.email, data.password, data.fullName);
      // Registration successful - redirect to login
      router.push("/auth/login?message=registration_success");
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-gray-100"
      >
        <div className="text-center">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mx-auto mb-4">
            <Leaf size={28} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            Tạo tài khoản mới
          </h2>
          <p className="mt-2 text-gray-600 text-center">
            Bắt đầu hành trình quản lý vườn cây thông minh
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Họ và tên
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <User size={20} />
                </div>
                <input
                  {...register("fullName")}
                  type="text"
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  placeholder="Nguyễn Văn A"
                />
              </div>
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Mail size={20} />
                </div>
                <input
                  {...register("email")}
                  type="email"
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  placeholder="name@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mật khẩu
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock size={20} />
                </div>
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  className="block w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff size={20} className="text-gray-400" />
                  ) : (
                    <Eye size={20} className="text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}

              {/* Password Requirements */}
              <div className="mt-3 space-y-1">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Yêu cầu mật khẩu:
                </p>
                <div className="space-y-1">
                  <p
                    className={`text-xs flex items-center gap-1 ${
                      passwordCriteria.isLengthValid
                        ? "text-green-600"
                        : "text-gray-400"
                    }`}
                  >
                    <span className="w-1 h-1 bg-current rounded-full"></span>
                    Ít nhất 8 ký tự
                  </p>
                  <p
                    className={`text-xs flex items-center gap-1 ${
                      passwordCriteria.hasUpperCase
                        ? "text-green-600"
                        : "text-gray-400"
                    }`}
                  >
                    <span className="w-1 h-1 bg-current rounded-full"></span>
                    Chứa chữ in hoa
                  </p>
                  <p
                    className={`text-xs flex items-center gap-1 ${
                      passwordCriteria.hasLowerCase
                        ? "text-green-600"
                        : "text-gray-400"
                    }`}
                  >
                    <span className="w-1 h-1 bg-current rounded-full"></span>
                    Chứa chữ thường
                  </p>
                  <p
                    className={`text-xs flex items-center gap-1 ${
                      passwordCriteria.hasNumber
                        ? "text-green-600"
                        : "text-gray-400"
                    }`}
                  >
                    <span className="w-1 h-1 bg-current rounded-full"></span>
                    Chứa số
                  </p>
                  <p
                    className={`text-xs flex items-center gap-1 ${
                      passwordCriteria.hasSpecialChar
                        ? "text-green-600"
                        : "text-gray-400"
                    }`}
                  >
                    <span className="w-1 h-1 bg-current rounded-full"></span>
                    Chứa ký tự đặc biệt
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Xác nhận mật khẩu
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock size={20} />
                </div>
                <input
                  {...register("confirmPassword")}
                  type={showConfirmPassword ? "text" : "password"}
                  className="block w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} className="text-gray-400" />
                  ) : (
                    <Eye size={20} className="text-gray-400" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-70 disabled:cursor-not-allowed transition-all"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-2" size={20} />
                Đang đăng ký...
              </>
            ) : (
              <>
                Tạo tài khoản
                <ArrowRight className="ml-2" size={20} />
              </>
            )}
          </button>

          <div className="text-center text-sm">
            <span className="text-gray-500">Đã có tài khoản? </span>
            <Link
              href="/auth/login"
              className="font-medium text-primary hover:text-primary-dark"
            >
              Đăng nhập ngay
            </Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
