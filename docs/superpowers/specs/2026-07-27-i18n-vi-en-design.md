# Đa ngôn ngữ Việt / Anh cho AGRI-SCAN-AI

**Ngày:** 2026-07-27
**Trạng thái:** Đã chốt (owner cấp full authority — §1.1 CLAUDE.md; harness ở chế độ `dontAsk` nên
các ngã rẽ được quyết theo phương án đề xuất, ghi rõ giả định bên dưới).

---

## 1. Mục tiêu

Người dùng chuyển qua lại giữa **tiếng Việt** và **tiếng Anh** bằng một nút ở góc màn hình.
Lựa chọn được ghi nhớ giữa các lần mở app.

## 2. Hiện trạng

| Khu vực | Số file chứa text tiếng Việt | Ghi chú |
|---------|------------------------------|---------|
| `apps/web/src` | 58 | Text nhúng thẳng trong JSX |
| `apps/mobile` | 43 | Tương tự |
| `apps/backend/src` | 55 | Chủ yếu comment; một phần là message lỗi API + email template |
| `packages/{shared,database}` | 40 | Comment + seed data (nội dung wiki cây trồng/bệnh) |

Dự án **chưa có** thư viện i18n nào. `apps/web/src/app/layout.tsx` hardcode `<html lang="vi">`.
`packages/shared/tsconfig.json` **không bật `jsx`** → package này không chứa được file `.tsx`.

## 3. Ba quyết định đã chốt

### 3.1 Phạm vi: **Web + Mobile UI**

Dịch toàn bộ text giao diện ở `apps/web` (58 file) và `apps/mobile` (43 file).

**Nằm ngoài phạm vi lần này** (nêu rõ để owner quyết sau):

- **Message lỗi từ backend** — vẫn trả tiếng Việt. Để dịch cần chuyển sang mã lỗi + đọc header
  `Accept-Language`, đụng tới `class-validator` messages ở mọi DTO. Là một dự án con riêng.
- **Nội dung DB** (mô tả cây trồng, bệnh trong wiki) — cần đổi schema Mongoose từ `string` sang
  `{ vi: string; en: string }` và seed lại toàn bộ. Là một dự án con riêng, lớn hơn cả việc này.
- **Comment trong code** — giữ tiếng Việt theo quy ước hiện tại của repo (§2 CLAUDE.md).

**Lý do:** UI là thứ người dùng nhìn thấy gần như 100% thời gian. Hai hạng mục ngoài phạm vi
đều là *đổi cấu trúc dữ liệu*, không phải *dịch chuỗi*, nên trộn vào sẽ làm hỏng tính gọn của
thay đổi này.

### 3.2 Cơ chế chuyển: **toggle phía client, URL không đổi**

Locale lưu ở `localStorage` (web) / `AsyncStorage` (mobile), đổi tức thì không reload trang.
URL giữ nguyên `/scan`, `/shop`, …

**Không chọn** prefix `/vi` `/en` vì phải chuyển toàn bộ `src/app/**` vào `src/app/[locale]/**`,
thêm middleware, và sửa mọi `<Link>` / `router.push` trong dự án — chi phí lớn, đổi lại chỉ được
SEO đa ngôn ngữ, thứ chưa nằm trong mục tiêu của AGRI-SCAN-AI.

**Đánh đổi đã chấp nhận:** không có SEO đa ngôn ngữ; link chia sẻ luôn mở ở ngôn ngữ mà người
nhận đã chọn, không phải ngôn ngữ của người gửi.

### 3.3 Thư viện: **tự viết, đặt trong `@agri-scan/shared`**

Không thêm dependency mới.

**Không chọn `next-intl`** vì nó gần như bắt buộc đi kèm routing `[locale]` (đã loại ở 3.2) và
không dùng được cho Expo. **Không chọn `react-i18next`** vì cần config `init` riêng cho từng app
và thêm ~40KB, trong khi tính năng ta thật sự cần chỉ là tra key + nội suy biến.

## 4. Kiến trúc

```
packages/shared/src/i18n/           ← TypeScript thuần, KHÔNG React (vì shared không bật jsx,
  types.ts                            và backend cũng import @agri-scan/shared)
  locales/
    vi/  common.ts nav.ts auth.ts landing.ts scan.ts encyclopedia.ts weather.ts
         my-garden.ts community.ts shop.ts feedback.ts profile.ts billing.ts
         admin.ts static.ts index.ts
    en/  (đúng các file tương ứng)
  translate.ts                      ← tra key theo dot-path + nội suy {var}
  index.ts

apps/web/src/context/I18nContext.tsx        ← "use client", storage = localStorage
apps/web/src/components/common/LanguageSwitcher.tsx

apps/mobile/context/I18nContext.tsx         ← storage = AsyncStorage
apps/mobile/components/ui/LanguageSwitcher.tsx
```

**Vì sao tách đôi:** phần *dữ liệu* (từ điển) và *hàm thuần* (`translate`) dùng chung được cho cả
hai app. Phần *React Context* thì không — web cần directive `"use client"`, mobile cần
`AsyncStorage`, và `packages/shared` không compile được `.tsx`. Mỗi app tự giữ một context ~50
dòng là rẻ hơn nhiều so với việc bật `jsx` cho shared rồi kéo React vào cây phụ thuộc của backend.

### 4.1 Ràng buộc kiểu — bản dịch không thể thiếu key

```ts
// locales/vi/index.ts
export const vi = { common, nav, auth, ... } as const;

// locales/en/index.ts
import type { Dictionary } from "../../types";
export const en: Dictionary = { common, nav, auth, ... };  // Dictionary = typeof vi
```

Thiếu một key trong `en` → **lỗi biên dịch TypeScript**, không phải lỗi lúc chạy. Đây là lý do
chính để tự viết thay vì dùng file JSON của thư viện ngoài.

### 4.2 API cho component

```tsx
const { t, locale, setLocale } = useI18n();

t("nav.scan")                              // "Chẩn đoán AI" | "AI Diagnosis"
t("auth.greeting", { name: user.fullName }) // "Xin chào, Khang" | "Hello, Khang"
```

`translate()` khi không tìm thấy key: fallback sang tiếng Việt, nếu vẫn không có thì trả về chính
chuỗi key (để lỗi lộ ra ngay trên UI thay vì hiện ô trống).

### 4.3 Nút chuyển ngôn ngữ

- **Web:** đặt trong `Header`/`Navbar`, góc trên bên phải cạnh nút Đăng nhập/Đăng xuất — nhìn thấy
  ở mọi trang. Dạng hai nút `VI | EN`, nút đang chọn được tô đậm.
- **Mobile:** cùng dạng, đặt ở màn hình `setting.tsx` và ở header của `index.tsx` (màn chính).

### 4.4 Chống nhấp nháy khi tải trang (web)

Locale đọc từ `localStorage` chỉ có sau khi hydrate. Để tránh render tiếng Việt rồi nháy sang
tiếng Anh: `I18nContext` khởi tạo state bằng `"vi"`, đọc `localStorage` trong `useEffect`, và ghi
thuộc tính `document.documentElement.lang` mỗi lần locale đổi. Chấp nhận một frame đầu tiên bằng
tiếng Việt — đây là đánh đổi trực tiếp của việc không dùng URL prefix.

## 5. Thứ tự thực hiện

1. `packages/shared/src/i18n/**` — types, translate, khung từ điển rỗng. Build shared.
2. `I18nContext` + `LanguageSwitcher` cho web; gắn Provider vào `app/providers.tsx`.
3. Chuyển đổi web theo cụm, mỗi cụm là một namespace từ điển: layout/nav → auth → landing →
   scan → encyclopedia → weather → my-garden → shop → community → feedback → profile → billing →
   admin → static.
4. Lặp lại (2) và (3) cho mobile.
5. Quality gate: `pnpm build:packages`, `pnpm --filter web build`, `pnpm --filter web lint`,
   `npx tsc --noEmit` cho mobile.

Mỗi cụm ở bước 3–4 là một đơn vị hoàn chỉnh: thêm key vào `vi/<ns>.ts` **và** `en/<ns>.ts`, rồi
sửa các component của cụm đó. Không để lại cụm dịch dở.

## 6. Kiểm thử

Dự án hiện không có test cho web/mobile, nên xác minh bằng:

- `pnpm build:packages && pnpm --filter web build` phải xanh (bắt được key thiếu nhờ 4.1).
- Mobile: `npx tsc --noEmit`.
- Chạy `pnpm dev:web`, bấm nút chuyển ngôn ngữ, xác nhận toàn bộ text đổi và giữ nguyên sau F5.
- Grep còn sót: `grep -rE "[àáảãạ…]" apps/web/src --include='*.tsx'` chỉ còn khớp ở comment.

**Lưu ý:** `apps/web/next.config.ts` đang bật `typescript.ignoreBuildErrors: true` và
`eslint.ignoreDuringBuilds: true` → `next build` **sẽ không** bắt lỗi kiểu. Phải chạy
`npx tsc --noEmit` riêng cho web thì ràng buộc ở 4.1 mới có tác dụng.

## 7. Rủi ro

| Rủi ro | Xử lý |
|--------|-------|
| 101 file cần sửa, dễ bỏ sót | Làm theo cụm namespace, grep lại sau mỗi cụm |
| Text tiếng Việt nằm trong file dữ liệu (`constants/shop.constants.ts`) | Chuyển thành key, dịch tại điểm hiển thị |
| Chuỗi ghép động (`` `Còn ${n} sản phẩm` ``) | Dùng nội suy `t("shop.remaining", { n })`, không nối chuỗi |
| Đơn vị/định dạng (tiền VNĐ, ngày) | Giữ nguyên `formatCurrencyVN` — giá vẫn là VNĐ ở cả hai ngôn ngữ |
