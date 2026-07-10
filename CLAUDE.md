# CLAUDE.md — Luật & Hướng dẫn cho Claude Code

File luật gốc của dự án **AGRI-SCAN-AI**. Claude Code đọc file này mỗi phiên.
Tài liệu chi tiết từng app nằm trong `apps/<app>/CLAUDE.md` (load theo nhu cầu để tiết kiệm token).
Kiến trúc tổng thể: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

---

## 1. Luật #1 — Quyền hạn & Tự chủ (Autonomy)

Chủ dự án đã cấp **toàn quyền** cho Claude trên codebase này:

- ✅ Được **chỉnh sửa / tạo / xoá / refactor** bất kỳ file/code nào khi cần.
- ✅ Được chạy build/test/lint và git thông thường trong lúc làm việc.
- ✅ **Chủ động**: đủ thông tin thì hành động; không hỏi lại thứ có thể tự suy ra hoặc dùng mặc định hợp lý.
- ❓ **Chỉ hỏi** ở **quyết định hướng đi**: đổi kiến trúc lớn, chọn giữa các hướng thiết kế không tự quyết được, đổi phạm vi công việc, hoặc thao tác khó đảo ngược/ra bên ngoài (deploy, xoá dữ liệu, push public).

> **Hành động mặc định, chỉ hỏi ở ngã rẽ.**

## 2. Ngôn ngữ

- **Trao đổi với chủ dự án: tiếng Việt.**
- Code/identifier tiếng Anh; comment có thể tiếng Việt theo phong cách sẵn có của repo.

## 3. Tổng quan dự án

AGRI-SCAN-AI: nền tảng quét ảnh cây trồng bằng AI — nhận diện bệnh/loài, tra cứu wiki, chatbot RAG, thời tiết, vườn của tôi (my-garden), shop nông sản. Monorepo **pnpm workspace**.

| App | Stack | Vai trò |
|-----|-------|---------|
| `apps/backend` | NestJS, MongoDB/Mongoose, RabbitMQ, Redis, JWT/Passport, GCS | API gateway + nghiệp vụ |
| `apps/ai-service` | Python, FastAPI, ViT-MoE (timm) + YOLO, RAG (chromadb/langchain), Gemini | Suy luận ảnh + chatbot |
| `apps/web` | Next.js (App Router), Tailwind, Gemini SDK | Web client |
| `apps/mobile` | Expo Router, React Native, expo-camera | App di động |
| `packages/database` | Mongoose models + seeds | `@agri-scan/database` |
| `packages/shared` | zod schemas, utils | `@agri-scan/shared` |

Hạ tầng dev: `infra/docker-compose/docker-compose.yml` (mongodb, redis, rabbitmq, ai-service, backend, web).

## 4. Lệnh thường dùng

```bash
# Cài đặt (từ gốc repo)
pnpm install

# Chạy
pnpm dev:web                 # web (Next.js)
pnpm dev:mobile              # mobile (Expo)
pnpm --filter backend start:dev
# ai-service: cd apps/ai-service && uvicorn ai.main:app --reload

# Hạ tầng
docker compose -f infra/docker-compose/docker-compose.yml up -d

# Build — LUÔN build packages trước (backend/web phụ thuộc @agri-scan/*)
pnpm build                   # packages → backend → web (đúng thứ tự)
pnpm build:packages          # chỉ database + shared
pnpm build:backend           # packages + backend
# ⚠️ `pnpm --filter backend build` đơn lẻ sẽ FAIL nếu chưa build packages.

# Kiểm thử / chất lượng (backend)
pnpm --filter backend lint
pnpm --filter backend test

# DB seed
pnpm --filter @agri-scan/database seed
```

## 5. Quy ước code

- **TypeScript**: theo ESLint/Prettier của từng app. Backend theo chuẩn NestJS (module/controller/service/dto/guard/strategy).
- **DTO + `class-validator`** cho mọi input backend; `ValidationPipe` bật `whitelist` + `forbidNonWhitelisted`.
- **zod** cho validation phía web/mobile/shared.
- Đặt tên file theo pattern sẵn có trong module lân cận (đa số kebab-case `*.controller.ts`, `*.service.ts`, `*.module.ts`).
- **Không** commit secrets; dùng `.env` (xem `*.env.example`).

## 6. Cổng chất lượng (Quality Gates) — BẮT BUỘC

Trước khi tuyên bố "xong / đã sửa / pass":

1. **Chạy thật** lệnh liên quan (lint/build/test hoặc chạy app) và **đọc output**.
2. Chỉ khẳng định khi có bằng chứng. Nếu chưa chạy được → nói rõ "chưa verify".
3. Với thay đổi backend có logic: chạy `pnpm --filter backend build` (tối thiểu) + test nếu có.
4. Không sửa test cho khớp code sai; sửa code cho khớp hành vi đúng.

## 7. Kỷ luật token

- CLAUDE.md gốc giữ gọn; chi tiết ở `apps/<app>/CLAUDE.md` — chỉ đọc khi làm app đó.
- Việc tìm kiếm rộng (quét nhiều file) → dùng **Explore/Task agent**, không tự đọc từng file.
- Không đọc `pnpm-lock.yaml`, `img/**`, `**/dist`, `**/.next`, model weights (`*.pth`), file lớn trừ khi thật cần.
- Dùng agent chuyên trách (mục 8) cho công việc trong từng app.

## 8. Harness: AGRI-SCAN-AI

**Mục tiêu:** route công việc tới đúng chuyên gia theo app và điều phối các tác vụ đa-app/refactor/debug.

**Trigger:** Việc chạm **nhiều app**, refactor lớn, hoặc "debug tổng thể" → dùng skill **`agri-orchestrator`**. Việc trong **1 app** → gọi thẳng agent tương ứng (`backend-nest`, `ai-service-py`, `web-next`, `mobile-expo`). Sắp tuyên bố "xong/pass" → dùng skill **`verify-agri`**. Câu hỏi đơn giản → trả lời trực tiếp.

Định nghĩa trong `.claude/agents/` và `.claude/skills/`. Xem [`.claude/README.md`](.claude/README.md).

**Change history:**
| Ngày | Thay đổi | Đối tượng | Lý do |
|------|----------|-----------|-------|
| 2026-07-10 | Khởi tạo harness (5 agent + orchestrator + verify) | toàn bộ `.claude/` | Thiết lập ban đầu |
