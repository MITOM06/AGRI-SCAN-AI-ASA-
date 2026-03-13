export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile',
    FORGOT_PASSWORD: '/auth/forgot-password',
    VERIFY_OTP: '/auth/verify-otp',
    RESET_PASSWORD: '/auth/reset-password',
    GOOGLE_LOGIN: '/auth/google',
    FACEBOOK_LOGIN: '/auth/facebook',
    SET_PASSWORD: '/auth/set-password',
  },

  // Users
  USERS: {
    BASE: '/users',
    BY_ID: (id: string) => `/users/${id}`,
    PROFILE: '/users/profile',
    UPGRADE: '/users/upgrade',
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

  // Weather
  WEATHER: {
    GET_WEATHER: '/weather',
  },

  // ── ADMIN ────────────────────────────────────────────────────────────────────
  ADMIN: {
    DASHBOARD: '/admin/dashboard',

    // Quản lý user
    USERS: '/admin/users',
    USER_PLAN: (userId: string) => `/admin/users/${userId}/plan`,

    // Báo cáo
    REPORTS: {
      USERS: '/admin/reports/users',
      REVENUE: '/admin/reports/revenue',
      COMPARE: '/admin/reports/compare',
    },

    // Xuất file CSV
    EXPORT: {
      REVENUE: '/admin/export/revenue',
      USERS: '/admin/export/users',
    },

    // Feedback
    FEEDBACK: {
      BASE: '/feedback',                                          // POST (user gửi)
      LIST: '/admin/feedbacks',                                   // GET (admin xem)
      REPLY: (feedbackId: string) => `/admin/feedbacks/${feedbackId}/reply`, // POST (admin reply)
    },
  },
} as const;