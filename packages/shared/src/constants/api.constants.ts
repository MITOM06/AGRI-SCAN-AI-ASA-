/**
 * API Endpoints - Dùng chung cho Web và Mobile
 */

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    // BUG FIX: '/auth/me' không tồn tại trong controller → đổi thành '/auth/profile'
    PROFILE: '/auth/profile',
    // BUG FIX: 3 endpoint forgot-password flow còn thiếu trong constants
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
    ANALYZE: '/scan/analyze',
    CHAT: '/scan/chat',
    GUEST_CHAT: '/scan/guest-chat',
    FEEDBACK: (id: string) => `/scan/history/${id}/feedback`, 
  },

  // Scan History (Lịch sử quét)
  HISTORY: {
    SCAN_BASE: '/scan/history',         
    CHAT_BASE: '/scan/chat/history',     
    SESSION: (id: string) => `/scan/chat/sessions/${id}`, 
  },
} as const;
