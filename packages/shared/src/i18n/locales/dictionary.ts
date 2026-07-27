import type { vi } from "./vi";

/**
 * Nới lỏng các literal type do `as const` sinh ra thành `string`.
 *
 * Không có bước này thì `common.save` của tiếng Việt có kiểu `"Lưu"`, và bản
 * tiếng Anh `"Save"` sẽ không gán được. Sau khi nới lỏng, chỉ còn *cấu trúc key*
 * là ràng buộc — đúng thứ ta muốn ép.
 */
type Widen<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? Widen<U>[]
    : { -readonly [K in keyof T]: Widen<T[K]> };

/** Hình dạng bắt buộc của mọi từ điển ngôn ngữ. */
export type Dictionary = Widen<typeof vi>;
