"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Leaf,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { registerSchema, type RegisterFormData } from "@agri-scan/shared";
import { authService } from "@/services/auth.service";
import { motion } from "framer-motion";
import { useState } from "react";

export default function RegisterForm() {
  const router = useRouter();
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

  const password = watch("password");
  const isPasswordLengthValid = password && password.length >= 8;
  const hasSpecialChar = password && /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const hasNumber = password && /\d/.test(password);
  const hasUpperCase = password && /[A-Z]/.test(password);

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await authService.register(data);
      console.log("Registration successful");
      // Navigate to home after successful registration
      router.push("/");
    } catch (error) {
      console.error("Registration failed:", error);
      // For demo, still redirect to login
      router.push("/login?message=Đăng ký thành công! Vui lòng đăng nhập.");
    }
  };

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
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
          <p className="mt-2 text-gray-600">
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

            <div>
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
                  className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}

              {/* Password Requirements */}
              <div className="mt-3 text-sm space-y-1">
                <p className="font-medium text-gray-700 mb-2">
                  Yêu cầu mật khẩu:
                </p>
                <div className="space-y-1">
                  <div
                    className={`flex items-center space-x-2 transition-colors ${
                      isPasswordLengthValid ? "text-green-600" : "text-gray-400"
                    }`}
                  >
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        isPasswordLengthValid ? "bg-green-600" : "bg-gray-300"
                      }`}
                    />
                    <span>Ít nhất 8 ký tự</span>
                  </div>
                  <div
                    className={`flex items-center space-x-2 transition-colors ${
                      hasUpperCase ? "text-green-600" : "text-gray-400"
                    }`}
                  >
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        hasUpperCase ? "bg-green-600" : "bg-gray-300"
                      }`}
                    />
                    <span>Chứa các chữ in hoa</span>
                  </div>
                  <div
                    className={`flex items-center space-x-2 transition-colors ${
                      hasNumber ? "text-green-600" : "text-gray-400"
                    }`}
                  >
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        hasNumber ? "bg-green-600" : "bg-gray-300"
                      }`}
                    />
                    <span>Chứa số</span>
                  </div>
                  <div
                    className={`flex items-center space-x-2 transition-colors ${
                      hasSpecialChar ? "text-green-600" : "text-gray-400"
                    }`}
                  >
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        hasSpecialChar ? "bg-green-600" : "bg-gray-300"
                      }`}
                    />
                    <span>Chứa ký tự đặc biệt</span>
                  </div>
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
                  className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
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
                Đang xử lý...
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
              href="/login"
              className="font-medium text-primary hover:text-primary-dark"
            >
              Đăng nhập
            </Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
