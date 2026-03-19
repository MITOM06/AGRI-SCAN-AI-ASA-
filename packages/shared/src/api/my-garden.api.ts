import { axiosClient } from "./axios-client"; // Hàm axiosClient đã được bạn config sẵn
import { IMyGardenPlant } from "../types/my-garden.types";

// Định nghĩa DTO cho đầu vào của hàm thêm cây
export interface AddPlantPayload {
  plantName: string; // Sửa label thành plantName
  diseaseName: string; // Thêm diseaseName
  imageUrl?: string;
  customName?: string;
  userGoal: string;
  lat: number;
  lon: number;
}

export const myGardenApi = {
  // 1. Lấy danh sách cây đang trồng
  getUserGarden: async (): Promise<IMyGardenPlant[]> => {
    const response = await axiosClient.get("/api/my-garden");
    return response.data;
  },

  // 2. Thêm cây vào vườn (Gọi LLM tạo lộ trình)
  addPlantToGarden: async (
    payload: AddPlantPayload,
  ): Promise<{ message: string; data: IMyGardenPlant }> => {
    const response = await axiosClient.post("/api/my-garden", payload);
    return response.data;
  },

  // 3. Check-in tiến trình hằng ngày
  // 🔥 ĐÃ SỬA: Thêm imageUrl, lat, lon vào payload
  dailyCheckIn: async (
    gardenId: string,
    payload: { currentDay: number; imageUrl: string; lat: number; lon: number },
  ): Promise<{
    requireRegeneration: boolean;
    message: string;
    progressPercentage?: number;
    status?: string;
  }> => {
    const response = await axiosClient.post(
      `/api/my-garden/${gardenId}/check-in`,
      payload,
    );
    return response.data;
  },

  // 4. Xóa cây (Bỏ cuộc / Hủy lộ trình)
  removePlant: async (gardenId: string): Promise<{ message: string }> => {
    const response = await axiosClient.delete(`/api/my-garden/${gardenId}`);
    return response.data;
  },
};
