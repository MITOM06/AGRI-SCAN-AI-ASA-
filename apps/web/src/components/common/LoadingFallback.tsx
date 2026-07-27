"use client";

/**
 * LoadingFallback - Nội dung `fallback` của <Suspense> ở các page.
 *
 * Các page là Server Component nên không gọi được useT() trực tiếp. Bọc phần
 * chữ vào component client này để nó vẫn đổi theo ngôn ngữ đang chọn.
 */

import { useT } from "@/context/I18nContext";

export function LoadingFallback({ messageKey }: { messageKey?: string }) {
  const t = useT();

  return (
    <div className="min-h-screen flex items-center justify-center text-gray-400">
      {t(messageKey ?? "common.loading")}
    </div>
  );
}
