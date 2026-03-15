import { API_ENDPOINTS } from "../constants";
import { axiosClient } from "./axios-client";

// Kiểm tra lại cổng Backend của bạn là 3000 hay 4000 nhé!
const BASE_URL = "http://localhost:4000";

export const authApi = {
  login: async (data: any) => {
    const response = await axiosClient.post(API_ENDPOINTS.AUTH.LOGIN, data);
    return response.data;
  },

  register: async (data: any) => {
    const response = await axiosClient.post(API_ENDPOINTS.AUTH.REGISTER, data);
    return response.data;
  },

  forgotPassword: async (email: string) => {
    const response = await axiosClient.post(
      API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
      { email },
    );
    return response.data;
  },

  verifyOtp: async (email: string, otp: string) => {
    const response = await axiosClient.post(API_ENDPOINTS.AUTH.VERIFY_OTP, {
      email,
      otp,
    });
    return response.data;
  },

  resetPassword: async (data: any) => {
    const response = await axiosClient.post(
      API_ENDPOINTS.AUTH.RESET_PASSWORD,
      data,
    );
    return response.data;
  },

  getProfile: async () =>
    (await axiosClient.get(API_ENDPOINTS.AUTH.PROFILE)).data,

  logout: async () => {
    const response = await axiosClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    return response.data;
  },

  loginWithGoogle: () => {
    // Sử dụng hằng số từ API_ENDPOINTS
    window.location.href = `${BASE_URL}${API_ENDPOINTS.AUTH.GOOGLE_LOGIN}`;
  },

  

  loginWithFacebook: () => {
    window.location.href = `${BASE_URL}${API_ENDPOINTS.AUTH.FACEBOOK_LOGIN}`;
  },

  setPassword: async (newPassword: string) => {
    const response = await axiosClient.post(API_ENDPOINTS.AUTH.SET_PASSWORD, {
      newPassword,
    });
    return response.data;
  },
  // Thêm hàm này vào dưới hàm login cũ
  verifyGoogleTokenForMobile: async (idToken: string) => {
    const response = await axiosClient.post("/auth/google/verify-token", {
      idToken,
    });
    return response.data;
  },
};
