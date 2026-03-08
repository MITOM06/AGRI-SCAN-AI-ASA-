import { axiosClient } from './axios-client';
import type { 
  IScanResult, 
  IScanHistoryListItem, 
  IScanHistoryDetail 
} from '../types/scan-history.types';

// Định nghĩa thêm Type cho Chatbot để Frontend dễ gọi
export interface IChatMessage {
  role: 'user' | 'ai';
  content: string;
  timestamp: string | Date;
}

export interface IChatResponse {
  question: string;
  answer: string;
}

export const scanApi = {
  /**
   * 1. API Quét ảnh chẩn đoán bệnh
   * Gọi đến: POST /scan/analyze
   */
  scanImage: async (file: File | Blob): Promise<IScanResult> => {
    const formData = new FormData();
    // Tên field 'image' phải khớp với @UseInterceptors(FileInterceptor('image')) bên NestJS
    formData.append('image', file); 
    
    // Sử dụng hàm upload bạn đã viết sẵn trong axiosClient
    const res = await axiosClient.upload<IScanResult>('/scan/analyze', formData);
    return res.data;
  },

  /**
   * 2. API Chat với Trợ lý ảo AI (RAG)
   * Gọi đến: POST /scan/chat
   */
  chatWithAi: async (question: string): Promise<IChatResponse> => {
    const res = await axiosClient.post<IChatResponse>('/scan/chat', { question });
    return res.data;
  },

  /**
   * 3. Lấy lịch sử đoạn chat của người dùng
   * Gọi đến: GET /scan/chat/history
   */
  getChatHistory: async (): Promise<IChatMessage[]> => {
    const res = await axiosClient.get<IChatMessage[]>('/scan/chat/history');
    return res.data;
  },

  /**
   * 4. Lấy lịch sử các lần quét cây (Bệnh án)
   * Gọi đến: GET /scan/history
   */
  getScanHistory: async (): Promise<IScanHistoryListItem[]> => {
    const res = await axiosClient.get<IScanHistoryListItem[]>('/scan/history');
    return res.data;
  },

  /**
   * 5. User đánh giá AI nhận diện đúng hay sai
   * Gọi đến: PATCH /scan/history/:id/feedback
   */
  sendFeedback: async (scanId: string, isAccurate: boolean): Promise<void> => {
    await axiosClient.patch(`/scan/history/${scanId}/feedback`, { isAccurate });
  },

  /**
   * 6. Lấy chi tiết 1 lần quét (tùy chọn nếu bạn có làm API Get by ID bên backend)
   * Gọi đến: GET /scan/history/:id
   */
  getScanDetail: async (scanId: string): Promise<IScanHistoryDetail> => {
    const res = await axiosClient.get<IScanHistoryDetail>(`/scan/history/${scanId}`);
    return res.data;
  }
};