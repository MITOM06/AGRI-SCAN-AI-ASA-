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

  // Giỏ hàng
  cart: "Giỏ hàng",
  cartTitle: "Giỏ hàng của bạn",
  cartEmpty: "Giỏ hàng đang trống",
  cartEmptyDesc: "Chưa có sản phẩm nào trong giỏ hàng của bạn.",
  continueShopping: "Tiếp tục mua sắm",
  colProduct: "Sản phẩm",
  colUnitPrice: "Đơn giá",
  colQuantity: "Số lượng",
  colSubtotal: "Thành tiền",
  removeItem: "Xóa sản phẩm",
  orderSummary: "Tóm tắt đơn hàng",
  subtotalWithCount: "Tạm tính ({count} sản phẩm)",
  shippingFee: "Phí giao hàng",
  calculatedLater: "Tính ở bước sau",
  grandTotal: "Tổng cộng",
  vatIncluded: "(Đã bao gồm VAT nếu có)",
  proceedToCheckout: "Tiến hành thanh toán",
  singleShopOnly:
    "Giỏ hàng chỉ có thể chứa sản phẩm từ 1 gian hàng. Vui lòng đặt hàng riêng.",

  // Thanh toán
  checkout: "Thanh toán",
  orderPlaced: "Đặt hàng thành công!",
  orderPlacedDesc:
    "Cảm ơn bạn đã mua sắm tại Agri-Shop. Đơn hàng của bạn đang được xử lý và sẽ sớm được giao.",
  cartEmptyShort: "Giỏ hàng trống",

  shippingAddress: "Địa chỉ nhận hàng",
  enterManually: "Nhập trực tiếp",
  receiverName: "Tên người nhận",
  receiverNamePlaceholder: "Nhập tên người nhận",
  phone: "Số điện thoại",
  phonePlaceholder: "Nhập số điện thoại",
  addressPlaceholder:
    "Nhập số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố",

  carrier: "Đơn vị vận chuyển",
  carrierFast: "Giao hàng nhanh",
  carrierFastEta: "Dự kiến giao: 2-3 ngày",
  carrierEconomy: "Giao hàng tiết kiệm",
  carrierEconomyEta: "Dự kiến giao: 4-5 ngày",

  paymentMethod: "Phương thức thanh toán",
  paymentCod: "Thanh toán khi nhận hàng (COD)",
  paymentBankTransfer: "Chuyển khoản ngân hàng",
  paymentMomo: "Ví MoMo",

  yourOrder: "Đơn hàng của bạn",
  subtotalLabel: "Tạm tính:",
  shippingFeeLabel: "Phí vận chuyển:",
  discountLabel: "Giảm giá:",
  totalPayment: "Tổng thanh toán:",
  vatIncludedShort: "(Đã bao gồm VAT)",
  placeOrder: "Đặt hàng ngay",

  // Lỗi khi đặt hàng
  errorReceiverName: "Vui lòng nhập tên người nhận.",
  errorPhone: "Vui lòng nhập số điện thoại nhận hàng.",
  errorAddress: "Vui lòng nhập địa chỉ nhận hàng.",
  errorNoSeller:
    "Không xác định được người bán của sản phẩm. Vui lòng quay lại giỏ hàng và thêm lại sản phẩm.",
  errorOrderFailed: "Không thể đặt hàng lúc này. Vui lòng thử lại.",

  // Đơn hàng của tôi
  myOrders: "Đơn hàng của tôi",
  statusPending: "Chờ xác nhận",
  statusConfirmed: "Đã xác nhận",
  statusShipping: "Đang giao hàng",
  statusDelivered: "Đã giao",
  statusCancelled: "Đã hủy",
  noOrders: "Không có đơn hàng nào",
  noOrdersDesc: "Bạn chưa có đơn hàng nào trong trạng thái này.",
  orderCode: "Mã đơn hàng",
  orderDate: "Ngày đặt",
  productFallback: "Sản phẩm #{id}",
  variantDefault: "Phân loại: Mặc định",
  itemCount: "{count} sản phẩm",
  totalAmount: "Tổng tiền",
  buyAgain: "Mua lại",
  details: "Chi tiết",
} as const;
