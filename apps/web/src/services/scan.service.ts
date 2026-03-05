import { axiosClient } from '@agri-scan/shared';
import { API_ENDPOINTS } from '@agri-scan/shared';
import type {
  IScanHistoryListItem,
  IScanHistoryDetail,
  IScanResult,
  IPaginatedResponse,
  IPaginationParams
} from '@agri-scan/shared';

export const scanService = {
  /**
   * Upload ảnh và chẩn đoán bệnh
   */
  async scanImage(imageFile: File): Promise<IScanResult> {
    // Tạo FormData chuẩn của trình duyệt để chứa file
    const formData = new FormData();
    // 'image' ở đây là tên trường (field name) mà Backend NestJS dùng @UseInterceptors(FileInterceptor('image')) để bắt lấy
    formData.append('image', imageFile); 

    // Sử dụng hàm .post() mặc định thay vì .upload()
    const response = await axiosClient.post<IScanResult>(
      API_ENDPOINTS.SCAN.UPLOAD,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data', // Ép kiểu header để gửi file
        },
      }
    );
    return response.data;
  },

  /**
   * Lấy kết quả chẩn đoán theo ID
   */
  async getScanResult(scanId: string): Promise<IScanHistoryDetail> {
    const response = await axiosClient.get<IScanHistoryDetail>(
      API_ENDPOINTS.SCAN.RESULT(scanId)
    );
    return response.data;
  },

  /**
   * Gửi feedback cho kết quả chẩn đoán (đúng/sai)
   */
  async sendFeedback(scanId: string, isAccurate: boolean): Promise<void> {
    await axiosClient.post(
      API_ENDPOINTS.SCAN.FEEDBACK(scanId),
      { isAccurate }
    );
  },

  /**
   * Lấy lịch sử quét của user hiện tại
   */
  async getMyHistory(params?: IPaginationParams): Promise<IPaginatedResponse<IScanHistoryListItem>> {
    const queryString = params
      ? `?${new URLSearchParams(params as Record<string, string>).toString()}`
      : '';
    const response = await axiosClient.get<IPaginatedResponse<IScanHistoryListItem>>(
      `${API_ENDPOINTS.HISTORY.MY_HISTORY}${queryString}`
    );
    return response.data;
  },

  /**
   * Lấy chi tiết một lịch sử quét
   */
  async getHistoryById(historyId: string): Promise<IScanHistoryDetail> {
    const response = await axiosClient.get<IScanHistoryDetail>(
      API_ENDPOINTS.HISTORY.BY_ID(historyId)
    );
    return response.data;
  },

  /**
   * Xóa lịch sử quét
   */
  async deleteHistory(historyId: string): Promise<void> {
    await axiosClient.delete(API_ENDPOINTS.HISTORY.BY_ID(historyId));
  },
};