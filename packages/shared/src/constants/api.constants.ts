/**
 * API Endpoints - Dùng chung cho Web và Mobile
 * Định nghĩa các endpoint của Backend NestJS
 */

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
    FORGOT_PASSWORD: '/auth/forgot-password',
    VERIFY_OTP: '/auth/verify-otp',
    RESET_PASSWORD: '/auth/reset-password',
  },

  // Users
  USERS: {
    BASE: '/users',
    BY_ID: (id: string) => `/users/${id}`,
    PROFILE: '/users/profile',
  },

  // Plants (Từ điển thực vật học)
  PLANTS: {
    BASE: '/plants',
    BY_ID: (id: string) => `/plants/${id}`,
    SEARCH: '/plants/search',
    BY_DISEASE: (diseaseId: string) => `/plants/by-disease/${diseaseId}`,
  },

  // Diseases (Từ điển bệnh lý)
  DISEASES: {
    BASE: '/diseases',
    BY_ID: (id: string) => `/diseases/${id}`,
    SEARCH: '/diseases/search',
    BY_TYPE: (type: string) => `/diseases/by-type/${type}`,
  },

  // AI Scan (Chẩn đoán bằng AI)
  SCAN: {
    UPLOAD: '/scan/upload',
    ANALYZE: '/scan/analyze',
    RESULT: (id: string) => `/scan/result/${id}`,
    FEEDBACK: (id: string) => `/scan/feedback/${id}`,
  },

  // Scan History (Lịch sử quét)
  HISTORY: {
    BASE: '/history',
    BY_ID: (id: string) => `/history/${id}`,
    MY_HISTORY: '/history/me',
  },
} as const;
