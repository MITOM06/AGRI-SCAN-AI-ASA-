# apps/backend — CLAUDE.md

API gateway + nghiệp vụ. **NestJS 11** (TypeScript). Đọc file này khi làm việc trong `apps/backend`.

## Stack
- **NestJS** (controller/service/module/dto/guard/strategy).
- **MongoDB** qua `@nestjs/mongoose`; models nằm ở `@agri-scan/database`.
- **RabbitMQ** microservice (`@nestjs/microservices`, transport RMQ): queue `scan_queue` (prefetch 1) và `chat_queue` (prefetch 5), manual ack/nack.
- **Redis** cache (`@nestjs/cache-manager` + `cache-manager-redis-yet`, isGlobal).
- **Auth**: JWT (`@nestjs/jwt` + Passport) + OAuth Google/Facebook.
- **GCS** (`@google-cloud/storage`) lưu ảnh; mailer (SMTP) gửi OTP/email.
- Global prefix `api`; `ValidationPipe` (whitelist + forbidNonWhitelisted + transform).

## Cấu trúc
```
src/
  main.ts                  # bootstrap HTTP + 2 RMQ microservices, CORS, ValidationPipe
  app.module.ts            # ConfigModule, Mongoose, Cache(Redis), + các feature module
  common/
    decorators/roles.decorator.ts
    guards/roles.guard.ts
    rabbitmq/rabbitmq.module.ts
  modules/
    auth/ admin/ ai-scan/ users/ plants/ products/ orders/ weather/ my-garden/
```
Mỗi module: `*.controller.ts`, `*.service.ts`, `*.module.ts`, `dto/`, (auth thêm `guards/`, `strategies/`).

## Luồng AI scan / chat
1. Client → `ai-scan.controller` → publish event lên RabbitMQ.
2. `ai-scan.consumer.ts` (`@EventPattern('scan.image.requested')` / chat) tải ảnh, gọi **HTTP** `AI_SERVICE_URL` (FastAPI `/predict`, `/chat`), lưu `ScanHistory`/`ChatHistory`, manual ack.
> Lưu ý: giao tiếp với ai-service là **HTTP**, RMQ chỉ để xếp hàng job nội bộ.

## Lệnh
```bash
pnpm --filter backend start:dev   # watch
pnpm --filter backend build
pnpm --filter backend lint
pnpm --filter backend test        # jest (có *.spec.ts trong auth, users, app)
pnpm --filter backend test:e2e
```

## ENV (xem `.env.example`)
`PORT`, `AI_SERVICE_URL`, `JWT_SECRET`, `DB_URI`, `REDIS_HOST/PORT`, `RABBITMQ_URL`, `SMTP_*`, `GOOGLE_*`, `FACEBOOK_*`, `OAUTH_SUCCESS_REDIRECT`, `OWM_API_KEY`.

## Quy tắc khi sửa
- Input mới → tạo DTO + `class-validator`.
- Route cần quyền → dùng `@Roles()` + `RolesGuard` / `JwtAuthGuard`.
- Consumer RMQ: luôn `channel.ack`/`nack` đúng nhánh để tránh kẹt queue.
- Sau khi sửa: tối thiểu `build`; chạy `test` nếu module có spec.
