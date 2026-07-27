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

## 6b. Tiến độ thực tế (cập nhật 2026-07-27)

**Hạ tầng: xong và đã xác minh.**

- `packages/shared/src/i18n/**` — types, `translate()`, từ điển vi/en theo namespace.
- Ràng buộc key đã **kiểm chứng**: xoá thử `common.copied` khỏi `en` → `tsc` báo
  `TS2741: Property 'copied' is missing`. Đã khôi phục.
- `apps/web`: `I18nProvider` (localStorage) + `LanguageSwitcher` (VI|EN) ở Navbar,
  hiển thị cả desktop lẫn mobile → **nút chuyển ngôn ngữ có mặt trên mọi trang**.
- `pnpm build:packages` và `pnpm --filter web build` đều xanh.

**Đã chuyển sang `t()` — 14/17 cụm của web:** layout, auth, landing, scan,
encyclopedia, weather, shop (toàn bộ: danh sách, chi tiết, giỏ, thanh toán, đơn
hàng), my-garden (toàn bộ 6 file), community, profile, feedback, billing/UpdatePlan,
app pages, shell admin, hooks (useScan, useMyGarden), CartContext, constants/shop.

### apps/web — XONG

Tất cả 17 cụm đã chuyển sang `t()`. `pnpm --filter web build` xanh.
Còn sót **có chủ ý**: `metadata` của Server Component (xem giới hạn bên dưới),
dữ liệu demo điền sẵn form ở `CheckoutPage`, và comment tiếng Việt (§2 CLAUDE.md).

### apps/mobile — XONG

**Đã xong:**
- `context/I18nContext.tsx` — bản song song của web, lưu bằng `AsyncStorage`.
  Đặt ở `context/` chứ KHÔNG ở `app/` (mọi file dưới `app/` là một route expo-router).
- `components/ui/LanguageSwitcher.tsx`.
- `I18nProvider` bọc `Stack` trong `app/_layout.tsx`.
- **Nút chuyển ngôn ngữ ở 2 chỗ:** header màn chính (`app/index.tsx`) và hàng
  "Ngôn ngữ" ở màn Cài đặt (`app/setting.tsx`) — hàng này trước chỉ hiển thị
  "Tiếng Việt" với `onPress` rỗng.
- Đã chuyển: `components/ui/Footer.tsx` (dùng chung `footer.*` với web),
  `app/index.tsx`, `app/community.tsx`, `app/shop.tsx`, `app/my-cart.tsx`,
  `app/setting.tsx`, `app/weather.tsx`.
- **Từ điển mô tả thời tiết OpenWeatherMap** trước đây là một object tiếng Việt
  hardcode trong `app/weather.tsx`. Đã chuyển sang `weather.conditions.*` trong
  shared, keyed bằng đúng chuỗi `description` mà OWM trả về. Nhờ vậy bản tiếng
  Anh cũng được chuẩn hoá (viết hoa) thay vì hiện chuỗi thô. Kèm theo
  `weather.summaries.*`, `weather.moonPhases.*`, `weather.alerts.*`.
- **`npx tsc --noEmit` trên `apps/mobile` sạch** — khác web, mobile typecheck được,
  nên đây là cửa kiểm tra thật cho phần còn lại.

Đã chuyển thêm: `app/scan.tsx`, `app/tree-dictionary.tsx`, `app/garden-setup.tsx`,
`app/my-garden.tsx`, `app/upgrade.tsx`, `app/garden-detail.tsx`, và **toàn bộ
cụm `app/auth/` (6 màn)**.

Đã chuyển thêm: **toàn bộ cụm shop/đơn hàng (8 màn)** — `checkout`,
`success-order`, `my-shop`, `my-orders`, `product-detail`, `add-product`,
`buy-detail`, `payment`.

Đã chuyển thêm (các cụm cuối):
- **admin** (5 file): `app/admin.tsx` + `components/admin/{DashboardTab,UsersTab,ReportTab,FeedbackTab}.tsx` → `admin.m*`
- **tài khoản** (3): `user`, `profile`, `notification` → `home.u*`, `profile.m*`,
  namespace mới `notifications`
- **phản hồi** (1): `feedback` → `feedback.m*`
- **tĩnh** (3): `about` → `about.m*`; `tips` + `onboarding` → namespace mới
  `guides.ts` (xuất `tips` và `onboarding`)
- `components/ui/Input.tsx` và `components/auth/AuthHeader.tsx`: **không cần sửa** —
  tiếng Việt trong hai file này chỉ nằm ở comment.

Hai chuỗi sót phát hiện ở lượt grep cuối, đã xử lý:
`app/add-product.tsx` alert `"LỖI ĐĂNG BÁN: "` → `shop.mProductCreateErrorPrefix`;
`app/weather.tsx` tên vị trí mặc định `"TP.Hồ Chí Minh"` → `weather.defaultCity`
(đây là nhãn hiển thị, không phải tham số gọi API — API dùng lat/lon).

Nhiều màn mobile trùng nội dung với web → đã **dùng lại namespace có sẵn**
(`nav`, `common`, `auth`, `shop`, `myGarden`, `weather`, `scan`, `encyclopedia`,
`feedback`, `billing`, `about`, `footer`) thay vì tạo key mới.

### Cách làm đã dùng (giữ lại làm khuôn mẫu)

Làm **theo cụm namespace**, không theo từng file: soạn hết key của cụm vào
`locales/vi/<ns>.ts` + `en/<ns>.ts` trong một lượt, build packages, rồi mới sửa
các component. Cụm auth (6 màn, ~94 dòng) làm xong trong một lượt theo cách này.

**Bẫy lặp lại nhiều nhất: nhãn hiển thị vs. giá trị dữ liệu.** Rất nhiều chuỗi
tiếng Việt trong UI thực ra là *dữ liệu* — đem so sánh với MongoDB hoặc gửi lên
API. Dịch chúng sẽ làm hỏng logic **âm thầm, không có lỗi biên dịch**. Các trường
hợp đã gặp và cách xử lý:

| Chỗ | Chuỗi | Xử lý |
|-----|-------|-------|
| `TreeDictionary` (web + mobile) | `growthRate`, `light`, `water`, `category` | tách `{ value, labelKey }`, `value` giữ tiếng Việt |
| `my-garden`, `garden-detail`, `garden-setup` | `currentCondition` | hằng `HEALTHY_CONDITION` |
| `scan`, `garden-setup` | tên cây gửi trong payload | hằng `DEFAULT_PLANT_NAME` |
| `TrackingView` | `fertilizerAction` | hằng `NO_FERTILIZER_NEEDED` |
| `profile` (mobile) | `disease.name` khi cây khoẻ | hằng `HEALTHY_DISEASE_NAME` |
| `add-product` | `brand: … \|\| "Đang cập nhật"` | **lưu vào DB** → giữ tiếng Việt, có comment |
| mã category / status của shop, đơn hàng, phản hồi | `BUG`, `PENDING`, … | shape `{ id, labelKey }` |

Ngày/giờ dùng `DATE_LOCALES[locale]` thay vì `"vi-VN"` cứng.

Với constant/hàm ở cấp module (không gọi được hook) → cho nó giữ **key** rồi dịch
lúc render (`app/onboarding.tsx`), hoặc nhận `t: TranslateFn` làm tham số.

Ở `app/profile.tsx` (mobile), state chỉ giữ **dữ liệu thô** của từng dòng hoạt
động, nhãn được dựng lúc render — nhờ vậy đổi ngôn ngữ không phải gọi lại API.

### Hai giới hạn đã biết

1. **`metadata` của Next.js không dịch được** (`app/(main)/encyclopedia/page.tsx`
   title/description). `metadata` được tính ở server, còn locale nằm ở client —
   đây là hệ quả trực tiếp của việc chọn toggle client thay vì prefix URL (§3.2).
   Muốn dịch phần này thì phải chuyển sang `/vi` `/en`.
2. **Giá tiền luôn định dạng `vi-VN` + "đ"** ở cả hai ngôn ngữ. Đúng theo §7:
   sản phẩm bán bằng VNĐ nên không đổi theo ngôn ngữ giao diện.

### Chuỗi tiếng Việt còn sót — đều có chủ ý

- **Comment** trong code (§2 CLAUDE.md cho phép) và `console.log/error`.
- **Giá trị dữ liệu** (bảng ở trên) — dịch là hỏng logic.
- **Dữ liệu demo hardcode** ở các màn chưa nối API: `app/buy-detail.tsx`,
  `app/my-cart.tsx` (tên sản phẩm, tên khách, địa chỉ), web `CheckoutPage`.
  Sẽ tự hết khi các màn này nối API thật.
- `metadata` của Server Component (giới hạn 1 ở trên).

### Kiểm tra lại (đã chạy, kết quả sạch)

```bash
pnpm run build:packages          # Done
cd apps/mobile && npx tsc --noEmit   # exit 0
pnpm --filter web build          # xanh
pnpm --filter backend build      # xanh
sh scripts/find-vietnamese-ui-text.sh apps/mobile   # chỉ còn các mục "có chủ ý"
```

Khuôn mẫu 3 bước để thêm chuỗi mới về sau:
1. `grep` chuỗi tiếng Việt bằng `scripts/find-vietnamese-ui-text.sh`;
2. thêm namespace vào `locales/vi/<ns>.ts` **và** `locales/en/<ns>.ts`, khai báo ở
   cả hai `index.ts`;
3. thay chuỗi trong component bằng `t("<ns>.<key>")`.

## 7. Vấn đề phát hiện thêm (có sẵn, không do i18n)

**`tsc` trên toàn bộ `apps/web` hết bộ nhớ**, kể cả với heap 8 GB.
Đã khoanh vùng: `src/components/auth/RegisterForm.tsx` **một mình** cũng OOM —
nguyên nhân là `zodResolver` + zod 3.24 + react-hook-form, không liên quan i18n
(bỏ cast `Zod.ZodType` không giải quyết được, đã khôi phục nguyên trạng).

Điều này giải thích vì sao `next.config.ts` đặt `typescript.ignoreBuildErrors: true`.
Hệ quả: **ràng buộc "thiếu key → lỗi biên dịch" chỉ được kiểm ở tầng
`packages/shared`** (nơi `tsc` chạy tốt), chưa kiểm được ở tầng app.
Đây là một dự án con riêng cần xử lý — đề xuất nâng zod/RHF hoặc tách schema.

`apps/web/tsconfig.check.json` + script `pnpm --filter web typecheck` đã được thêm
sẵn để dùng ngay khi vấn đề trên được khắc phục.

## 8. Rủi ro

| Rủi ro | Xử lý |
|--------|-------|
| 101 file cần sửa, dễ bỏ sót | Làm theo cụm namespace, grep lại sau mỗi cụm |
| Text tiếng Việt nằm trong file dữ liệu (`constants/shop.constants.ts`) | Chuyển thành key, dịch tại điểm hiển thị |
| Chuỗi ghép động (`` `Còn ${n} sản phẩm` ``) | Dùng nội suy `t("shop.remaining", { n })`, không nối chuỗi |
| Đơn vị/định dạng (tiền VNĐ, ngày) | Giữ nguyên `formatCurrencyVN` — giá vẫn là VNĐ ở cả hai ngôn ngữ |
