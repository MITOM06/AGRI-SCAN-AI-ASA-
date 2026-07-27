import type { Locale, TranslationTree } from "../types";
import { vi } from "./vi";
import { en } from "./en";

export type { Dictionary } from "./dictionary";
export { vi } from "./vi";
export { en } from "./en";

/**
 * Bảng tra từ điển theo mã ngôn ngữ.
 *
 * Ép về TranslationTree vì translate() đi theo đường dẫn chuỗi động, không
 * dùng được kiểu tĩnh của từ điển.
 */
export const dictionaries: Record<Locale, TranslationTree> = {
  vi: vi as unknown as TranslationTree,
  en: en as unknown as TranslationTree,
};
