/**
 * Scan Service - Xử lý API chẩn đoán bằng AI
 */

import { apiClient } from '@/lib/api-client';
import { API_ENDPOINTS } from '@agri-scan/shared';
import type {
  IScanHistory,
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
    const response = await apiClient.upload<IScanResult>(
      API_ENDPOINTS.SCAN.UPLOAD,
      imageFile,
      'image'
    );
    return response.data;
  },

  /**
   * Lấy kết quả chẩn đoán theo ID
   */
  async getScanResult(scanId: string): Promise<IScanHistoryDetail> {
    const response = await apiClient.get<IScanHistoryDetail>(
      API_ENDPOINTS.SCAN.RESULT(scanId)
    );
    return response.data;
  },

  /**
   * Gửi feedback cho kết quả chẩn đoán (đúng/sai)
   */
  async sendFeedback(scanId: string, isAccurate: boolean): Promise<void> {
    await apiClient.post(
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
    const response = await apiClient.get<IPaginatedResponse<IScanHistoryListItem>>(
      `${API_ENDPOINTS.HISTORY.MY_HISTORY}${queryString}`
    );
    return response.data;
  },

  /**
   * Lấy chi tiết một lịch sử quét
   */
  async getHistoryById(historyId: string): Promise<IScanHistoryDetail> {
    const response = await apiClient.get<IScanHistoryDetail>(
      API_ENDPOINTS.HISTORY.BY_ID(historyId)
    );
    return response.data;
  },

  /**
   * Xóa lịch sử quét
   */
  async deleteHistory(historyId: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.HISTORY.BY_ID(historyId));
  },
};
