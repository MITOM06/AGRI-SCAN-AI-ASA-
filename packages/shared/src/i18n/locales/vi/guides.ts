/**
 * Nội dung hướng dẫn trên app mobile: Cẩm nang (app/tips.tsx) và
 * màn giới thiệu lần đầu (app/onboarding.tsx).
 */

/** Cẩm nang — danh sách bài viết hiện là dữ liệu tĩnh trong màn hình. */
export const tips = {
  title: "Cẩm Nang Agri-Scan",
  subtitle:
    "Tổng hợp kiến thức, bí quyết bón phân và chăm sóc cây trồng từ chuyên gia.",
  searchPlaceholder: "Tìm kiếm bài viết, bí quyết...",
  author: "By AgriExpert",

  catFertilizer: "Phân bón",
  catIrrigation: "Tưới tiêu",
  catPests: "Sâu bệnh",
  readMinutes: "{minutes} phút đọc",

  post1Title: "Bí quyết ủ phân hữu cơ tại nhà không mùi",
  post2Title: "Lịch tưới nước chuẩn cho cây sầu riêng mùa khô",
  post3Title: "Phòng ngừa bọ trĩ phá hoại hoa hồng mùa nắng",
} as const;

/** Ba slide giới thiệu khi mở app lần đầu. */
export const onboarding = {
  skip: "Bỏ qua",
  start: "Bắt đầu ngay",

  slide1Title: "Quét ảnh chuẩn xác",
  slide1Desc:
    "Chỉ với 1 thao tác chụp ảnh, AI sẽ lập tức nhận diện hơn 500 loại bệnh trên cây trồng.",
  slide2Title: "Bác sĩ thực vật 24/7",
  slide2Desc:
    "Trợ lý ảo AI sẵn sàng giải đáp mọi thắc mắc và đưa ra phác đồ điều trị sinh học an toàn.",
  slide3Title: "Cộng đồng nhà nông",
  slide3Desc:
    "Kết nối, chia sẻ kinh nghiệm và học hỏi kỹ thuật canh tác từ hàng ngàn chuyên gia.",
} as const;
