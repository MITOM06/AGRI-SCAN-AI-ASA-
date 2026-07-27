/**
 * Kiểu dữ liệu nền cho hệ thống đa ngôn ngữ.
 *
 * Cố ý KHÔNG import React ở bất kỳ đâu trong thư mục i18n này:
 * packages/shared không bật "jsx" trong tsconfig, và backend cũng import
 * @agri-scan/shared — kéo React vào đây sẽ làm bẩn cây phụ thuộc của backend.
 * Phần React Context nằm ở từng app (apps/web, apps/mobile).
 */

/** Các ngôn ngữ được hỗ trợ. Thêm ngôn ngữ mới = thêm vào đây + một thư mục locales/<mã>. */
export const LOCALES = ["vi", "en"] as const;

export type Locale = (typeof LOCALES)[number];

/** Ngôn ngữ mặc định khi chưa có lựa chọn nào được lưu. */
export const DEFAULT_LOCALE: Locale = "vi";

/** Nhãn hiển thị trên nút chuyển ngôn ngữ. */
export const LOCALE_LABELS: Record<Locale, string> = {
  vi: "VI",
  en: "EN",
};

/** Tên đầy đủ của ngôn ngữ, dùng ở màn hình cài đặt. */
export const LOCALE_NAMES: Record<Locale, string> = {
  vi: "Tiếng Việt",
  en: "English",
};

/** Một nhánh bất kỳ trong cây từ điển. */
export type TranslationTree = {
  [key: string]: string | TranslationTree;
};

/** Biến nội suy: t("auth.greeting", { name: "Khang" }) */
export type TranslationParams = Record<string, string | number>;

/** Ép kiểu an toàn: chuỗi bất kỳ dạng "a.b.c". */
export type TranslationKey = string;

/**
 * Kiểm tra một giá trị có phải mã ngôn ngữ hợp lệ không.
 * Dùng khi đọc từ localStorage/AsyncStorage — dữ liệu ở đó không đáng tin.
 */
export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}
