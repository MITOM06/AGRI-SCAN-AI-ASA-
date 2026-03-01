"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Leaf, KeyRound, Loader2, ArrowRight, ArrowLeft } from "lucide-react";
import { otpSchema, type OtpFormData } from "@agri-scan/shared";
import { authService } from "@/services/auth.service";
import { motion } from "framer-motion";

export default function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "email@example.com";

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
  });

  const onSubmit = async (data: OtpFormData) => {
    try {
      await authService.verifyOtp({ ...data, email });
      console.log("OTP verified");
      router.push(`/reset-password?email=${encodeURIComponent(email)}`);
    } catch (error) {
      console.error("OTP verification failed:", error);
      setError("otp", { message: "Mã OTP không chính xác. Vui lòng thử lại." });
    }
  };

  const handleResendOtp = () => {
    // Navigate back to forgot password to resend OTP
    router.push("/forgot-password");
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
          <h2 className="text-3xl font-bold text-gray-900">Nhập mã xác thực</h2>
          <p className="mt-2 text-gray-600">
            Mã OTP gồm 6 chữ số đã được gửi đến email{" "}
            <span className="font-semibold text-gray-900">{email}</span>
          </p>
          <p className="text-xs text-gray-500 mt-1">(Mã dùng thử: 123456)</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mã OTP
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <KeyRound size={20} />
              </div>
              <input
                {...register("otp")}
                type="text"
                maxLength={6}
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors tracking-[0.5em] text-center font-mono text-lg"
                placeholder="123456"
              />
            </div>
            {errors.otp && (
              <p className="mt-1 text-sm text-red-500">{errors.otp.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-70 disabled:cursor-not-allowed transition-all"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-2" size={20} />
                Đang xác thực...
              </>
            ) : (
              <>
                Xác nhận
                <ArrowRight className="ml-2" size={20} />
              </>
            )}
          </button>

          <div className="text-center space-y-2">
            <button
              type="button"
              onClick={handleResendOtp}
              className="text-sm font-medium text-primary hover:text-primary-dark transition-colors"
            >
              Gửi lại mã OTP
            </button>
            <div>
              <Link
                href="/forgot-password"
                className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-primary transition-colors"
              >
                <ArrowLeft size={16} className="mr-1" />
                Quay lại
              </Link>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
