import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { getTokenStorage } from "./token-manager";

declare module "axios" {
  export interface AxiosInstance {
    upload<T = any, R = AxiosResponse<T>>(
      url: string,
      data: FormData,
      config?: AxiosRequestConfig,
    ): Promise<R>;
  }
}

// ─── BUG FIX: 'localhost' trỏ vào chính điện thoại, không phải máy tính ───────
//
// Cách lấy IP máy tính của bạn:
//   Windows: ipconfig → tìm "IPv4 Address" (VD: 192.168.1.5)
//   macOS/Linux: ifconfig | grep "inet " (VD: 192.168.1.5)
//
// Sau đó tạo file apps/mobile/.env với nội dung:
//   EXPO_PUBLIC_API_URL=http://192.168.1.5:4000
//
// Lưu ý: Điện thoại và máy tính phải cùng wifi.
// Nếu test bằng Android Emulator trên máy thật thì dùng: http://10.0.2.2:4000
// Nếu deploy production thì đổi thành domain thật: https://api.agriscan.ai
//
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://192.168.0.100:4000";

export const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000, // 15s timeout - tránh treo app khi mạng yếu
});

// Upload file ảnh (multipart/form-data)
axiosClient.upload = function <T = any, R = AxiosResponse<T>>(
  url: string,
  data: FormData,
  config?: AxiosRequestConfig,
): Promise<R> {
  return this.post<T, R>(url, data, {
    ...config,
    headers: {
      ...config?.headers,
      "Content-Type": "multipart/form-data",
    },
  });
};

// Interceptor: Tự động gắn Access Token vào mọi request
axiosClient.interceptors.request.use(async (config) => {
  const storage = getTokenStorage();
  if (storage) {
    const accessToken = await storage.getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
  }
  return config;
});

// Interceptor: Tự động refresh token khi gặp lỗi 401
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const storage = getTokenStorage();

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/auth/refresh"
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = await storage?.getRefreshToken();
        if (!refreshToken) throw new Error("Không có Refresh Token");

        const res = await axios.post(`${BASE_URL}/auth/refresh`, {
          refreshToken,
        });
        const { accessToken, refreshToken: newRefreshToken } = res.data;
        await storage?.saveTokens(accessToken, newRefreshToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosClient(originalRequest);
      } catch (refreshError) {
        await storage?.clearTokens();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
