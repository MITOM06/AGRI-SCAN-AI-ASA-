/**
 * Disease Service - Xử lý API liên quan đến bệnh cây (Từ điển bệnh lý)
 */

import { apiClient } from '@/lib/api-client';
import { API_ENDPOINTS } from '@agri-scan/shared';
import type {
  IDisease,
  IDiseaseCreate,
  IDiseaseListItem,
  DiseaseType,
  IPaginatedResponse,
  ISearchParams
} from '@agri-scan/shared';

export const diseaseService = {
  /**
   * Lấy danh sách bệnh (có phân trang)
   */
  async getDiseases(params?: ISearchParams): Promise<IPaginatedResponse<IDiseaseListItem>> {
    const queryString = params
      ? `?${new URLSearchParams(params as Record<string, string>).toString()}`
      : '';
    const response = await apiClient.get<IPaginatedResponse<IDiseaseListItem>>(
      `${API_ENDPOINTS.DISEASES.BASE}${queryString}`
    );
    return response.data;
  },

  /**
   * Lấy chi tiết bệnh theo ID
   */
  async getDiseaseById(id: string): Promise<IDisease> {
    const response = await apiClient.get<IDisease>(
      API_ENDPOINTS.DISEASES.BY_ID(id)
    );
    return response.data;
  },

  /**
   * Tìm kiếm bệnh
   */
  async searchDiseases(query: string, params?: ISearchParams): Promise<IPaginatedResponse<IDiseaseListItem>> {
    const searchParams: Record<string, string> = { query };
    if (params?.page) searchParams.page = String(params.page);
    if (params?.limit) searchParams.limit = String(params.limit);
    if (params?.sortBy) searchParams.sortBy = params.sortBy;
    if (params?.sortOrder) searchParams.sortOrder = params.sortOrder;
    const queryString = new URLSearchParams(searchParams).toString();
    const response = await apiClient.get<IPaginatedResponse<IDiseaseListItem>>(
      `${API_ENDPOINTS.DISEASES.SEARCH}?${queryString}`
    );
    return response.data;
  },

  /**
   * Lấy bệnh theo loại (Nấm, Vi khuẩn, Virus...)
   */
  async getDiseasesByType(type: DiseaseType): Promise<IDiseaseListItem[]> {
    const response = await apiClient.get<IDiseaseListItem[]>(
      API_ENDPOINTS.DISEASES.BY_TYPE(type)
    );
    return response.data;
  },

  /**
   * Tạo bệnh mới (Admin only)
   */
  async createDisease(data: IDiseaseCreate): Promise<IDisease> {
    const response = await apiClient.post<IDisease>(
      API_ENDPOINTS.DISEASES.BASE,
      data
    );
    return response.data;
  },

  /**
   * Cập nhật bệnh (Admin only)
   */
  async updateDisease(id: string, data: Partial<IDiseaseCreate>): Promise<IDisease> {
    const response = await apiClient.put<IDisease>(
      API_ENDPOINTS.DISEASES.BY_ID(id),
      data
    );
    return response.data;
  },

  /**
   * Xóa bệnh (Admin only)
   */
  async deleteDisease(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.DISEASES.BY_ID(id));
  },
};
