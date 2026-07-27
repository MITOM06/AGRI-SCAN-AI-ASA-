"use client";

/**
 * I18nContext - Quản lý ngôn ngữ hiển thị cho toàn bộ web.
 *
 * Lựa chọn được lưu ở localStorage, đổi ngôn ngữ không reload trang và
 * không đổi URL (xem docs/superpowers/specs/2026-07-27-i18n-vi-en-design.md).
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_LOCALE,
  LOCALE_STORAGE_KEY,
  createTranslator,
  isLocale,
  type Locale,
  type TranslateFn,
} from "@agri-scan/shared";

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: TranslateFn;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  // Luôn khởi tạo bằng ngôn ngữ mặc định để server và client render giống nhau,
  // tránh lỗi hydration mismatch. Lựa chọn thật được đọc ngay sau đó ở useEffect.
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    const saved = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    if (isLocale(saved) && saved !== locale) setLocaleState(saved);
    // Chỉ chạy một lần khi mount — đọc lựa chọn đã lưu.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Giữ <html lang="..."> khớp với ngôn ngữ đang hiển thị (cho screen reader & SEO).
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    window.localStorage.setItem(LOCALE_STORAGE_KEY, next);
  }, []);

  const value = useMemo<I18nContextValue>(
    () => ({ locale, setLocale, t: createTranslator(locale) }),
    [locale, setLocale],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n phải được dùng bên trong <I18nProvider>");
  }
  return ctx;
}

/** Đường tắt khi component chỉ cần dịch, không cần đổi ngôn ngữ. */
export function useT(): TranslateFn {
  return useI18n().t;
}
