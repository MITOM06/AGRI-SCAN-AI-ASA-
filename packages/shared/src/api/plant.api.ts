import { axiosClient } from './axios-client'; 
import { IPlantListItem, IPlantDetail, IPlantCreate } from '../types/plant.types';

export const plantApi = {
  /**
   * Lấy danh sách cây trồng cho trang Từ Điển (đã được APPROVED)
   */
  getAllPlants: async (): Promise<IPlantListItem[]> => {
    const response = await axiosClient.get('/plants');
    return response.data;
  },

  /**
   * Lấy chi tiết một loại cây (bao gồm cả danh sách bệnh)
   */
  getPlantById: async (id: string): Promise<IPlantDetail> => {
    const response = await axiosClient.get(`/plants/${id}`);
    return response.data;
  },

  /**
   * Đóng góp kiến thức (Tự động vào trạng thái PENDING)
   */
  contributePlant: async (data: IPlantCreate): Promise<any> => {
    const response = await axiosClient.post('/plants/contribute', data);
    return response.data;
  },
};