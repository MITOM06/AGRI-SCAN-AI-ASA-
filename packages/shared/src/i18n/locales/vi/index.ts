/**
 * Từ điển tiếng Việt — đây là NGUỒN SỰ THẬT về cấu trúc key.
 * Kiểu `Dictionary` được suy ra từ chính object này, nên mọi ngôn ngữ khác
 * bắt buộc phải có đủ key, thiếu là lỗi biên dịch.
 */
import { common } from "./common";
import { nav, footer } from "./nav";
import { auth } from "./auth";

export const vi = {
  common,
  nav,
  footer,
  auth,
} as const;
