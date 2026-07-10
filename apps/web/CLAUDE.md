# apps/web — CLAUDE.md

Web client. **Next.js (App Router) + TypeScript**. Đọc file này khi làm việc trong `apps/web`.

## Stack
- **Next.js** App Router (`src/app`), **Tailwind CSS**, `framer-motion`, `recharts`.
- Form: `react-hook-form` + `zod` (`@hookform/resolvers`).
- Icon: `lucide-react`. Camera: `react-webcam`.
- LLM client: `@google/generative-ai`. Dùng chung `@agri-scan/shared`.

## Cấu trúc
```
src/
  app/
    (auth)/        # login, callback OAuth
    (main)/        # scan, encyclopedia, weather, my-garden, community, shop, feedback,
                   # payment, upgrade, privacy, terms, about
    admin/dashboard/
  components/  context/  hooks/  constants/  utils/
  services/        # scan.service.ts, plant.service.ts, disease.service.ts, index.ts
  lib/             # utils.ts, index.ts
```
Route group `(main)` và `(auth)` = layout riêng, không ảnh hưởng URL.

## Lệnh
```bash
pnpm dev:web            # hoặc: pnpm --filter web dev
pnpm --filter web build
pnpm --filter web lint
```

## Quy tắc khi sửa
- Gọi API qua `src/services/*` (đừng fetch rải rác trong component).
- Ưu tiên **Server Component**; chỉ `"use client"` khi cần interactivity/hook.
- Validate form bằng `zod`; tái dùng schema/types từ `@agri-scan/shared` khi có.
- Style bằng Tailwind; gộp class bằng `clsx`/`tailwind-merge` (đã có trong `lib/utils`).
- API base URL lấy từ env (`NEXT_PUBLIC_*`), không hardcode localhost.
