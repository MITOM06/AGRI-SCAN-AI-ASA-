# apps/web — CLAUDE.md

The web client. **Next.js (App Router) + TypeScript**. Read this file when working in `apps/web`.

## Stack
- **Next.js** App Router (`src/app`), **Tailwind CSS**, `framer-motion`, `recharts`.
- Forms: `react-hook-form` + `zod` (`@hookform/resolvers`).
- Icons: `lucide-react`. Camera: `react-webcam`.
- LLM client: `@google/generative-ai`. Shares `@agri-scan/shared`.

## Structure
```
src/
  app/
    (auth)/        # login, OAuth callback
    (main)/        # scan, encyclopedia, weather, my-garden, community, shop, feedback,
                   # payment, upgrade, privacy, terms, about
    admin/dashboard/
  components/      # 1 thư mục / feature, KHÔNG để file component phẳng ở gốc:
                   # admin auth billing common community encyclopedia feedback
                   # landing layout my-garden profile scan shop static weather
  context/  hooks/  constants/
  utils/           # animation.ts (framer-motion variants)
  lib/             # utils.ts, index.ts, redirect.ts
```
The `(main)` and `(auth)` route groups = separate layouts, no effect on the URL.

## Commands
```bash
pnpm dev:web            # or: pnpm --filter web dev
pnpm --filter web build
pnpm --filter web lint
```

## Rules when editing
- Call APIs through the `@agri-scan/shared` api modules (`plantApi`, `scanApi`, `adminApi`, …) —
  don't scatter fetches across components, and don't add a per-app service layer that duplicates them.
- Shared formatters live in `@agri-scan/shared` (`formatCurrencyVN`, `formatDateShortTimeVN`, …).
  Don't re-implement them per component.
- Prefer **Server Components**; use `"use client"` only when interactivity/hooks are needed.
- Validate forms with `zod`; reuse schemas/types from `@agri-scan/shared` when available.
- Style with Tailwind; merge classes with `clsx`/`tailwind-merge` (already in `lib/utils`).
- Get the API base URL from env (`NEXT_PUBLIC_*`), don't hardcode localhost.
