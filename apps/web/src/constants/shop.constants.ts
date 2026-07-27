/**
 * Danh mục sản phẩm của cửa hàng.
 *
 * Mã danh mục (FERTILIZER, PESTICIDE, ...) là giá trị gửi lên API — KHÔNG dịch.
 * Chỉ nhãn hiển thị mới đi qua i18n, nên ở đây lưu KEY và component gọi t().
 */

/** Mã danh mục theo thứ tự hiển thị. Chuỗi rỗng = "tất cả". */
export const CATEGORY_CODES = [
  "",
  "FERTILIZER",
  "PESTICIDE",
  "SEED",
  "TOOL",
  "OTHER",
] as const;

export type CategoryCode = (typeof CATEGORY_CODES)[number];

/** Mã danh mục → key i18n của nhãn. */
export const CATEGORY_LABEL_KEY: Record<string, string> = {
  "": "shop.categoryAll",
  FERTILIZER: "shop.categoryFertilizer",
  PESTICIDE: "shop.categoryPesticide",
  SEED: "shop.categorySeed",
  TOOL: "shop.categoryTool",
  OTHER: "shop.categoryOther",
};
