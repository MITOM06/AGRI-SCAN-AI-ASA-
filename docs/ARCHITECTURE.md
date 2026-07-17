# AGRI-SCAN-AI Architecture

A **pnpm workspace** monorepo: 4 apps (`backend`, `ai-service`, `web`, `mobile`) + 2 shared packages (`@agri-scan/database`, `@agri-scan/shared`).

## Overall diagram

```
        ┌────────────┐        ┌────────────┐
        │   web      │        │   mobile   │
        │ (Next.js)  │        │ (Expo RN)  │
        └─────┬──────┘        └─────┬──────┘
              │  HTTPS (REST /api)  │
              └──────────┬──────────┘
                         ▼
                 ┌───────────────┐        ┌──────────┐
                 │    backend    │◀──────▶│  Redis   │ (cache)
                 │   (NestJS)    │        └──────────┘
                 │  prefix /api  │        ┌──────────┐
                 │               │◀──────▶│ MongoDB  │ (Mongoose models)
                 └───┬───────┬───┘        └──────────┘
                     │       │            ┌──────────┐
                GCS  │       │  publish   │   GCS    │ (images)
            (images)◀┘       ▼            └──────────┘
                     ┌──────────────┐
                     │  RabbitMQ    │  scan_queue (prefetch 1)
                     │  (job queue) │  chat_queue (prefetch 5)
                     └──────┬───────┘
                            │ consumer (ai-scan.consumer.ts) pulls a job
                            │ then calls HTTP  ▼
                     ┌──────────────────────────┐
                     │        ai-service        │
                     │        (FastAPI)         │
                     │  /predict  → ViT-MoE+YOLO│
                     │  /chat     → RAG + Gemini │
                     └──────────────────────────┘
```

## Image-scan flow (scan)
1. **Client** (web/mobile) uploads an image → `POST /api/ai-scan/...`.
2. **backend** stores the image (GCS), creates `ScanHistory (status=PENDING)`, and publishes the `scan.image.requested` event to RabbitMQ.
3. **ai-scan.consumer** receives the event (manual ack, prefetch 1): downloads the image → `POST {AI_SERVICE_URL}/predict` (multipart).
4. **ai-service**: YOLO/ViT-MoE inference → returns `{label, confidence}`.
5. The consumer updates `ScanHistory (status=DONE, result)` and `ack`s. The client polls/receives the result.

## Chatbot flow (chat)
1. The client sends a question (with disease/plant context) → backend publishes it to `chat_queue`.
2. consumer → `POST {AI_SERVICE_URL}/chat`.
3. ai-service: RAG (Chroma + vietnamese-sbert retrieving `plant_knowledge.json`) → builds the prompt → Gemini → responds. Stores `ChatHistory`.

> **Important**: backend ↔ ai-service communication is **HTTP**. RabbitMQ is only used to queue internal jobs (to prevent bottlenecks when the AI is under heavy load). `worker.py` (Python-as-consumer) is legacy architecture and is **not used**.

## Boundaries & dependencies
| Component | Depends on | Provides |
|-----------|------------|----------|
| web / mobile | backend (REST) | UI |
| backend | MongoDB, Redis, RabbitMQ, GCS, ai-service, SMTP, OAuth | REST `/api`, auth, business logic |
| ai-service | model weights, Chroma, Gemini | `/predict`, `/chat` |
| @agri-scan/database | MongoDB | Mongoose models + seeds |
| @agri-scan/shared | — | zod schemas, utils (used by web/mobile) |

## Infrastructure (dev)
`infra/docker-compose/docker-compose.yml`: `mongodb`, `redis`, `rabbitmq`, `ai-service`, `backend`, `web` on the `agri-net` network; volumes `asa-mongo-data`, `asa-redis-data`, `rabbitmq_data`.

## Technical debt

**Resolved (Phase B, 2026-07-10):**
- ✅ Fixed `ai-service/requirements.txt` (added google-genai + torch/torchvision/numpy; removed redundant deps).
- ✅ Switched `ai-service/.env.example` to Gemini (`GOOGLE_API_KEY`).
- ✅ Removed dead code `ai/worker.py`, `ai/main_backup.py`.
- ✅ `/predict` fixed the `_label` key → `yolo_label`.
- ✅ Build order: added `pnpm build` / `build:packages` / `build:backend` at the root (building backend/web individually used to fail because `@agri-scan/*` was not built yet).
- ✅ Web: restored `MOCK_PLANTS` (an orphaned import broke `next build`).
- ✅ Backend: 3 scaffold specs failed due to missing DI mocks → provided mock providers, 4/4 pass.
- ✅ `order.schema.ts`: removed the duplicate `orderStatus` index (Mongoose warning).

- ✅ Backend lint: **334 → 0** (fixed at the root, without disabling rules). Added `common/types/authenticated-request.ts` + `common/utils/error.util.ts`; typed DTO/axios/`req.user`; completed timestamps in schemas; removed `as any`. Added `pnpm --filter backend lint` to the quality gate.

**Remaining (proposed):**
- FastAPI `on_event("startup")` is deprecated → should use `lifespan`.
- Backend CORS/`OAUTH_SUCCESS_REDIRECT` hardcode localhost — need env-based configuration for production.
- The My Garden catalog (`MOCK_PLANTS`) is currently static data — should be sourced from `plant.service`/backend.
