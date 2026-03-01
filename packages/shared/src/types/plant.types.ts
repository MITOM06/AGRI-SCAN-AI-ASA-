/**
 * Plant Types - Dùng chung cho Web và Mobile
 * Khớp với Collection: plants trong MongoDB
 */

import { IDiseaseListItem } from './disease.types';

export interface IPlant {
  id: string;
  commonName: string;      // Tên thường gọi (VD: "Cà chua")
  scientificName: string;  // Tên khoa học (VD: "Solanum lycopersicum")
  family: string;          // Họ thực vật (VD: "Solanaceae")
  description: string;     // Mô tả đặc điểm sinh trưởng
  images: string[];        // Danh sách URL ảnh minh họa cây khỏe mạnh
  diseases: string[];      // Danh sách ID các bệnh thường gặp
  createdAt: Date;
  updatedAt: Date;
}

export interface IPlantCreate {
  commonName: string;
  scientificName: string;
  family?: string;
  description?: string;
  images?: string[];
  diseases?: string[];
}

export interface IPlantListItem {
  id: string;
  commonName: string;
  scientificName: string;
  family: string;
  images: string[];
}

export interface IPlantDetail extends IPlant {
  diseasesInfo: IDiseaseListItem[]; // Thông tin chi tiết các bệnh
}
