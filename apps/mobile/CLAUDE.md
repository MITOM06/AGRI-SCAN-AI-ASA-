# apps/mobile — CLAUDE.md

App di động. **Expo (React Native) + expo-router + TypeScript**. Đọc file này khi làm việc trong `apps/mobile`.

## Stack
- **Expo Router** (file-based routing trong `app/`).
- `expo-camera`, `expo-image-picker` (quét ảnh cây), `expo-location` (thời tiết).
- Auth: `expo-auth-session` + `expo-secure-store` (Google login).
- Form: `react-hook-form` + `zod`. Icon: `lucide-react-native`.
- LLM client: `@google/generative-ai`. Dùng chung `@agri-scan/shared`.
- Storage: `@react-native-async-storage/async-storage`.

## Cấu trúc
```
app/                 # routes (expo-router): index, scan, weather, my-garden, community,
                     # shop, product-detail, checkout, my-cart, my-orders, profile,
                     # onboarding, auth/, admin, upgrade, feedback, ...
components/  data/  assets/
App.tsx  _layout.tsx
```
Mỗi file `.tsx` trong `app/` = 1 màn hình; `_layout.tsx` = layout/navigation.

## Lệnh
```bash
pnpm dev:mobile         # = pnpm --filter mobile start (Expo)
pnpm --filter mobile android|ios|web
```

## ENV (`.env.example`)
`EXPO_PUBLIC_API_URL` (URL backend — dùng IP LAN khi chạy Expo Go, không phải localhost),
`EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`.

## Quy tắc khi sửa
- Route mới = thêm file trong `app/` theo convention expo-router.
- Chỉ đọc env qua `EXPO_PUBLIC_*` (biến khác không lộ ra client).
- Xin quyền camera/location trước khi dùng; xử lý trạng thái từ chối.
- Tái dùng types/schema từ `@agri-scan/shared`.
