/**
 * Lõi đa ngôn ngữ dùng chung cho apps/web và apps/mobile.
 *
 * Ở đây chỉ có dữ liệu + hàm thuần. Phần React Context nằm trong từng app
 * (apps/web/src/context/I18nContext.tsx, apps/mobile/context/I18nContext.tsx)
 * vì mỗi nền tảng lưu lựa chọn ngôn ngữ ở một nơi khác nhau.
 */
export * from "./types";
export * from "./translate";
export { dictionaries, vi, en } from "./locales";
export type { Dictionary } from "./locales";

/** Khóa lưu lựa chọn ngôn ngữ — dùng chung để web và mobile không lệch nhau. */
export const LOCALE_STORAGE_KEY = "agri-scan-locale";
