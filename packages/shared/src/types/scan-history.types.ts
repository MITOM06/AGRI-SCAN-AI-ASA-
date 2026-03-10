/**
 * Scan History Types - Dùng chung cho Web và Mobile
 * Khớp với Collection: scan_histories trong MongoDB
 */

import { IDisease } from './disease.types';

export interface IAIPrediction {
  diseaseId: string;
  diseaseName?: string;    // Tên bệnh để hiển thị
  confidence: number;      // Độ tin cậy (0.0 - 1.0, VD: 0.95 = 95%)
}

/**
 * Kết quả thô từ FastAPI YOLO model, trả về trong IScanResult.predictions
 * Không giống IAIPrediction — đây là format của AI service, không phải DB
 */
export interface IYoloPrediction {
  yolo_label: string;      // Nhãn bệnh từ YOLO model (ví dụ: "Bac_la_lua")
  confidence: number;      // Độ tin cậy (0.0 - 1.0)
  success: boolean;
}

export interface IScanHistory {
  id: string;
  userId: string;
  imageUrl: string;        // URL ảnh người dùng upload
  aiPredictions: IAIPrediction[];
  isAccurate?: boolean;    // Người dùng feedback đúng/sai
  scannedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IScanHistoryCreate {
  imageUrl: string;
  aiPredictions: IAIPrediction[];
}

export interface IScanHistoryListItem {
  id: string;
  imageUrl: string;
  topPrediction: IAIPrediction;  // Dự đoán có độ tin cậy cao nhất
  scannedAt: Date;
}

export interface IScanHistoryDetail extends IScanHistory {
  predictionsWithDetails: Array<{
    disease: IDisease;
    confidence: number;
  }>;
}

export interface IScanUploadRequest {
  image: File | Blob;      // File ảnh để upload
}

export interface IScanResult {
  scanHistoryId: string;
  imageUrl: string;
  predictions: IYoloPrediction[];  // Kết quả thô từ YOLO/FastAPI
  topDisease?: IDisease;   // Chi tiết bệnh có độ tin cậy cao nhất (đã populate từ DB)
}
