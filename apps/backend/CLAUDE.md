# apps/backend — CLAUDE.md

API gateway + business logic. **NestJS 11** (TypeScript). Read this file when working in `apps/backend`.

## Stack
- **NestJS** (controller/service/module/dto/guard/strategy).
- **MongoDB** via `@nestjs/mongoose`; models live in `@agri-scan/database`.
- **RabbitMQ** microservice (`@nestjs/microservices`, RMQ transport): the `scan_queue` (prefetch 1) and `chat_queue` (prefetch 5) queues, manual ack/nack.
- **Redis** cache (`@nestjs/cache-manager` + `cache-manager-redis-yet`, isGlobal).
- **Auth**: JWT (`@nestjs/jwt` + Passport) + Google/Facebook OAuth.
- **GCS** (`@google-cloud/storage`) stores images; the mailer (SMTP) sends OTP/emails.
- Global prefix `api`; `ValidationPipe` (whitelist + forbidNonWhitelisted + transform).

## Structure
```
src/
  main.ts                  # bootstraps HTTP + 2 RMQ microservices, CORS, ValidationPipe
  app.module.ts            # ConfigModule, Mongoose, Cache(Redis), + the feature modules
  common/
    decorators/roles.decorator.ts
    guards/roles.guard.ts
    rabbitmq/rabbitmq.module.ts
  modules/
    auth/ admin/ ai-scan/ users/ plants/ products/ orders/ weather/ my-garden/
```
Each module: `*.controller.ts`, `*.service.ts`, `*.module.ts`, `dto/`, (auth also has `guards/`, `strategies/`).

## AI scan / chat flow
1. Client → `ai-scan.controller` → publishes an event to RabbitMQ.
2. `ai-scan.consumer.ts` (`@EventPattern('scan.image.requested')` / chat) downloads the image, calls **HTTP** `AI_SERVICE_URL` (FastAPI `/predict`, `/chat`), stores `ScanHistory`/`ChatHistory`, manual ack.
> Note: communication with ai-service is **HTTP**; RMQ is only for queuing internal jobs.

## Commands
```bash
pnpm --filter backend start:dev   # watch
pnpm --filter backend build
pnpm --filter backend lint
pnpm --filter backend test        # jest (there are *.spec.ts files in auth, users, app)
pnpm --filter backend test:e2e
```

## ENV (see `.env.example`)
`PORT`, `AI_SERVICE_URL`, `JWT_SECRET`, `DB_URI`, `REDIS_HOST/PORT`, `RABBITMQ_URL`, `SMTP_*`, `GOOGLE_*`, `FACEBOOK_*`, `OAUTH_SUCCESS_REDIRECT`, `OWM_API_KEY`.

## Rules when editing
- New input → create a DTO + `class-validator`.
- Routes needing authorization → use `@Roles()` + `RolesGuard` / `JwtAuthGuard`.
- RMQ consumers: always `channel.ack`/`nack` on the correct branch to avoid queue stalls.
- After editing: `build` at minimum; run `test` if the module has specs.
