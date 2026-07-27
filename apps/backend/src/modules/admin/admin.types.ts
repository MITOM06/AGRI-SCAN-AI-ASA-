// Shape kết quả các aggregate dùng chung trong module admin

export interface RevenueSumRow {
  total: number;
  count?: number;
}

export interface RevenueReportRow {
  _id: string;
  totalRevenue: number;
  totalTransactions: number;
  byPlan: { plan: string; revenue: number; count: number }[];
}

export interface TimeSeriesRow {
  date: string;
  count: number;
}

// Time-series doanh thu theo gói (dùng cho biểu đồ Reports.tsx)
export interface RevenueSeriesPoint {
  date: string; // 'YYYY-MM-DD'
  revenue: number; // tổng doanh thu trong ngày (VND)
  PREMIUM: number; // doanh thu gói PREMIUM
  VIP: number; // doanh thu gói VIP
}

// Time-series lượt dùng hệ thống
export interface UsageSeriesPoint {
  date: string; // 'YYYY-MM-DD'
  images: number; // số lượt quét ảnh trong ngày
  prompts: number; // số câu hỏi chat AI trong ngày
}

// Shape trung gian của aggregate
export interface RevenueDayPlanRow {
  date: string;
  plan: string;
  revenue: number;
}

export interface CountByDateRow {
  date: string;
  count: number;
}
