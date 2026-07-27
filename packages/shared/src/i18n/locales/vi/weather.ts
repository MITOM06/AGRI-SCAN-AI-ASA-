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

  // ── Mobile ────────────────────────────────────────────────────────────
  locating: "Đang định vị...",
  yourLocation: "Vị trí của bạn",
  currentLocationWeb: "Vị trí hiện tại (Web)",
  loadFailed: "Không thể tải dữ liệu thời tiết.",
  loadingStation: "Đang lấy dữ liệu trạm khí tượng...",

  labelHumidityShort: "Độ ẩm",
  labelWindShort: "Gió",
  labelRainShort: "Mưa",
  labelPressure: "Áp suất",
  labelVisibility: "Tầm nhìn",
  labelSunrise: "Bình minh",
  labelSunset: "Hoàng hôn",
  moonTonight: "Mặt trăng đêm nay",

  goldenHourTitle: "Thời điểm lý tưởng nhất",
  goldenHourGood: "Gió êm, ráo nước. Rất tốt để phun thuốc, bón phân.",
  goldenHourBad: "Hôm nay thời tiết bất lợi, không nên phun xịt hóa chất.",
  forecast8Days: "Dự báo 8 ngày tới",
  weatherDetail: "Chi tiết thời tiết",
  plantDoctorAnalysis: "Bác sĩ cây trồng phân tích",
  noAdviceToday: "Không có lời khuyên đặc biệt cho ngày này.",
  next24Hours: "🕒 Biến động 24 giờ tới",
  nowShort: "Bây giờ",

  // Thứ trong tuần (dự báo nhiều ngày)
  tomorrow: "Ngày mai",
  sunday: "Chủ nhật",
  weekdayN: "Thứ {n}",

  /**
   * Mô tả thời tiết từ OpenWeatherMap.
   *
   * KEY chính là chuỗi `description` mà OWM trả về (tiếng Anh, chữ thường).
   * Bản `en` giữ nguyên câu tiếng Anh đã viết hoa cho đẹp; bản `vi` là bản dịch.
   * Trước đây đây là một object VI hardcode trong apps/mobile/app/weather.tsx.
   */
  conditions: {
    "clear sky": "Trời quang đãng",
    "few clouds": "Ít mây",
    "scattered clouds": "Mây rải rác",
    "broken clouds": "Nhiều mây",
    "overcast clouds": "Mây u ám",
    "light rain": "Mưa nhỏ",
    "moderate rain": "Mưa vừa",
    "heavy intensity rain": "Mưa to",
    "very heavy rain": "Mưa rất to",
    "extreme rain": "Mưa cực to",
    "freezing rain": "Mưa lạnh buốt",
    "light intensity shower rain": "Mưa rào nhẹ",
    "shower rain": "Mưa rào",
    "heavy intensity shower rain": "Mưa rào to",
    thunderstorm: "Dông bão",
    "thunderstorm with light rain": "Dông và mưa nhỏ",
    "thunderstorm with rain": "Dông kèm mưa",
    "thunderstorm with heavy rain": "Dông và mưa to",
    snow: "Tuyết rơi",
    mist: "Sương mù nhẹ",
    fog: "Sương mù dày",
    haze: "Sương mù",
    dust: "Bụi mù",
  },

  /** Câu tóm tắt ngày, suy ra từ summary của OWM. */
  summaries: {
    cloudyWithSun: "Dự báo một ngày nhiều mây xen lẫn trời nắng hanh.",
    cloudyWithRain: "Dự báo một ngày nhiều mây kèm theo mưa.",
    partlyCloudy: "Dự báo một ngày nhiều mây.",
    clear: "Trời quang đãng, nắng đẹp rực rỡ.",
    rain: "Dự báo có mưa, thời tiết ẩm ướt.",
  },

  /** Pha mặt trăng. */
  moonPhases: {
    new: "Trăng non",
    waxingCrescent: "Trăng lưỡi liềm",
    firstQuarter: "Bán nguyệt đầu tháng",
    waxingGibbous: "Trăng khuyết",
    full: "Trăng tròn",
    waningGibbous: "Trăng khuyết cuối",
    lastQuarter: "Bán nguyệt cuối tháng",
    waningCrescent: "Trăng tàn",
  },

  /** Cảnh báo cho nhà nông. */
  alerts: {
    heatTitle: "🔥 Nắng nóng gay gắt",
    heatMessage:
      "Nhiệt độ lên tới {temp}°C. Ưu tiên tưới đẫm vào sáng sớm hoặc chiều mát.",
    rainTitle: "🌧️ Nguy cơ mưa lớn",
    rainMessage:
      "Xác suất mưa {pop}%. Tạm dừng phun xịt hóa chất, kiểm tra hệ thống thoát nước.",
    windTitle: "💨 Cảnh báo gió mạnh",
    windMessage:
      "Gió thổi tốc độ {speed}m/s. Cần gia cố giàn leo, chằng chống cây cảnh.",
    goodTitle: "🌱 Thời tiết thuận lợi",
    goodMessage:
      "Điều kiện sinh trưởng lý tưởng. Thích hợp cho mọi hoạt động: bón phân, phun thuốc, cắt tỉa.",
  },
} as const;
