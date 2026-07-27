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

  // ── Mobile: màn khai báo thông tin cây (garden-setup) ──────────────────
  setupTitle: "Khai báo thông tin",

  // Mục tiêu chăm sóc — `id` là mã gửi lên API, không dịch
  goalHealDisease: "Chữa bệnh cho cây",
  goalGetFruit: "Thu hoạch quả",
  goalGetFlower: "Lấy hoa",
  goalMaintain: "Duy trì khỏe mạnh",

  // Trạng thái định vị
  locating: "Đang lấy vị trí...",
  locationWebMode: "Đã lấy vị trí (Web Mode)",
  locationDenied: "Bị từ chối quyền vị trí",
  locationOk: "Đã lấy vị trí chính xác",
  locationFailed: "Không thể lấy vị trí",

  // Phân tích AI
  analyzingCondition: "AI đang phân tích tình trạng cây...",
  analysisDone: "Hoàn tất phân tích!",
  detectedPrefix: "Phát hiện: {disease}",
  composingRoadmap: "AI đang soạn lộ trình...",

  // Biểu mẫu
  step1Label: "1. Đặt tên cho cây của bạn",
  namePlaceholder: "Ví dụ: Cà chua ban công, Hoa hồng trồng chậu...",
  step2Label: "2. Mục tiêu chăm sóc",
  step2Hint: "AI sẽ dựa vào mục tiêu này để đưa ra lời khuyên phù hợp.",
  step3Label: "3. Tọa độ & Thời tiết",
  yourGardenLocation: "Vị trí vườn của bạn",
  weatherHint:
    "AI sẽ lấy dữ liệu thời tiết 7 ngày tới tại vị trí này để tối ưu lượng nước tưới.",
  submitButton: "Tạo Lộ Trình Chăm Sóc",

  // Thông báo
  errorNoValidImage: "Không tìm thấy ảnh hợp lệ.",
  errorAiTitle: "Lỗi AI",
  errorAiMessage: "Không thể nhận diện ảnh lúc này.",
  errorMissingInfoTitle: "Thiếu thông tin",
  errorMissingNameMessage: "Vui lòng đặt tên cho cây của bạn.",
  waitTitle: "Chờ chút",
  waitGpsMessage:
    "Hệ thống đang lấy vị trí GPS của bạn để kiểm tra thời tiết.",
  successTitle: "🎉 Thành công!",
  successMessage:
    "AI đã phân tích thời tiết và tạo xong lộ trình chăm sóc cho cây của bạn.",
  viewGardenNow: "Xem vườn ngay",
  errorCreateRoadmap: "Có lỗi xảy ra khi tạo lộ trình.",

  // ── Mobile: danh sách khu vườn (my-garden) ─────────────────────────────
  listTitle: "Khu vườn của tôi",

  // Trạng thái cây (badge)
  statusCompleted: "Hoàn thành",
  statusFailed: "Thất bại",
  statusTreating: "Đang trị bệnh",
  statusAwaitingUpdate: "Chờ cập nhật",

  // Nhãn mục tiêu (rút gọn cho mobile)
  goalHealShort: "Chữa bệnh",
  goalFruitShort: "Lấy quả",
  goalFlowerShort: "Lấy hoa",
  goalMaintainShort: "Duy trì khỏe mạnh",
  goalDefaultShort: "Nuôi trồng",
  growProgress: "Tiến độ nuôi trồng:",

  // Tổng quan gói
  currentPlantCount: "Số lượng cây hiện tại:",
  plantLimitSuffix: "/ {limit} cây",
  slotsRemaining: "Còn lại {count} slot nuôi trồng",
  noSlotsLeft: "Đã hết slot nuôi trồng",
  planNamed: "Gói {name}",
  planBasic: "Cơ bản",

  // Thêm cây
  addSectionHeading: "Thêm cây mới vào vườn",
  addActionTitle: "Chụp hoặc Tải ảnh lên",
  addActionDesc:
    "Sử dụng AI để nhận diện cây và tình trạng bệnh, sau đó bắt đầu lộ trình chăm sóc.",
  openCamera: "Mở Máy Ảnh",
  openLibrary: "Thư viện",

  // Danh sách cây
  growingSectionHeading: "Cây đang nuôi trồng",
  gardenLocked: "Vườn đang đóng.",
  gardenLockedDesc:
    "Nâng cấp lên gói VIP hoặc PREMIUM để mở khóa tính năng nuôi trồng cây!",
  upgradeNow: "Nâng cấp ngay",
  emptyListTitle: "Bạn chưa nuôi trồng cây nào trong vườn.",
  emptyListDesc: "Hãy dùng nút bên trên chụp một cây để bắt đầu!",

  // Thông báo
  loadGardenFailedShort: "Không thể tải thông tin vườn lúc này.",
  cameraNotSupportedWebUpload:
    "Máy ảnh không hỗ trợ trên trình duyệt, vui lòng dùng nút Tải ảnh lên.",
  permissionTitle: "Cấp quyền",
  permissionCameraScan: "Cần quyền máy ảnh để quét cây.",

  // ── Mobile: chi tiết cây trong vườn (garden-detail) ────────────────────
  detailLoading: "Đang tải thông tin cây...",
  detailNotFound: "Không tìm thấy cây này.",
  detailLoadFailed: "Không thể tải thông tin.",

  // Xóa cây
  deleteConfirmTitle: "Xóa cây khỏi vườn?",
  deleteConfirmMessage:
    "Bạn có chắc chắn muốn ngừng chăm sóc cây này không? Bạn sẽ nhận lại 1 vị trí trống trong vườn.",
  deleteConfirmYes: "Xóa bỏ",
  deleteSuccessTitle: "Thành công",
  deleteSuccessMessage: "Đã xóa cây khỏi vườn.",
  deleteFailedShort: "Không thể xóa cây lúc này.",

  // Check-in
  checkInWebOnly: "Tính năng chụp ảnh check-in đang hoạt động ở chế độ Mobile.",
  checkInWarningTitle: "⚠️ Cảnh báo từ AI",
  checkInCreateNewRoadmap: "Tạo lộ trình mới",
  checkInSuccessTitle: "🎉 Thành công!",
  checkInFailedMessage: "Có lỗi xảy ra khi chụp ảnh check-in.",
  checkInToday: "Check-in hôm nay",
  checkInTimeTitle: "Đến lúc chăm cây rồi!",
  checkInTimeDesc:
    "Hãy chụp một bức ảnh cập nhật tình trạng mới nhất của cây để AI đánh giá xem bạn có đang làm đúng theo lộ trình không nhé.",
  checkInOpenCamera: "Mở Camera Check-in",
  checkInWarningNote:
    "Lưu ý: Nếu bạn quên check-in quá 3 ngày, lộ trình cũ sẽ bị hủy và phải nhờ AI tạo lại từ đầu!",

  // Thông tin cây
  conditionLabel: "Tình trạng:",
  conditionLoading: "Đang tải",
  aiEvaluation: "Đánh giá của AI",
  completionProgress: "Tiến độ hoàn thành",
  roadmapAi: "Lộ trình (AI)",
  nextTasks: "Các việc cần làm tiếp theo",
  taskWaterInline: "Nước:",
  taskFertilizerInline: "Phân bón:",
  taskCareInline: "Chăm sóc:",
} as const;
