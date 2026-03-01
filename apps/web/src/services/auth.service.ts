/**
 * Auth Service - Xử lý authentication cho Web
 */

import { apiClient } from '@/lib/api-client';
import { API_ENDPOINTS, UserRole } from '@agri-scan/shared';
import type {
  IUserLogin,
  IUserCreate,
  IAuthResponse,
  IUserResponse,
  ForgotPasswordFormData,
  OtpFormData,
  ResetPasswordFormData
} from '@agri-scan/shared';

export const authService = {
  /**
   * Đăng nhập
   */
  async login(credentials: IUserLogin): Promise<IAuthResponse> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock response data
    const mockResponse: IAuthResponse = {
      accessToken: 'mock-access-token-xyz123',
      refreshToken: 'mock-refresh-token-abc456',
      user: {
        id: '1',
        email: credentials.email,
        fullName: 'John Doe',
        role: UserRole.FARMER,
      }
    };

    // Lưu token vào localStorage
    localStorage.setItem('accessToken', mockResponse.accessToken);
    if (mockResponse.refreshToken) {
      localStorage.setItem('refreshToken', mockResponse.refreshToken);
    }

    return mockResponse;
  },

  /**
   * Đăng ký
   */
  async register(userData: IUserCreate): Promise<IAuthResponse> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock response data
    const mockResponse: IAuthResponse = {
      accessToken: 'mock-access-token-register-xyz123',
      refreshToken: 'mock-refresh-token-register-abc456',
      user: {
        id: '2',
        email: userData.email,
        fullName: userData.fullName,
        role: userData.role || UserRole.FARMER,
      }
    };

    // Lưu token sau khi đăng ký thành công
    localStorage.setItem('accessToken', mockResponse.accessToken);

    return mockResponse;
  },

  /**
   * Đăng xuất
   */
  async logout(): Promise<void> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Xóa token khỏi localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },

  /**
   * Lấy thông tin user hiện tại
   */
  async getCurrentUser(): Promise<IUserResponse> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Mock user data
    const mockUser: IUserResponse = {
      id: '1',
      email: 'user@example.com',
      fullName: 'John Doe',
      role: UserRole.FARMER,
    };

    return mockUser;
  },

  /**
   * Refresh token
   */
  async refreshToken(): Promise<IAuthResponse> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const mockResponse: IAuthResponse = {
      accessToken: 'mock-new-access-token-refreshed-xyz789',
      refreshToken: 'mock-new-refresh-token-refreshed-def012',
      user: {
        id: '1',
        email: 'user@example.com',
        fullName: 'John Doe',
        role: UserRole.FARMER,
      }
    };

    localStorage.setItem('accessToken', mockResponse.accessToken);

    return mockResponse;
  },

  /**
   * Kiểm tra đã đăng nhập chưa
   */
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('accessToken');
  },

  /**
   * Gửi OTP cho forgot password
   */
  async forgotPassword(data: ForgotPasswordFormData): Promise<void> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    console.log('Mock: OTP sent to', data.email);
  },

  /**
   * Xác thực OTP
   */
  async verifyOtp(data: OtpFormData & { email: string }): Promise<void> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock validation - accept "123456" as valid OTP
    if (data.otp !== "123456") {
      throw new Error("Invalid OTP");
    }

    console.log('Mock: OTP verified for', data.email);
  },

  /**
   * Đặt lại mật khẩu
   */
  async resetPassword(data: ResetPasswordFormData & { email: string }): Promise<void> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('Mock: Password reset successfully for', data.email);
  },
};
