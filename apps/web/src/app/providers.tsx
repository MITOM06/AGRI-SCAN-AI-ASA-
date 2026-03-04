'use client';

/**
 * Providers - Nơi tiêm cấu hình và bọc Context cho toàn bộ App Web
 */

import { ReactNode } from "react";
import { AuthProvider } from "@/hooks/useAuth";
import { setTokenStorage } from "@agri-scan/shared";

// Cấu hình đồng bộ Token cho Axios Client (Chỉ chạy trên trình duyệt)
if (typeof window !== 'undefined') {
  setTokenStorage({
    getAccessToken: () => localStorage.getItem('accessToken'),
    getRefreshToken: () => localStorage.getItem('refreshToken'),
    saveTokens: (access: string, refresh: string) => {
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
    },
    clearTokens: () => {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  });
}

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  // Đã kích hoạt AuthProvider
  return <AuthProvider>{children}</AuthProvider>;
}