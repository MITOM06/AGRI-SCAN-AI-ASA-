"use client";

/**
 * LanguageSwitcher - Nút chuyển VI / EN.
 *
 * Đặt ở góc trên bên phải Navbar nên có mặt trên mọi trang.
 * Dạng hai nút cạnh nhau thay vì dropdown: chỉ có 2 ngôn ngữ, một cú nhấp là xong.
 */

import { LOCALES, LOCALE_LABELS, LOCALE_NAMES, cn } from "@agri-scan/shared";
import { useI18n } from "@/context/I18nContext";

interface LanguageSwitcherProps {
  /** "compact" cho thanh nav, "full" hiện tên đầy đủ cho trang cài đặt. */
  variant?: "compact" | "full";
  className?: string;
}

export function LanguageSwitcher({
  variant = "compact",
  className,
}: LanguageSwitcherProps) {
  const { locale, setLocale, t } = useI18n();

  return (
    <div
      role="group"
      aria-label={t("common.switchLanguage")}
      className={cn(
        "flex items-center gap-0.5 p-0.5 rounded-full bg-gray-100 border border-gray-200",
        className,
      )}
    >
      {LOCALES.map((code) => {
        const isActive = code === locale;
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLocale(code)}
            aria-pressed={isActive}
            title={LOCALE_NAMES[code]}
            className={cn(
              "rounded-full font-bold transition-all duration-200",
              variant === "compact"
                ? "px-2.5 py-1 text-[11px]"
                : "px-4 py-2 text-sm",
              isActive
                ? "bg-white text-primary shadow-sm"
                : "text-gray-500 hover:text-gray-700",
            )}
          >
            {variant === "compact" ? LOCALE_LABELS[code] : LOCALE_NAMES[code]}
          </button>
        );
      })}
    </div>
  );
}
