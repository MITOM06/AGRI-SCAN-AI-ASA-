# apps/mobile — CLAUDE.md

The mobile app. **Expo (React Native) + expo-router + TypeScript**. Read this file when working in `apps/mobile`.

## Stack
- **Expo Router** (file-based routing in `app/`).
- `expo-camera`, `expo-image-picker` (crop scanning), `expo-location` (weather).
- Auth: `expo-auth-session` + `expo-secure-store` (Google login).
- Forms: `react-hook-form` + `zod`. Icons: `lucide-react-native`.
- LLM client: `@google/generative-ai`. Shares `@agri-scan/shared`.
- Storage: `@react-native-async-storage/async-storage`.

## Structure
```
app/                 # routes (expo-router): index, scan, weather, my-garden, community,
                     # shop, product-detail, checkout, my-cart, my-orders, profile,
                     # onboarding, auth/, admin, upgrade, feedback, ...
  _layout.tsx        # layout/navigation (Stack)
components/          # ui/ (Button, Input, Footer), auth/ (AuthHeader)
styles/              # <screen>.styles.ts — StyleSheet tách khỏi màn hình
assets/
```
Every `.tsx` file under `app/` = one screen. Entry point is `"main": "expo-router/entry"`
in `package.json` — there is no `App.tsx`/`index.ts` to edit.

## Commands
```bash
pnpm dev:mobile         # = pnpm --filter mobile start (Expo)
pnpm --filter mobile android|ios|web
```

## ENV (`.env.example`)
`EXPO_PUBLIC_API_URL` (backend URL — use the LAN IP when running Expo Go, not localhost),
`EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`.

## Rules when editing
- A new route = add a file in `app/` following the expo-router convention.
- **Shared components go in `components/`, never in `app/`** — every file under `app/` becomes a
  navigable route, which then needs a bogus `<Stack.Screen>` entry to silence the router warning.
- Reuse formatters from `@agri-scan/shared` (`formatCurrencyVN`, …) instead of redefining them
  inside a screen.
- `StyleSheet` goes in `styles/<screen>.styles.ts`, not inline at the bottom of the screen —
  it was ~32% of every large screen file.
- Only read env via `EXPO_PUBLIC_*` (other variables are not exposed to the client).
- Request camera/location permissions before use; handle the denied state.
- Reuse types/schemas from `@agri-scan/shared`.
