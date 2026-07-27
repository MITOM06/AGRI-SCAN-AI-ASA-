/**
 * Hàm tra cứu bản dịch — TypeScript thuần, không phụ thuộc framework.
 */

import type { Locale, TranslationParams, TranslationTree } from "./types";
import { DEFAULT_LOCALE } from "./types";
import { dictionaries } from "./locales";

/**
 * Đi theo đường dẫn dạng "shop.cart.empty" trong cây từ điển.
 * Trả về undefined nếu không tới được một chuỗi.
 */
function lookup(tree: TranslationTree, path: string): string | undefined {
  const segments = path.split(".");
  let current: string | TranslationTree | undefined = tree;

  for (const segment of segments) {
    if (typeof current !== "object" || current === null) return undefined;
    current = current[segment];
  }

  return typeof current === "string" ? current : undefined;
}

/**
 * Thay {name} bằng params.name. Biến không được truyền thì giữ nguyên
 * dấu ngoặc để lỗi lộ ra trên UI thay vì âm thầm biến mất.
 */
function interpolate(template: string, params?: TranslationParams): string {
  if (!params) return template;

  return template.replace(/\{(\w+)\}/g, (match, key: string) => {
    const value = params[key];
    return value === undefined ? match : String(value);
  });
}

/**
 * Dịch một key sang ngôn ngữ chỉ định.
 *
 * Thứ tự fallback: ngôn ngữ yêu cầu → tiếng Việt → chính chuỗi key.
 * Trả về key giúp phát hiện thiếu bản dịch ngay khi nhìn màn hình.
 */
export function translate(
  locale: Locale,
  key: string,
  params?: TranslationParams,
): string {
  const primary = lookup(dictionaries[locale], key);
  if (primary !== undefined) return interpolate(primary, params);

  const fallback = lookup(dictionaries[DEFAULT_LOCALE], key);
  if (fallback !== undefined) return interpolate(fallback, params);

  return key;
}

/** Kiểu của hàm t() mà các app nhận từ context. */
export type TranslateFn = (key: string, params?: TranslationParams) => string;

/** Tạo sẵn một hàm t() đã gắn locale — dùng trong React Context của từng app. */
export function createTranslator(locale: Locale): TranslateFn {
  return (key, params) => translate(locale, key, params);
}
