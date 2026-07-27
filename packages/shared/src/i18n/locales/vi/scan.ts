/** Màn hình chẩn đoán AI + chatbot. */
export const scan = {
  // Gợi ý câu hỏi mở đầu
  suggestLeafDiagnosis: "Chẩn đoán bệnh từ ảnh lá cây",
  suggestNpk: "Cách bón phân NPK cho lúa",
  suggestDurianSeason: "Lịch thời vụ trồng sầu riêng",
  suggestNaturalPest: "Mẹo phòng trừ sâu bệnh tự nhiên",

  // Nhóm lịch sử hội thoại
  groupToday: "Hôm nay",
  groupYesterday: "Hôm qua",
  group7Days: "7 ngày trước",
  group30Days: "30 ngày trước",

  // Kết quả chẩn đoán
  unknownDisease: "Không xác định",
  resultHeading: "Kết quả chẩn đoán",
  diseaseDetected: "Bệnh phát hiện:",
  confidence: "Độ tin cậy:",
  symptomsHeading: "Triệu chứng",
  treatmentHeading: "Phương pháp xử lý",
  treatmentBiological: "Sinh học",
  treatmentChemical: "Hóa học",
  treatmentPrevention: "Phòng ngừa",

  // Thông báo
  analysisFailed: "⚠️ Không thể hoàn tất phân tích ảnh. Vui lòng thử lại.",
  noAnswer: "Trợ lý chưa có phản hồi.",
  loginRequired: "Bạn cần đăng nhập để sử dụng tính năng quét ảnh.",
  genericError: "Có lỗi xảy ra. Vui lòng thử lại.",
  invalidFile: "File không hợp lệ",
  analysisIncomplete: "Không thể hoàn tất phân tích ảnh",
  scanError: "Có lỗi xảy ra khi quét ảnh",
  detailFetchFailed: "Không thể lấy chi tiết kết quả",

  // Thanh bên
  newChat: "Cuộc trò chuyện mới",
  upgradePlan: "Nâng cấp gói",
  upgradeSubtitle: "Mở khóa tính năng cao cấp",

  // Màn hình chào
  welcomeTitle: "Xin chào, tôi có thể giúp gì cho bạn?",
  welcomeSubtitle:
    "Hỏi tôi về bệnh cây trồng, cách chăm sóc hoặc gửi ảnh để chẩn đoán chính xác.",

  // Hội thoại
  senderYou: "Bạn",
  senderAssistant: "Agri-Scan AI",
  uploadImage: "Tải ảnh lên",
  takePhoto: "Chụp ảnh",
  inputPlaceholder: "Hỏi Agri-Scan AI bất cứ điều gì...",
  disclaimer:
    "Agri-Scan AI có thể mắc lỗi. Hãy kiểm tra lại thông tin quan trọng.",

  // ── Mobile ────────────────────────────────────────────────────────────
  defaultChatTitle: "Trò chuyện",
  defaultScanTitle: "Quét ảnh",
  defaultPlantName: "Cây trồng",

  // Thanh bên
  historyTitle: "Lịch sử hoạt động",
  tabChat: "Trò chuyện",
  tabScans: "Ảnh quét",
  noHistory: "Chưa có lịch sử nào",
  noScanHistory: "Chưa có lịch sử quét ảnh",

  // Màn chào (mobile dùng câu khác web)
  welcomeSubtitleMobile:
    "Trợ lý nông nghiệp thông minh của bạn. Hãy hỏi tôi về bệnh cây trồng, cách chăm sóc hoặc gửi ảnh để chẩn đoán.",
  inputPlaceholderMobile: "Nhắn tin...",

  // Kết quả chẩn đoán (mobile hiển thị dạng thẻ, có dấu hai chấm)
  diseaseDetectedLabel: "Bệnh phát hiện:",
  confidenceLabel: "Độ tin cậy:",
  symptomsLabel: "Triệu chứng:",
  treatmentMethods: "Phương pháp điều trị:",
  treatmentOrganic: "🌱 Sinh học (Organic):",
  treatmentChemicalLabel: "🧪 Hóa học (Chemical):",
  treatmentPreventive: "🛡️ Phòng ngừa (Preventive):",

  // Quyền truy cập
  permissionCameraTitle: "Cấp quyền Máy ảnh",
  permissionCameraMessage:
    "Agri-Scan cần quyền truy cập máy ảnh để bạn có thể chụp hình cây trồng. Vui lòng mở Cài đặt của điện thoại và cho phép.",
  permissionLibraryTitle: "Cấp quyền Thư viện ảnh",
  permissionLibraryMessage:
    "Agri-Scan cần quyền truy cập bộ sưu tập để bạn tải ảnh lên chẩn đoán. Vui lòng mở Cài đặt của điện thoại và cho phép.",
  openSettings: "Mở Cài đặt",

  // Lỗi
  errorTitle: "Lỗi",
  cameraNotSupportedWeb:
    "Máy ảnh không hỗ trợ trên trình duyệt, vui lòng dùng nút chọn ảnh.",
  cameraOpenFailed:
    "Không thể mở máy ảnh. Lưu ý: Máy ảo (Emulator) có thể không hỗ trợ camera.",
  oldSessionWarning:
    "Bạn đang xem lịch sử chat cũ.\n\nHãy bấm nút '+' để tạo cuộc trò chuyện mới trước khi gửi tin nhắn!",
  errorServerConnection: "Có lỗi kết nối máy chủ. Vui lòng thử lại sau.",
  errorLoginRequired: "Bạn cần đăng nhập để sử dụng tính năng này.",
  errorDataPrefix: "Lỗi dữ liệu: {detail}",
  errorInvalidImage: "Ảnh không hợp lệ.",
  errorImageTooLarge:
    "Ảnh quá nặng (> 10MB). Vui lòng chọn ảnh khác nhẹ hơn!",
  errorAiOverloaded:
    "Hệ thống AI đang quá tải. Vui lòng đợi một lát rồi gửi lại!",
  errorNetworkOrCorrupt: "Lỗi mạng hoặc ảnh bị hỏng. Hãy thử ảnh khác!",
  errorGenericPrefix: "Lỗi: {message}",
} as const;
