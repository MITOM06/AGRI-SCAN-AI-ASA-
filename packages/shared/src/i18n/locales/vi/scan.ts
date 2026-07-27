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
} as const;
