/**
 * Tiện ích xử lý query param `?redirect=` dùng cho luồng đăng nhập / đăng ký.
 *
 * Ví dụ: khách vãng lai bấm "Nâng cấp gói" → bị đưa tới
 * `/login?redirect=%2Fupgrade` → đăng nhập xong quay lại `/upgrade`.
 */

const OAUTH_REDIRECT_KEY = "postAuthRedirect";

/**
 * Chỉ chấp nhận đường dẫn nội bộ (bắt đầu bằng "/" nhưng không phải "//" hay
 * "/\") để tránh open-redirect ra domain ngoài.
 */
export function safeRedirect(
  value: string | null | undefined,
  fallback = "/",
): string {
  if (!value) return fallback;
  if (!value.startsWith("/")) return fallback;
  if (value.startsWith("//") || value.startsWith("/\\")) return fallback;
  return value;
}

/** Nối `?redirect=` vào một đường dẫn auth (`/login`, `/register`, ...). */
export function withRedirect(path: string, redirect?: string | null): string {
  if (!redirect) return path;
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}redirect=${encodeURIComponent(redirect)}`;
}

/**
 * OAuth (Google/Facebook) rời khỏi app nên không giữ được query param →
 * lưu tạm đích đến vào sessionStorage trước khi chuyển hướng.
 */
export function rememberOAuthRedirect(redirect?: string | null) {
  if (typeof window === "undefined") return;
  if (redirect) sessionStorage.setItem(OAUTH_REDIRECT_KEY, redirect);
  else sessionStorage.removeItem(OAUTH_REDIRECT_KEY);
}

/** Lấy (và xoá) đích đến đã lưu trước khi đi OAuth. */
export function consumeOAuthRedirect(): string | null {
  if (typeof window === "undefined") return null;
  const value = sessionStorage.getItem(OAUTH_REDIRECT_KEY);
  sessionStorage.removeItem(OAUTH_REDIRECT_KEY);
  return value;
}
