/** Cửa hàng: danh sách, chi tiết sản phẩm, giỏ hàng, thanh toán, đơn hàng. */
export const shop = {
  // Danh mục (mã danh mục gửi lên API nằm ở apps/web/src/constants/shop.constants.ts)
  categoryAll: "Tất cả",
  categoryFertilizer: "Phân bón",
  categoryPesticide: "Thuốc BVTV",
  categorySeed: "Hạt giống",
  categoryTool: "Dụng cụ",
  categoryOther: "Khác",

  // Danh sách sản phẩm
  storeTitle: "Cửa hàng Agri-Shop",
  storeShort: "Cửa hàng",
  searchPlaceholder: "Tìm vật tư nông nghiệp...",
  categoryHeading: "Danh mục sản phẩm",
  allProducts: "Tất cả sản phẩm",
  productCount: "{count} sản phẩm",
  lowStock: "Sắp hết",
  sold: "Đã bán {count}",
  noProducts: "Không tìm thấy sản phẩm",
  noProductsHint: "Vui lòng thử lại với từ khóa hoặc danh mục khác.",

  // Chi tiết sản phẩm
  notFoundTitle: "Sản phẩm không tồn tại",
  notFoundDesc:
    "Sản phẩm bạn đang tìm kiếm có thể đã bị xóa hoặc không tồn tại.",
  backToStore: "Quay lại cửa hàng",
  inStock: "Còn hàng",
  outOfStock: "Hết hàng",
  quantity: "Số lượng:",
  stockAvailable: "{count} sản phẩm có sẵn",
  addedToCart: "Đã thêm vào giỏ",
  addToCart: "Thêm vào giỏ hàng",
  genuineGuarantee: "Cam kết chính hãng",
  genuineGuaranteeDesc: "Hoàn tiền 111% nếu hàng giả",
  nationwideShipping: "Giao hàng toàn quốc",
  nationwideShippingDesc: "Hỗ trợ phí ship cho đơn từ 500k",
  productDescription: "Mô tả sản phẩm",
  sellerInfo: "Thông tin người bán",
  seller: "Người bán",
  trustedSeller: "Người bán uy tín",
  rating: "Đánh giá",
  products: "Sản phẩm",
} as const;
