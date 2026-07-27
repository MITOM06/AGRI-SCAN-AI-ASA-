/** Trang hồ sơ người dùng. */
export const profile = {
  loginRequired: "Vui lòng đăng nhập để xem trang này.",

  // Gói dịch vụ
  currentPlan: "Gói dịch vụ hiện tại",
  expiresOn: "Hết hạn:",
  upgradePlan: "Nâng cấp gói",

  // Thống kê
  stats: "Thống kê",
  statScans: "Cây đã quét",
  statDiseases: "Bệnh phát hiện",
  statChats: "Đoạn chat",

  // Thiết lập mật khẩu
  setPassword: "Thiết lập mật khẩu",
  setPasswordDesc:
    "Bạn đã đăng nhập bằng Google. Hãy thiết lập mật khẩu để có thể đăng nhập bằng email trong tương lai.",
  setPasswordSuccess: "Thiết lập mật khẩu thành công!",
  setPasswordPlaceholder: "Ít nhất 8 ký tự, có chữ hoa, chữ thường và số",
  savePassword: "Lưu mật khẩu",
  errorPasswordShort: "Mật khẩu phải ít nhất 8 ký tự",
  errorPasswordWeak:
    "Mật khẩu phải chứa ít nhất 1 chữ hoa, thường và 1 số và ký tự đặc biệt",
  errorGeneric: "Có lỗi xảy ra. Thử lại.",

  // Hoạt động gần đây
  recentActivity: "Hoạt động gần đây",
  sampleActivityTitle: "Chẩn đoán bệnh Đốm lá",
  sampleActivityMeta: "Cây Cà chua • 2 giờ trước",
  sampleActivityRisk: "Nguy cơ cao",
  viewAllActivity: "Xem tất cả hoạt động",

  // ─── Màn hồ sơ trên mobile (app/profile.tsx), tiền tố `m` ───
  mLogoutAccount: "Đăng xuất tài khoản",
  mUpgrade: "Nâng cấp",

  mPlanFree: "Gói Free",
  mPlanFreeDesc: "Trải nghiệm cơ bản",
  mPlanPlus: "Gói Plus",
  mPlanPlusDesc: "Mở khóa sức mạnh AI",
  mPlanVip: "Gói VIP (Pro)",
  mPlanVipDesc: "Không giới hạn tính năng",

  mStatsTitle: "Thống kê tương tác",
  mStatScans: "Ảnh đã quét",
  mStatChats: "Đoạn chat AI",

  mActivityHistory: "Lịch sử hoạt động",
  mNoActivity: "Chưa có hoạt động nào",
  mCollapseList: "Thu gọn danh sách",
  mViewAllCount: "Xem tất cả ({count})",

  // Nhãn cho từng dòng hoạt động dựng từ lịch sử quét / chat
  mActivityScanTitle: "Chẩn đoán: {name}",
  mActivityUnknownDisease: "Không xác định",
  mActivityChatTitle: "Trò chuyện với AI",
  mRiskHigh: "Nguy cơ cao",
  mRiskWatch: "Cần theo dõi",
} as const;
