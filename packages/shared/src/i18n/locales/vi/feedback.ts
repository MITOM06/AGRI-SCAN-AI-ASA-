/** Trang góp ý & phản hồi. */
export const feedback = {
  // Loại phản hồi — `value` (BUG, FEATURE, ...) là mã gửi lên API, không dịch
  typeBug: "Báo lỗi",
  typeFeature: "Đề xuất tính năng",
  typeComplaint: "Khiếu nại",
  typeGeneral: "Góp ý chung",

  // Chưa đăng nhập
  loginTitle: "Vui lòng đăng nhập",
  loginDesc:
    "Bạn cần đăng nhập vào tài khoản để có thể gửi góp ý và theo dõi quá trình xử lý phản hồi từ chúng tôi.",
  loginCta: "Đăng nhập ngay",

  // Biểu mẫu
  formTitle: "Gửi phản hồi",
  formSubtitle: "Chúng tôi luôn lắng nghe ý kiến của bạn",
  labelType: "Loại phản hồi",
  labelContent: "Nội dung chi tiết",
  contentPlaceholder: "Mô tả chi tiết vấn đề hoặc đề xuất của bạn...",
  submit: "Gửi phản hồi",

  // Lịch sử
  historyTitle: "Lịch sử phản hồi",
  requestCount: "{count} yêu cầu",
  historyEmpty: "Chưa có phản hồi nào",
  historyEmptyDesc:
    "Lịch sử trống. Hãy sử dụng biểu mẫu bên trái để gửi góp ý hoặc báo cáo sự cố cho chúng tôi nhé.",
  statusAnswered: "Đã trả lời",
  statusProcessing: "Đang xử lý",

  // Thông báo
  loadHistoryFailed: "Không thể tải lịch sử phản hồi.",
  errorEmptyContent: "Vui lòng nhập nội dung phản hồi.",
  submitSuccess: "Phản hồi đã được gửi thành công!",
  submitFailed: "Có lỗi xảy ra khi gửi phản hồi.",
} as const;
