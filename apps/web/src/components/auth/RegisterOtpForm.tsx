"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ShieldCheck, Loader2, ArrowRight, Timer, MailCheck } from "lucide-react";
import { otpSchema, type OtpFormData } from "@agri-scan/shared";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { withRedirect } from "@/lib/redirect";

const RESEND_COOLDOWN = 60; // giây

export default function RegisterOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { verifyRegister, resendRegisterOtp } = useAuth();

  const email = searchParams.get("email") ?? "";
  const redirectParam = searchParams.get("redirect");

  const [seconds, setSeconds] = useState(RESEND_COOLDOWN);
  const [resendMessage, setResendMessage] = useState("");
  const [isResending, setIsResending] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
  });

  // Không có email trên URL → quay lại trang đăng ký
  useEffect(() => {
    if (!email) router.replace("/register");
  }, [email, router]);

  // Đếm ngược cho nút "Gửi lại mã"
  useEffect(() => {
    if (seconds <= 0) return;
    const id = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [seconds]);

  const onSubmit = async (data: OtpFormData) => {
    try {
      await verifyRegister(email, data.otp);
      router.push(
        withRedirect("/login?message=registration_success", redirectParam),
      );
    } catch (error) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Mã OTP không hợp lệ hoặc đã hết hạn.";
      setError("root", { type: "server", message: errorMessage });
    }
  };

  const handleResend = async () => {
    if (seconds > 0 || isResending) return;
    setIsResending(true);
    setResendMessage("");
    try {
      await resendRegisterOtp(email);
      setResendMessage("Mã OTP mới đã được gửi đến email của bạn.");
      setSeconds(RESEND_COOLDOWN);
    } catch (error) {
      setError("root", {
        type: "server",
        message:
          (error as { response?: { data?: { message?: string } } })?.response
            ?.data?.message || "Không thể gửi lại mã. Thử lại sau.",
      });
    } finally {
      setIsResending(false);
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
            <ShieldCheck size={28} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Xác thực email</h2>
          <p className="mt-2 text-gray-600">
            Nhập mã OTP 6 chữ số đã được gửi đến
          </p>
          <p className="font-medium text-gray-900 break-all">{email}</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mã OTP
            </label>
            <input
              {...register("otp")}
              type="text"
              inputMode="numeric"
              maxLength={6}
              autoFocus
              autoComplete="one-time-code"
              placeholder="000000"
              className="block w-full text-center text-3xl font-bold tracking-[0.5em] py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />
            {errors.otp && (
              <p className="mt-1 text-sm text-red-500">{errors.otp.message}</p>
            )}
          </div>

          {resendMessage && (
            <div className="flex items-center gap-2 p-3 bg-green-50 text-green-700 text-sm rounded-xl border border-green-200">
              <MailCheck size={18} className="shrink-0" />
              <span>{resendMessage}</span>
            </div>
          )}

          {errors.root && (
            <div className="p-3 bg-red-50 text-red-500 text-sm rounded-xl text-center border border-red-100">
              {errors.root.message}
            </div>
          )}

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
                Xác nhận <ArrowRight className="ml-2" size={20} />
              </>
            )}
          </button>

          <div className="text-center text-sm">
            {seconds > 0 ? (
              <span className="inline-flex items-center gap-1 text-gray-500">
                <Timer size={16} /> Gửi lại mã sau {seconds}s
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending}
                className="font-medium text-primary hover:text-primary-dark disabled:opacity-60"
              >
                {isResending ? "Đang gửi..." : "Gửi lại mã mới"}
              </button>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
}
