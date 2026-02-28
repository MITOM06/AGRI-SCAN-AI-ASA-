/**
 * Auth Service - Xử lý authentication cho Web
 */

import { apiClient } from '@/lib/api-client';
import { API_ENDPOINTS } from '@agri-scan/shared';
import type {
  IUserLogin,
  IUserCreate,
  IAuthResponse,
  IUserResponse
} from '@agri-scan/shared';

export const authService = {
  /**
   * Đăng nhập
   */
  async login(credentials: IUserLogin): Promise<IAuthResponse> {
    const response = await apiClient.post<IAuthResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    );

    // Lưu token vào localStorage
    if (response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
      if (response.data.refreshToken) {
        localStorage.setItem('refreshToken', response.data.refreshToken);
      }
    }

    return response.data;
  },

  /**
   * Đăng ký
   */
  async register(userData: IUserCreate): Promise<IAuthResponse> {
    const response = await apiClient.post<IAuthResponse>(
      API_ENDPOINTS.AUTH.REGISTER,
      userData
    );

    // Lưu token sau khi đăng ký thành công
    if (response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
    }

    return response.data;
  },

  /**
   * Đăng xuất
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    } finally {
      // Xóa token khỏi localStorage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  },

  /**
   * Lấy thông tin user hiện tại
   */
  async getCurrentUser(): Promise<IUserResponse> {
    const response = await apiClient.get<IUserResponse>(API_ENDPOINTS.AUTH.ME);
    return response.data;
  },

  /**
   * Refresh token
   */
  async refreshToken(): Promise<IAuthResponse> {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await apiClient.post<IAuthResponse>(
      API_ENDPOINTS.AUTH.REFRESH,
      { refreshToken }
    );

    if (response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
    }

    return response.data;
  },

  /**
   * Kiểm tra đã đăng nhập chưa
   */
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('accessToken');
  },
};
