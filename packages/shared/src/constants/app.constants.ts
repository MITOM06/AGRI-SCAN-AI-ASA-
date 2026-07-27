/**
 * App Constants - Dùng chung cho Web và Mobile
 */

export const APP_NAME = 'Agri-Scan AI';
export const APP_VERSION = '1.0.0';
export const APP_DESCRIPTION = 'Bác sĩ cây trồng thông minh - AI Diagnosis for Plants';

// API Configuration
export const API_TIMEOUT = 30000; // 30 seconds
export const API_RETRY_COUNT = 3;

/**
 * Giá trị "cây khỏe mạnh" lưu trong `plant.currentCondition` (MongoDB).
 *
 * Đây là DỮ LIỆU, không phải nhãn hiển thị — KHÔNG dịch, KHÔNG đưa vào i18n.
 * Backend và ai-service cùng ghi/đọc chuỗi này, đổi nó sẽ làm mọi phép so sánh
 * "cây có khỏe không" trên web và mobile sai âm thầm.
 * Nhãn hiển thị tương ứng là `myGarden.healthy`.
 */
export const HEALTHY_CONDITION = 'Khỏe mạnh';

/**
 * Tên bệnh lưu trong collection `diseases` cho trường hợp "không có bệnh"
 * (`disease.name`). Dữ liệu → không dịch; client chỉ so sánh để không đếm nó
 * vào số bệnh đã phát hiện. Nhãn hiển thị tương ứng là `myGarden.plantHealthy`.
 */
export const HEALTHY_DISEASE_NAME = 'Cây khỏe mạnh';

/**
 * Tên cây mặc định khi AI không nhận diện được, GỬI LÊN API trong payload
 * addPlant. Cũng là dữ liệu → không dịch. Nhãn hiển thị: `myGarden.defaultPlantName`.
 */
export const DEFAULT_PLANT_NAME = 'Cây trồng';

/**
 * Giá trị `careRoadmap[].fertilizerAction` do ai-service sinh ra khi ngày đó
 * chưa cần bón phân. Dữ liệu → không dịch; web/mobile chỉ so sánh để ẩn dòng đó.
 */
export const NO_FERTILIZER_NEEDED = 'Chưa cần bón phân';

/** Mã locale để định dạng ngày/giờ theo ngôn ngữ đang chọn. */
export const DATE_LOCALES: Record<'vi' | 'en', string> = {
  vi: 'vi-VN',
  en: 'en-GB',
};

// Pagination defaults
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;

// Image upload constraints
export const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const ALLOWED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

// AI Prediction thresholds
export const MIN_CONFIDENCE_THRESHOLD = 0.3;  // 30% - Hiển thị tối thiểu
export const HIGH_CONFIDENCE_THRESHOLD = 0.8; // 80% - Độ tin cậy cao

// Freemium limits (theo Business Model trong DOC)
export const FREE_SCAN_LIMIT_PER_DAY = 3;
