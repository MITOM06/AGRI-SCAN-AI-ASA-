# Kiến trúc AGRI-SCAN-AI

Monorepo **pnpm workspace**: 4 app (`backend`, `ai-service`, `web`, `mobile`) + 2 package dùng chung (`@agri-scan/database`, `@agri-scan/shared`).

## Sơ đồ tổng thể

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
                GCS  │       │  publish   │   GCS    │ (ảnh)
              (ảnh)◀─┘       ▼            └──────────┘
                     ┌──────────────┐
                     │  RabbitMQ    │  scan_queue (prefetch 1)
                     │  (job queue) │  chat_queue (prefetch 5)
                     └──────┬───────┘
                            │ consumer (ai-scan.consumer.ts) lấy job
                            │ rồi gọi HTTP  ▼
                     ┌──────────────────────────┐
                     │        ai-service        │
                     │        (FastAPI)         │
                     │  /predict  → ViT-MoE+YOLO│
                     │  /chat     → RAG + Gemini │
                     └──────────────────────────┘
```

## Luồng quét ảnh (scan)
1. **Client** (web/mobile) upload ảnh → `POST /api/ai-scan/...`.
2. **backend** lưu ảnh (GCS), tạo `ScanHistory (status=PENDING)`, publish event `scan.image.requested` lên RabbitMQ.
3. **ai-scan.consumer** nhận event (manual ack, prefetch 1): tải ảnh → `POST {AI_SERVICE_URL}/predict` (multipart).
4. **ai-service**: YOLO/ViT-MoE suy luận → trả `{label, confidence}`.
5. consumer cập nhật `ScanHistory (status=DONE, result)`, `ack`. Client poll/nhận kết quả.

## Luồng chatbot (chat)
1. Client gửi câu hỏi (kèm ngữ cảnh bệnh/cây) → backend publish lên `chat_queue`.
2. consumer → `POST {AI_SERVICE_URL}/chat`.
3. ai-service: RAG (Chroma + vietnamese-sbert truy hồi `plant_knowledge.json`) → dựng prompt → Gemini → trả lời. Lưu `ChatHistory`.

> **Quan trọng**: giao tiếp backend ↔ ai-service là **HTTP**. RabbitMQ chỉ dùng để xếp hàng job nội bộ (chống nghẽn khi AI nặng). `worker.py` (Python-as-consumer) là kiến trúc cũ, **không dùng**.

## Ranh giới & phụ thuộc
| Thành phần | Phụ thuộc vào | Cung cấp |
|-----------|----------------|----------|
| web / mobile | backend (REST) | UI |
| backend | MongoDB, Redis, RabbitMQ, GCS, ai-service, SMTP, OAuth | REST `/api`, auth, nghiệp vụ |
| ai-service | model weights, Chroma, Gemini | `/predict`, `/chat` |
| @agri-scan/database | MongoDB | Mongoose models + seeds |
| @agri-scan/shared | — | zod schemas, utils (dùng bởi web/mobile) |

## Hạ tầng (dev)
`infra/docker-compose/docker-compose.yml`: `mongodb`, `redis`, `rabbitmq`, `ai-service`, `backend`, `web` trên mạng `agri-net`; volume `asa-mongo-data`, `asa-redis-data`, `rabbitmq_data`.

## Nợ kỹ thuật

**Đã xử lý (Phase B, 2026-07-10):**
- ✅ `ai-service/requirements.txt` sửa lại (thêm google-genai + torch/torchvision/numpy; bỏ dep thừa).
- ✅ `ai-service/.env.example` chuyển sang Gemini (`GOOGLE_API_KEY`).
- ✅ Xoá code chết `ai/worker.py`, `ai/main_backup.py`.
- ✅ `/predict` sửa key `_label` → `yolo_label`.
- ✅ Build order: thêm `pnpm build` / `build:packages` / `build:backend` ở root (backend/web build đơn lẻ từng fail vì `@agri-scan/*` chưa build).
- ✅ Web: khôi phục `MOCK_PLANTS` (import mồ côi làm `next build` fail).
- ✅ Backend: 3 spec scaffold fail do thiếu mock DI → đã cấp mock provider, 4/4 pass.
- ✅ `order.schema.ts`: bỏ index trùng `orderStatus` (Mongoose warning).

- ✅ Backend lint: **334 → 0** (fix tận gốc, không tắt rule). Thêm `common/types/authenticated-request.ts` + `common/utils/error.util.ts`; type DTO/axios/`req.user`; hoàn thiện timestamps trong schema; bỏ `as any`. Thêm `pnpm --filter backend lint` vào cổng chất lượng.

**Còn lại (đề xuất):**
- FastAPI `on_event("startup")` deprecated → nên dùng `lifespan`.
- Backend CORS/`OAUTH_SUCCESS_REDIRECT` hardcode localhost — cần cấu hình theo env cho production.
- My Garden catalog (`MOCK_PLANTS`) đang là dữ liệu tĩnh — nên lấy từ `plant.service`/backend.
