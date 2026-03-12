"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Suspense } from "react";

function OAuthCallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { handleOAuthSuccess } = useAuth();

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");
    const userParam = searchParams.get("user");

    console.log("=== OAuth Callback Debug ===");
    console.log("accessToken:", accessToken ? "có" : "KHÔNG CÓ");
    console.log("refreshToken:", refreshToken ? "có" : "KHÔNG CÓ");
    console.log("userParam:", userParam);
    console.log("Full URL:", window.location.href);

    if (!accessToken || !refreshToken) {
      console.error("Thiếu token! Redirect về login");
      router.replace("/login?error=missing_token");
      return;
    }

    try {
      if (userParam) {
        const userData = JSON.parse(decodeURIComponent(userParam));
        console.log("userData parsed:", userData);
        handleOAuthSuccess(accessToken, refreshToken, userData);
      } else {
        // Không có user object → lưu token thủ công
        console.log("Không có userParam, lưu token thủ công");
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
      }

      console.log("Đang redirect về trang chủ...");
      router.replace("/");
    } catch (err) {
      console.error("Lỗi parse user:", err);
      // Vẫn thử lưu token dù parse lỗi
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      router.replace("/");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600 font-medium">Đang xử lý đăng nhập...</p>
        <p className="text-gray-400 text-sm mt-2">Vui lòng chờ trong giây lát</p>
      </div>
    </div>
  );
}

export default function OAuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <OAuthCallbackHandler />
    </Suspense>
  );
}