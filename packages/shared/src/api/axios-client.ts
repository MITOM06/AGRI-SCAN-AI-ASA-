import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { getTokenStorage } from './token-manager';

declare module 'axios' {
  export interface AxiosInstance {
    upload<T = any, R = AxiosResponse<T>>(
      url: string,
      data: FormData,
      config?: AxiosRequestConfig
    ): Promise<R>;
  }
}

const BASE_URL = 'http://localhost:4000';

export const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Định nghĩa logic thực sự cho hàm upload (Thực chất là gọi POST và ép header chứa file)
axiosClient.upload = function <T = any, R = AxiosResponse<T>>(
  url: string,
  data: FormData,
  config?: AxiosRequestConfig
): Promise<R> {
  return this.post<T, R>(url, data, {
    ...config,
    headers: {
      ...config?.headers,
      'Content-Type': 'multipart/form-data', // Ép kiểu để gửi file ảnh
    },
  });
};

// BƯỚC CHẶN TRƯỚC KHI GỬI: Tự động gắn Access Token
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

// BƯỚC CHẶN KHI NHẬN KẾT QUẢ: Xử lý lỗi 401 (Hết hạn Token)
axiosClient.interceptors.response.use(
  (response) => response, // Nếu thành công thì cho qua
  async (error) => {
    const originalRequest = error.config;
    const storage = getTokenStorage();

    // Nếu lỗi 401 và không phải đang gọi API refresh (để tránh lặp vô hạn)
    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/auth/refresh') {
      originalRequest._retry = true; // Đánh dấu đã thử lại

      try {
        const refreshToken = await storage?.getRefreshToken();
        if (!refreshToken) throw new Error('Không có Refresh Token');

        // Đi xin Token mới
        const res = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken });

        // Lưu cặp Token mới
        const { accessToken, refreshToken: newRefreshToken } = res.data;
        await storage?.saveTokens(accessToken, newRefreshToken);

        // Đổi Token mới vào cái Request vừa bị xịt và gọi lại
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosClient(originalRequest);

      } catch (refreshError) {
        // Xin Token thất bại (Refresh token chết) -> Đuổi về màn hình Login
        await storage?.clearTokens();
        // Ở đây có thể bắn event để ép App chuyển trang
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);