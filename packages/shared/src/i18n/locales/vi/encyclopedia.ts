/** Từ điển cây trồng: bộ lọc, danh sách, chi tiết cây. */
export const encyclopedia = {
  title: "Từ Điển Cây Trồng",
  subtitle:
    "Khám phá thế giới thực vật phong phú với thông tin chi tiết về đặc điểm, công dụng và cách chăm sóc.",

  // Bộ lọc
  filters: "Bộ lọc",
  clearFilters: "Xóa bộ lọc",
  filterType: "Loại cây",
  filterGrowth: "Tốc độ sinh trưởng",
  filterLight: "Nhu cầu ánh sáng",
  filterWater: "Nhu cầu nước",
  searchPlaceholder: "Tìm kiếm theo tên cây hoặc tên khoa học...",
  clearSearch: "Xóa tìm kiếm",

  // Giá trị bộ lọc
  typeShade: "Cây bóng mát",
  typeLandscape: "Cây cảnh quan",
  typeTimber: "Cây lấy gỗ",
  typeFruit: "Cây ăn quả",
  typeSpiritual: "Cây tâm linh",
  typeFengShui: "Cây phong thủy",

  growthFast: "Nhanh",
  growthMedium: "Trung bình",
  growthSlow: "Chậm",

  lightFull: "Ưa sáng",
  lightShade: "Ưa bóng",
  lightPartial: "Bán phần",

  waterLow: "Ít",
  waterMedium: "Trung bình",
  waterHigh: "Nhiều",

  // Trạng thái
  loadListFailed: "Không thể tải danh sách cây. Vui lòng thử lại.",
  loadDetailFailed: "Không thể tải thông tin chi tiết. Vui lòng thử lại.",
  noResults: "Không tìm thấy cây nào phù hợp.",
  approved: "Đã duyệt",
  pending: "Chờ duyệt",

  // Nhãn chi tiết
  labelGrowth: "Tốc độ lớn",
  labelLight: "Ánh sáng",
  labelWater: "Nước",
  labelFamily: "Họ",
  labelBloomSeason: "Mùa ra hoa",
  labelPlantingSite: "Vị trí trồng",
  labelSoilType: "Loại đất",
  labelCommonDiseases: "Bệnh thường gặp",
  labelDescription: "Mô tả",
  labelUses: "Công dụng",
  labelCare: "Cách chăm sóc",
} as const;
