/** Trang thời tiết nông nghiệp. */
export const weather = {
  loading: "Đang đồng bộ dữ liệu vệ tinh...",
  currentLocation: "Vị trí hiện tại",
  forecastAt: "Dự báo lúc {time}",
  updatedNow: "Cập nhật ngay",

  // Bộ lọc loại cây
  cropAll: "Tất cả",
  cropVegetable: "Rau củ",
  cropFruit: "Cây quả",
  cropFlower: "Hoa cảnh",

  // Cảnh báo
  noRisk: "Không có rủi ro thiên tai trong khung giờ này.",

  // Chỉ số
  feelsLike: "Cảm giác",
  rainChance: "Xác suất mưa:",
  windSpeed: "Tốc độ Gió",
  humidity: "Độ ẩm khí",
  uvIndex: "Chỉ số UV",
  uvLow: "Thấp",
  uvModerate: "Vừa",
  uvHigh: "Cao",
  uvExtreme: "Gắt",
  hourly24: "Diễn biến chi tiết 24 giờ",
  pressure: "Áp suất khí",
  now: "Hiện tại",

  // Bác sĩ cây trồng
  plantDoctor: "Bác sĩ cây trồng",
  healthyDefault: "Sức khỏe ổn định",
  healthyDefaultDesc:
    "Điều kiện thời tiết đang rất tốt cho cây phát triển khỏe mạnh.",

  // Dự báo nhiều ngày
  eightDayCycle: "Chu kỳ 8 ngày",
  today: "Hôm nay",
  stableWeather: "Thời tiết ổn định",

  // Bản đồ vùng miền
  exploreMore: "Bạn muốn khám phá thêm?",
  collapse: "Thu gọn",
  expandMap: "Mở rộng bản đồ & Vùng",
  regionalData: "Dữ liệu các khu vực",
  regionAll: "Tất cả",
  regionNorth: "Bắc Bộ",
  regionSouth: "Nam Bộ",
  cityHanoi: "Hà Nội",
  cityHanoiStatus: "Trời quang đãng",
  cityDalat: "Đà Lạt",
  cityDalatStatus: "Có sương mù nhẹ",
  regionalNote:
    "Dữ liệu vệ tinh các vùng miền khác đang được trích xuất thời gian thực.",
} as const;
