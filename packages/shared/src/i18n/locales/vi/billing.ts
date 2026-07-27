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

  // ── Trang thanh toán ──────────────────────────────────────────────────
  // Quyền lợi hiển thị ở cột phải
  benefit1: "Mô hình AI nâng cao",
  benefit2: "Tăng giới hạn tin nhắn & tải ảnh",
  benefit3: "Tạo hình ảnh chất lượng cao",
  benefit4: "Bộ nhớ mở rộng",

  // Trạng thái chờ / chuyển hướng
  redirectingToLogin:
    "Bạn cần đăng nhập để nâng cấp gói. Đang chuyển tới trang đăng nhập...",
  checkingAccount: "Đang kiểm tra tài khoản...",
  backToPlans: "Quay lại chọn gói",

  // Thành công
  paymentSuccess: "Thanh toán thành công!",
  planActivatedPrefix: "Gói",
  planActivatedSuffix: "đã được kích hoạt cho tài khoản của bạn.",
  startUsing: "Bắt đầu sử dụng",

  // Biểu mẫu thẻ
  paymentInfo: "Thông tin thanh toán",
  paymentMethod: "Phương thức thanh toán",
  cardNumber: "Số thẻ",
  expiryDate: "Ngày hết hạn",
  cvc: "Mã CVC",

  // Địa chỉ thanh toán
  billingAddress: "Địa chỉ thanh toán",
  fullName: "Họ và tên",
  fullNamePlaceholder: "Nguyễn Văn A",
  country: "Quốc gia / Khu vực",
  countryVietnam: "Việt Nam",
  address: "Địa chỉ",
  addressPlaceholder: "Số nhà, tên đường...",

  // Tóm tắt & CTA
  subscribeNowWithPrice: "Đăng ký ngay — ₫{price}",
  subscribeNow: "Đăng ký ngay",
  planNamed: "Gói {name}",
  billedMonthly: "Thanh toán hàng tháng",
  monthlyPrice: "Giá gói hàng tháng",
  dueToday: "Thanh toán hôm nay",
  autoRenewPrefix: "Tự động gia hạn ₫{price}/tháng.",
  cancelAnytime: "Hủy bất kỳ lúc nào",
  autoRenewSuffix: "trong Cài đặt. Bằng việc đăng ký, bạn đồng ý với",
  termsOfUse: "Điều khoản sử dụng",
  securePayment: "Thanh toán bảo mật & mã hóa SSL",

  // Lỗi
  invalidPlan: "Gói không hợp lệ",
  paymentFailed: "Thanh toán thất bại. Vui lòng thử lại.",

  // ── Mobile: màn nâng cấp gói (danh sách tính năng chi tiết hơn web) ────
  tagPremium: "CAO CẤP",

  mFreeFeature1: "Mô hình cơ bản",
  mFreeFeature2: "Giới hạn tin nhắn và tải ảnh",
  mFreeFeature3: "Giới hạn tạo hình ảnh",
  mFreeFeature4: "Bộ nhớ ngắn hạn",

  mPlusFeature1: "Mô hình AI nâng cao (nhanh & chính xác hơn)",
  mPlusFeature2: "Tăng giới hạn tin nhắn và tải ảnh",
  mPlusFeature3: "Tạo hình ảnh chất lượng cao",
  mPlusFeature4: "Bộ nhớ mở rộng giữa các đoạn chat",
  mPlusFeature5: "Chế độ phân tích sâu",
  mPlusFeature6: "Ưu tiên hỗ trợ",

  mProFeature1: "Không giới hạn tin nhắn",
  mProFeature2: "Mô hình chuyên gia nông nghiệp cao cấp",
  mProFeature3: "Phân tích hình ảnh bệnh cây chuyên sâu",
  mProFeature4: "Tạo báo cáo chi tiết",
  mProFeature5: "API truy cập cho nhà phát triển",

  // Màn thanh toán trên mobile
  mErrorIncompleteCard: "Vui lòng điền đầy đủ thông tin thẻ.",
  mSubscribeSuccess: "Bạn đã đăng ký gói {name} thành công!",
  mSecurityCodeLabel: "Mã bảo mật (CVC)",
  mHighlightFeatures: "Tính năng nổi bật",
  mAutoRenewNote:
    "Gói sẽ tự động gia hạn hàng tháng. Bạn sẽ bị tính phí ₫{price}/tháng. Bạn có thể hủy bất kỳ lúc nào trong Cài đặt. Bằng việc đăng ký, bạn đồng ý với Điều khoản sử dụng của chúng tôi.",
} as const;
