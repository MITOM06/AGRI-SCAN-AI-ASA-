/**
 * Trích message an toàn từ một giá trị lỗi `unknown` (chuẩn cho `catch (e)`).
 * Tránh truy cập `.message` trên `any` (no-unsafe-member-access).
 */
export function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === 'string') return err;
  try {
    return JSON.stringify(err);
  } catch {
    return String(err);
  }
}

/** Lấy stack nếu là Error, ngược lại trả undefined. */
export function getErrorStack(err: unknown): string | undefined {
  return err instanceof Error ? err.stack : undefined;
}
