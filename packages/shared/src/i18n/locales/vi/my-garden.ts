/**
 * Khu vườn của tôi: tổng quan, tải ảnh, kết quả chẩn đoán, theo dõi.
 *
 * LƯU Ý: chuỗi "Khỏe mạnh" dùng làm GIÁ TRỊ lưu trong `plant.currentCondition`
 * (xem HEALTHY_CONDITION trong @agri-scan/shared) — không nằm ở đây và không
 * được dịch. Chỉ nhãn hiển thị mới có key.
 */
export const myGarden = {
  // Tên mặc định
  defaultPlantName: "Cây trồng",
  noDetailYet: "Chưa có thông tin chi tiết",
  noDiagnosisYet: "Chưa có chẩn đoán",
  noIdentification: "Chưa có định danh",

  // Tải ảnh
  uploadTitlePrefix: "Bác sĩ cây trồng",
  uploadTitleHighlight: "thông minh",
  uploadSubtitle:
    "Chụp ảnh cây của bạn. AI sẽ nhận diện loại cây, chẩn đoán sức khỏe và đưa ra phác đồ chăm sóc cá nhân hóa chỉ trong vài giây.",
  uploadCta: "Chụp hoặc Tải ảnh lên",
  uploadHint:
    "Hỗ trợ định dạng JPG, PNG. Kích thước tối đa 10MB. Đảm bảo ảnh rõ nét, đủ sáng.",
  uploadPickFile: "Chọn ảnh từ thiết bị",

  // Đang phân tích
  analyzing: "AI đang phân tích...",
  analyzingStep1: "AI đang nhận diện cây trồng...",
  analyzingStep2: "Đang đối chiếu đặc điểm bệnh lý...",
  analyzingStep3: "Đang xây dựng kết quả chẩn đoán...",
  analyzingStep4: "Đang chuẩn bị gợi ý chăm sóc...",
  buildingSchedule: "AI đang tạo lộ trình chăm sóc...",
  updatingCondition: "AI đang cập nhật tình trạng cây...",

  // Tổng quan
  myGarden: "Vườn của tôi",
  totalPlants: "Tổng cây",
  healthy: "Khỏe mạnh",
  needsAttention: "Cần chú ý",
  addPlant: "Thêm cây mới",
  trackedPlants: "Cây đang theo dõi",
  realtimeUpdate: "Cập nhật theo thời gian thực",
  emptyGardenTitle: "Khu vườn của bạn đang trống",
  emptyGardenTitle2: "hãy lấp đầy nó nhé!",
  emptyGardenDesc:
    "Chụp ảnh bất kỳ cây nào—chúng tôi sẽ nhận diện và theo dõi quá trình chăm sóc, cực kỳ dễ dàng.",
  detail: "Chi tiết",
  track: "Theo dõi",
  stage: "Giai đoạn:",
  removeFromGarden: "Xóa khỏi vườn",
  statusGood: "Tốt",
  statusDiseaseWarning: "Cảnh báo bệnh",

  // Nhóm cây
  tabFruit: "Cây ăn quả",
  tabFlower: "Cây hoa",
  tabOrnamental: "Cây kiểng",
  groupFruit: "Nhóm Ăn Quả",
  groupFlower: "Nhóm Cây Hoa",
  groupOrnamental: "Nhóm Cây Kiểng",
  catalogFruit: "Danh sách Cây ăn quả hỗ trợ",
  catalogFlower: "Danh sách Cây hoa hỗ trợ",
  catalogOrnamental: "Danh sách Cây kiểng hỗ trợ",
  catalogLoading: "Đang tải danh mục cây...",
  catalogEmpty: "Chưa có cây nào trong danh mục này.",
  catalogError: "Không thể tải danh mục cây. Vui lòng thử lại.",
  viewSample: "Xem chi tiết mẫu",

  // Lịch tưới
  waterToday: "Tưới: Hôm nay",
  waterTomorrow: "Tưới: Ngày mai",
  waterInDays: "Tưới: {days} ngày tới",

  // Kết quả chẩn đoán
  identified: "Đã nhận diện thành công",
  diagnosis: "Chẩn đoán",
  plantHealthy: "Cây khỏe mạnh",
  treatmentPlan: "Phác đồ điều trị:",
  treatmentStep1: "Cách ly cây khỏi các cây khác để tránh lây nhiễm chéo.",
  treatmentStep2: "Cắt bỏ các lá/cành bị bệnh nặng bằng kéo đã sát trùng.",
  treatmentStep3:
    "Sử dụng thuốc đặc trị sinh học phun đều lên 2 mặt lá vào buổi chiều mát.",
  buyTreatment: "Mua thuốc đặc trị",
  addToMyGarden: "Thêm vào khu vườn của tôi",
  addToMyGardenHint: "Lưu lại để theo dõi lịch tưới nước và chăm sóc",
  backToGarden: "Quay lại khu vườn",
  scanAnother: "Quét cây khác",

  // Thẻ chỉ số
  labelLight: "Ánh sáng",
  labelWatering: "Tưới nước",
  valueEveryTwoDays: "2 ngày/lần",
  labelTemperature: "Nhiệt độ",
  labelDifficulty: "Độ khó",
  valueMedium: "Trung bình",

  // Cây ăn quả — mốc thời gian
  expectedFruitDate: "Dự kiến ngày ra trái",
  stageSeeding: "Gieo hạt",
  stageFloweringNow: "Ra hoa (Hiện tại)",
  stageHarvest: "Thu hoạch",
  harvestInPrefix: "Dự kiến thu hoạch trong",
  daysLeftSuffix: "ngày nữa",
  fruitTipsTitle: "Bí quyết ép cây ra trái",
  fruitTip1Title: "Siết nước",
  fruitTip1Desc:
    "Ngừng tưới nước từ 5-7 ngày để cây chuyển sang trạng thái sinh sản, kích thích ra hoa đậu quả.",
  fruitTip2Title: "Bón phân Kali cao",
  fruitTip2Desc:
    "Sử dụng phân bón NPK tỷ lệ Kali cao (vd: 15-5-20) để tăng tỷ lệ đậu trái và giúp trái ngọt hơn.",
  fruitTip3Title: "Thụ phấn nhân tạo",
  fruitTip3Desc:
    "Dùng cọ mềm quét phấn từ hoa đực sang hoa cái vào buổi sáng sớm (7h-9h) để tăng tỷ lệ đậu.",
  fruitTip4Title: "Tỉa cành vượt",
  fruitTip4Desc:
    "Cắt bỏ các cành tăm, cành vượt không có khả năng ra trái để tập trung dinh dưỡng nuôi quả.",

  // Cây hoa
  expectedBloomDate: "Dự kiến ngày ra hoa",
  stageSprouting: "Nảy mầm",
  stageBuddingNow: "Đóng nụ (Hiện tại)",
  stageFullBloom: "Nở rộ",
  bloomInPrefix: "Dự kiến hoa sẽ nở rộ trong",
  flowerTipsTitle: "Chăm sóc để hoa nở to & bền",
  flowerTip1Title: "Tăng cường ánh sáng",
  flowerTip1Desc:
    "Đảm bảo cây nhận đủ 6-8 tiếng nắng trực tiếp mỗi ngày. Thiếu nắng nụ sẽ nhỏ và dễ rụng.",
  flowerTip2Title: "Tưới nước đúng cách",
  flowerTip2Desc:
    "Chỉ tưới vào gốc, tuyệt đối không tưới lên nụ và hoa để tránh làm úng nụ và thối hoa.",
  flowerTip3Title: "Bón phân Lân (P) cao",
  flowerTip3Desc:
    "Bổ sung phân bón giàu Lân (như siêu lân) để kích thích mầm hoa phát triển mạnh, màu sắc rực rỡ.",

  // Cây kiểng
  pruningTitle: "Hướng dẫn cắt tỉa tạo dáng",
  pruningCorrectSpot: "Vị trí cắt chuẩn",
  pruningIdealAngle: "Góc cắt lý tưởng",
  pruningIdealAngleDesc:
    "Cắt cách mắt lá khoảng 1-2cm, cắt xéo 45 độ để nước không đọng lại trên vết cắt gây nấm mốc.",
  pruningTip1Title: "Tỉa thưa (Thinning)",
  pruningTip1Desc:
    "Cắt bỏ các cành mọc chen chúc bên trong tán để tạo độ thông thoáng.",
  pruningTip2Title: "Bấm ngọn (Pinching)",
  pruningTip2Desc:
    "Ngắt bỏ phần ngọn non để kích thích cây đâm chồi nách, giúp tán lá sum suê.",
  pruningTip3Title: "Vệ sinh lá",
  pruningTip3Desc:
    "Thường xuyên lau bụi trên mặt lá bằng khăn ẩm để cây quang hợp tốt nhất.",
  leafCareTitle: "Chăm sóc lá xanh bóng",
  leafTip1Title: "Độ ẩm không khí",
  leafTip1Desc:
    "Cây kiểng lá thường ưa ẩm (60-80%). Hãy phun sương lên lá 1-2 lần/ngày hoặc đặt cạnh máy phun sương.",
  leafTip2Title: "Ánh sáng tán xạ",
  leafTip2Desc:
    "Tránh ánh nắng gắt trực tiếp làm cháy lá. Đặt cây ở nơi có ánh sáng hắt qua cửa sổ hoặc dùng lưới che.",
  leafTip3Title: "Phân bón giàu Đạm (N)",
  leafTip3Desc:
    "Sử dụng phân bón lá hoặc phân NPK tỷ lệ Đạm cao để giúp lá to, dày và xanh mướt.",

  // Theo dõi
  growingWell: "Cây đang phát triển ổn định",
  tracking: "Đang theo dõi",
  progress: "Tiến độ",
  updated: "Cập nhật",
  updateToday: "Cập nhật hôm nay",
  updateTodayHint: "Chụp ảnh để AI phân tích",
  growthRoadmap: "Lộ trình sinh trưởng",
  noRoadmap: "Chưa có lộ trình sinh trưởng cho cây này.",
  todayTasks: "Nhiệm vụ Hôm nay",
  dayN: "Ngày {day}",
  today: "Hôm nay",
  taskWatering: "Tưới nước",
  taskFertilizing: "Bón phân & Chăm sóc",
  taskCare: "Chăm sóc",
  upcomingSchedule: "Lịch trình các ngày tới",
  taskDayN: "Nhiệm vụ Ngày {day}",
  noCareRoadmap: "Chưa có lộ trình chăm sóc",
  noCareRoadmapDesc:
    "Chụp ảnh cập nhật để AI phân tích và tạo lộ trình chăm sóc hằng ngày cho cây của bạn.",

  // Thông báo
  deleteFailed: "Xóa cây thất bại. Vui lòng thử lại.",
  deleted: "Đã xóa cây khỏi khu vườn.",
  addFailed: "Không thể thêm cây vào khu vườn.",
  added: "Đã thêm cây vào khu vườn.",
  analyzeFailed: "Không thể phân tích ảnh. Vui lòng thử lại.",
  updateConditionFailed: "Không thể cập nhật tình trạng cây.",
  conditionUpdated: "Đã cập nhật trạng thái cây.",
  connectionError: "Lỗi kết nối. Vui lòng thử lại.",
  loadGardenFailed: "Không thể tải khu vườn.",
  addPlantFailed: "Không thể thêm cây vào vườn.",
  deletePlantFailed: "Không thể xóa cây.",
  checkInFailed: "Không thể check-in.",
} as const;
