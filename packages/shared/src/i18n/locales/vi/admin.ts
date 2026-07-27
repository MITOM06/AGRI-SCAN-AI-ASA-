/** Khu vực quản trị: menu, dashboard, người dùng, báo cáo, phản hồi. */
export const admin = {
  // Menu sidebar
  menuDashboard: "Tổng quan",
  menuUsers: "Người dùng",
  menuReports: "Báo cáo",
  menuFeedbacks: "Phản hồi",

  // Nhãn gói (dùng chung ở dashboard & báo cáo)
  planFree: "Gói FREE",
  planPremium: "Gói PREMIUM",
  planVip: "Gói VIP",

  // ── Tổng quan ─────────────────────────────────────────────────────────
  dashboardTitle: "Tổng quan hệ thống",
  dashboardUpdatedAt: "Cập nhật lúc: {time}",
  dashboardLoading: "Đang tải dashboard...",
  dashboardLoadFailed: "Không tải được dữ liệu dashboard.",

  cardTotalUsers: "Tổng người dùng",
  cardNewThisMonth: "+{count} tháng này",
  cardRevenueThisMonth: "Doanh thu tháng này",
  cardRevenueTotal: "Tổng: {amount}",
  cardTotalScans: "Tổng lượt quét",
  cardScansStable: "Hoạt động ổn định",
  cardPendingFeedback: "Feedback chờ xử lý",
  cardNeedsReplySoon: "Cần phản hồi sớm",
  planRatio: "Tỉ lệ gói đăng ký",

  // ── Người dùng ────────────────────────────────────────────────────────
  usersTitle: "Quản lý người dùng",
  usersSearchPlaceholder: "Tìm email, tên...",
  usersFilterAllPlans: "Tất cả gói",
  colUser: "Người dùng",
  colRole: "Vai trò",
  colCurrentPlan: "Gói hiện tại",
  colUsage: "Lượt dùng",
  colRegisteredAt: "Ngày đăng ký",
  colActions: "Thao tác",
  imageCount: "{count} ảnh",
  actionDowngradeFree: "Hạ về FREE",
  actionUpgradePremium: "Nâng PREMIUM",
  actionUpgradeVip: "Nâng VIP",
  usersEmpty: "Không tìm thấy người dùng",
  usersEmptyHint: "Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc",
  usersShowing: "Hiển thị",
  usersOfTotal: "{total} người dùng",
  errorInvalidUserId: "Lỗi: ID người dùng không hợp lệ (undefined)!",
  errorPrefix: "Lỗi: {message}",

  // ── Báo cáo ───────────────────────────────────────────────────────────
  reportsTitle: "Báo cáo & Thống kê",
  reportsLoading: "Đang tải báo cáo...",
  reportsLoadFailed: "Không tải được dữ liệu báo cáo.",
  reportsNoData: "Không có dữ liệu báo cáo.",
  rangeLast7Days: "7 ngày qua",
  rangeLast30Days: "30 ngày qua",
  rangeThisYear: "Năm nay",
  exportReport: "Xuất Báo Cáo",

  avgRevenuePerUser: "Doanh thu trung bình / User",
  totalRevenue: "Tổng doanh thu: {amount}",
  conversionRate: "Tỷ lệ chuyển đổi (Free > Paid)",
  paidUsers: "{count} người dùng trả phí",
  avgUsage: "Lượt dùng trung bình",
  perDay: "lượt/ngày",
  avgOverLastDays: "Trung bình {days} ngày gần nhất",
  revenueByPlan: "Doanh thu theo gói",
  userDistribution: "Phân bổ người dùng",
  usageFrequency: "Tần suất sử dụng hệ thống (Lượt quét & Chat)",
  seriesImageScans: "Lượt quét ảnh",
  seriesAiChats: "Lượt chat AI",

  // ── Phản hồi ──────────────────────────────────────────────────────────
  feedbacksTitle: "Quản lý Phản hồi",
  feedbacksPendingCount: "Hiện có {count} phản hồi đang chờ xử lý",
  feedbacksNoPending: "Không có phản hồi chờ xử lý",
  feedbacksFilterAll: "Tất cả trạng thái",
  feedbacksStatusPending: "Chờ xử lý",
  feedbacksStatusReplied: "Đã trả lời",
  feedbacksLoading: "Đang tải danh sách phản hồi...",
  feedbacksEmpty: "Không có phản hồi nào",
  feedbacksEmptyHint: "Không có dữ liệu phù hợp với bộ lọc hiện tại.",
  feedbacksLoadFailed: "Không thể tải danh sách phản hồi.",
  feedbacksReplyFailed: "Không thể gửi phản hồi cho người dùng.",
  anonymousUser: "Người dùng",
  adminReplyLabel: "Phản hồi từ Admin:",
  replyNow: "Trả lời ngay",
  replyModalTitle: "Trả lời phản hồi",
  replyContentLabel: "Nội dung trả lời của bạn",
  replyPlaceholder: "Nhập câu trả lời chi tiết...",
  replyCancel: "Hủy bỏ",
  replySubmit: "Gửi phản hồi",

  // ── Mobile ────────────────────────────────────────────────────────────
  // Lời chào theo giờ
  greetingMorning: "Chào buổi sáng",
  greetingAfternoon: "Chào buổi chiều",
  greetingEvening: "Chào buổi tối",
  adminFallbackName: "Quản trị viên",

  // Tab dưới
  mTabOverview: "Tổng quan",
  mTabAccounts: "Tài khoản",
  mTabReports: "Báo cáo",
  mTabFeedbacks: "Phản hồi",

  // Lỗi tải dữ liệu
  mLoadOverviewFailed: "Không thể tải Tổng quan.",
  mLoadUsersFailed: "Không thể tải danh sách Người dùng.",
  mLoadRevenueFailed: "Không thể tải Báo cáo doanh thu.",
  mLoadFeedbacksFailed: "Không thể tải danh sách Phản hồi.",

  // Trả lời phản hồi
  mErrorEmptyReply: "Vui lòng nhập nội dung trả lời!",
  mReplySent: "Đã gửi câu trả lời cho người dùng!",
  mReplySendFailed: "Không thể gửi câu trả lời.",

  // Đăng xuất
  mLogoutConfirm: "Bạn có chắc chắn muốn đăng xuất khỏi quyền quản trị?",

  // Tab Tổng quan
  mTotalRevenue: "Tổng Doanh Thu",
  mRevenueThisMonth: "+ {amount} tháng này",
  mUsers: "Người dùng",
  mNewThisMonth: "+ {count} mới",
  mAiScans: "Lượt quét AI",
  mAnalyzed: "Đã phân tích",
  mPlanRatio: "Tỉ lệ gói thành viên",
  mPlanFreeLabel: "Gói Cơ bản (Free)",

  // Tab Tài khoản
  mSearchPlaceholder: "Tìm email hoặc tên...",
  mNoNameYet: "Chưa cập nhật tên",

  // Tab Báo cáo
  mYearSummary: "Tổng Kết Năm Nay",
  mTransactions: "Giao Dịch",
  mMonthlyDetail: "Chi tiết theo tháng",
  mMonthN: "Tháng {n}",
  mTransactionCount: "Số giao dịch:",
  mPlanNamed: "Gói {plan}:",

  // Tab Phản hồi
  mFilterPending: "Chờ xử lý",
  mFilterReplied: "Đã trả lời",
  mNoFeedbackInSection: "Không có phản hồi nào trong mục này.",
  mAnonymousUser: "Người dùng ẩn danh",
  mCreatedAtPrefix: "{date} lúc",
  mReplyPlaceholder: "Nhập câu trả lời của Admin...",
  mSendReply: "Gửi trả lời",
  mOpenReply: "Trả lời phản hồi này",
  mAdminReplied: "Admin đã trả lời:",
  mRepliedAtPrefix: "Trả lời lúc:",
} as const;
