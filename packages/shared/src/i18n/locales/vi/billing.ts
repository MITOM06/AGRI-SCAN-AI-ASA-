/** Nâng cấp gói & thanh toán. */
export const billing = {
  // Trang nâng cấp
  title: "Nâng cấp gói dịch vụ",
  subtitle: "Chọn gói phù hợp với nhu cầu canh tác của bạn",
  period: "tháng",

  guestBanner:
    "Bạn đang xem với tư cách khách. Vui lòng {login} hoặc {register} tài khoản để có thể nâng cấp gói dịch vụ.",
  guestBannerLogin: "đăng nhập",
  guestBannerRegister: "đăng ký",

  // Gói FREE
  freeDescription: "Khám phá sức mạnh của AI",
  freeFeature1: "3 ảnh/ngày (tải lên hoặc chụp)",
  freeFeature2: "10 tin nhắn (prompts)/ngày",
  freeFeature3: "Mô hình AI chẩn đoán cơ bản",
  freeFeature4: "Hỗ trợ từ cộng đồng",
  freeCtaGuest: "Đăng ký miễn phí",
  freeCtaDowngrade: "Hạ xuống Free",

  // Gói PREMIUM
  premiumDescription: "Mở khóa trải nghiệm đầy đủ",
  premiumFeature1: "10 ảnh/ngày (tải lên hoặc chụp)",
  premiumFeature2: "50 tin nhắn (prompts)/ngày",
  premiumFeature3: "Mô hình AI nông nghiệp nâng cao",
  premiumFeature4: "Thời hạn sử dụng: 30 ngày",
  premiumCta: "Nâng cấp lên Plus",

  // Gói VIP
  vipDescription: "Tối đa hóa năng suất của bạn",
  vipFeature1: "20 ảnh/ngày (tải lên hoặc chụp)",
  vipFeature2: "Vô hạn tin nhắn (prompts)/ngày",
  vipFeature3: "Mô hình AI chuyên gia",
  vipFeature4: "Thời hạn sử dụng: 30 ngày",
  vipCta: "Nâng cấp lên Pro",

  currentPlan: "Gói hiện tại",
  tagPopular: "PHỔ BIẾN",
  includesPlus: "Bao gồm mọi thứ của Plus và:",

  enterpriseQuestion: "Bạn cần gói doanh nghiệp tùy chỉnh?",
  contactUs: "Liên hệ với chúng tôi",

  // Modal yêu cầu đăng nhập
  loginRequiredTitle: "Vui lòng đăng nhập",
  loginRequiredDesc:
    "Bạn cần đăng nhập hoặc đăng ký tài khoản để nâng cấp gói dịch vụ. Sau khi đăng nhập, bạn sẽ được đưa trở lại trang này.",
  loginNow: "Đăng nhập ngay",
  createAccount: "Tạo tài khoản mới",
} as const;
