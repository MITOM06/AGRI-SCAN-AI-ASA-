import axios from 'axios';
import { getTokenStorage } from './token-manager';

// Điền IP máy của bạn hoặc localhost. Nếu chạy máy ảo Android thì dùng 10.0.2.2
const BASE_URL = 'http://localhost:3000'; 

export const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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