/**
 * I18nContext - Quản lý ngôn ngữ hiển thị cho toàn bộ app mobile.
 *
 * Bản song song với apps/web/src/context/I18nContext.tsx. Khác biệt duy nhất:
 * mobile lưu lựa chọn bằng AsyncStorage (bất đồng bộ) thay vì localStorage.
 * Từ điển và hàm translate() dùng chung từ @agri-scan/shared.
 *
 * Đặt ở `context/` chứ KHÔNG ở `app/` — mọi file dưới app/ đều thành một route
 * của expo-router (xem apps/mobile/CLAUDE.md).
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
import AsyncStorage from "@react-native-async-storage/async-storage";
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
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  // Đọc lựa chọn đã lưu. AsyncStorage là bất đồng bộ nên frame đầu tiên luôn
  // hiển thị ngôn ngữ mặc định — chấp nhận được, giống bên web.
  useEffect(() => {
    let cancelled = false;

    AsyncStorage.getItem(LOCALE_STORAGE_KEY)
      .then((saved) => {
        if (!cancelled && isLocale(saved)) setLocaleState(saved);
      })
      .catch(() => {
        // Đọc thất bại thì cứ dùng ngôn ngữ mặc định, không cần báo lỗi cho user
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    void AsyncStorage.setItem(LOCALE_STORAGE_KEY, next);
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
