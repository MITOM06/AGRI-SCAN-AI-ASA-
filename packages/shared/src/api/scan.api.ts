import { axiosClient } from "./axios-client";
import { getTokenStorage } from "./token-manager";
import type {
  IScanResult,
  IScanHistoryListItem,
  IScanHistoryDetail,
} from "../types/scan-history.types";

// Type cho 1 tin nhắn trong hội thoại
export interface IChatMessage {
  role: "user" | "ai";
  content: string;
  timestamp: string | Date;
}

// Type cho response khi gửi tin nhắn
export interface IChatResponse {
  sessionId: string | null; // null nếu chưa đăng nhập
  question: string;
  answer: string;
}

// Type cho 1 session (metadata, không có messages)
export interface IChatSession {
  sessionId: string;
  title: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

// Type cho nội dung 1 session (có messages)
export interface IChatSessionDetail {
  sessionId: string;
  title: string | null;
  messages: IChatMessage[];
}

export const scanApi = {
  /**
   * 1. API Quét ảnh chẩn đoán bệnh
   * Gọi đến: POST /scan/analyze
   */
  scanImage: async (file: File | Blob | any): Promise<IScanResult> => {
    const formData = new FormData();
    formData.append("image", file);

    // Dùng post và ép cứng headers + timeout 60 giây
    const res = await axiosClient.post<IScanResult>("/scan/analyze", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 60000, // 60 giây
    });
    return res.data;
  },

  /**
   * 2. API Chat với Trợ lý ảo AI (RAG)
   * - Đã đăng nhập: Gọi POST /scan/chat (lưu lịch sử, hỗ trợ session)
   * - Chưa đăng nhập: Gọi POST /scan/guest-chat (không lưu lịch sử)
   */
  chatWithAi: async (
    question: string,
    label?: string,
    sessionId?: string,
  ): Promise<IChatResponse> => {
    const tokenStorage = getTokenStorage();
    const token = tokenStorage ? await tokenStorage.getAccessToken() : null;

    if (!token) {
      // Guest user — use guest endpoint (no auth required, no history saved)
      const res = await axiosClient.post<IChatResponse>('/scan/guest-chat', {
        question,
        label,
      });
      return res.data;
    }

    const res = await axiosClient.post<IChatResponse>('/scan/chat', {
      question,
      label,
      sessionId,
    });
    return res.data;
  },

  /**
   * 3. Lấy danh sách tất cả sessions của user (chỉ metadata)
   * Gọi đến: GET /scan/chat/history
   * - Trả về [] nếu chưa đăng nhập
   */
  getChatHistory: async (): Promise<IChatSession[]> => {
    const res = await axiosClient.get<IChatSession[]>("/scan/chat/history");
    return res.data;
  },

  /**
   * 4. Lấy nội dung tin nhắn của 1 session cụ thể
   * Gọi đến: GET /scan/chat/sessions/:sessionId
   */
  getSessionMessages: async (
    sessionId: string,
  ): Promise<IChatSessionDetail> => {
    const res = await axiosClient.get<IChatSessionDetail>(
      `/scan/chat/sessions/${sessionId}`,
    );
    return res.data;
  },

  /**
   * 5. Lấy lịch sử các lần quét cây (Bệnh án)
   * Gọi đến: GET /scan/history
   */
  getScanHistory: async (): Promise<IScanHistoryListItem[]> => {
    const res = await axiosClient.get<IScanHistoryListItem[]>("/scan/history");
    return res.data;
  },

  /**
   * 6. User đánh giá AI nhận diện đúng hay sai
   * Gọi đến: PATCH /scan/history/:id/feedback
   */
  sendFeedback: async (scanId: string, isAccurate: boolean): Promise<void> => {
    await axiosClient.patch(`/scan/history/${scanId}/feedback`, { isAccurate });
  },

  /**
   * 7. Lấy chi tiết 1 lần quét
   * Gọi đến: GET /scan/history/:id
   */
  getScanDetail: async (scanId: string): Promise<IScanHistoryDetail> => {
    const res = await axiosClient.get<IScanHistoryDetail>(
      `/scan/history/${scanId}`,
    );
    return res.data;
  },
};
