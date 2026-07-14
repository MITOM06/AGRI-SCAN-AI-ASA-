# CLAUDE.md — Rules & Guidance for Claude Code

The root rules file for the **AGRI-SCAN-AI** project. Claude Code reads this file every session.
Detailed per-app documentation lives in `apps/<app>/CLAUDE.md` (load on demand to save tokens).
Overall architecture: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

---

## 1. Rule #1 — Authority & Autonomy

The project owner has granted Claude **full authority** over this codebase:

- ✅ May **edit / create / delete / refactor** any file/code as needed.
- ✅ May run build/test/lint and normal git operations while working.
- ✅ **Be proactive**: act when you have enough information; do not re-ask for anything you can infer or reasonably default.
- ❓ **Only ask** at **direction decisions**: major architecture changes, choosing between design directions you cannot decide yourself, changing the scope of work, or hard-to-reverse/outward-facing operations (deploy, delete data, public push).

> **Act by default, ask only at forks.**

## 2. Language

- **Communicate with the project owner: Vietnamese.**
- Code/identifiers in English; comments may be in Vietnamese following the repo's existing style.

## 3. Project overview

AGRI-SCAN-AI: an AI-powered crop-image scanning platform — disease/species recognition, wiki lookup, RAG chatbot, weather, my-garden, and an agriculture marketplace. A **pnpm workspace** monorepo.

| App | Stack | Role |
|-----|-------|------|
| `apps/backend` | NestJS, MongoDB/Mongoose, RabbitMQ, Redis, JWT/Passport, GCS | API gateway + business logic |
| `apps/ai-service` | Python, FastAPI, ViT-MoE (timm) + YOLO, RAG (chromadb/langchain), Claude | Image inference + chatbot |
| `apps/web` | Next.js (App Router), Tailwind, Gemini SDK | Web client |
| `apps/mobile` | Expo Router, React Native, expo-camera | Mobile app |
| `packages/database` | Mongoose models + seeds | `@agri-scan/database` |
| `packages/shared` | zod schemas, utils | `@agri-scan/shared` |

Dev infrastructure: `infra/docker-compose/docker-compose.yml` (mongodb, redis, rabbitmq, ai-service, backend, web).

## 4. Common commands

```bash
# Install (from repo root)
pnpm install

# Run
pnpm dev:web                 # web (Next.js)
pnpm dev:mobile              # mobile (Expo)
pnpm --filter backend start:dev
# ai-service: cd apps/ai-service && uvicorn ai.main:app --reload

# Infrastructure
docker compose -f infra/docker-compose/docker-compose.yml up -d

# Build — ALWAYS build packages first (backend/web depend on @agri-scan/*)
pnpm build                   # packages → backend → web (in order)
pnpm build:packages          # database + shared only
pnpm build:backend           # packages + backend
# ⚠️ `pnpm --filter backend build` on its own will FAIL if packages are not built yet.

# Testing / quality (backend)
pnpm --filter backend lint
pnpm --filter backend test

# DB seed
pnpm --filter @agri-scan/database seed
```

## 5. Code conventions

- **TypeScript**: follow each app's ESLint/Prettier. Backend follows NestJS conventions (module/controller/service/dto/guard/strategy).
- **DTO + `class-validator`** for every backend input; `ValidationPipe` with `whitelist` + `forbidNonWhitelisted` enabled.
- **zod** for validation on web/mobile/shared.
- Name files after the existing pattern in nearby modules (mostly kebab-case `*.controller.ts`, `*.service.ts`, `*.module.ts`).
- **Do not** commit secrets; use `.env` (see `*.env.example`).

## 6. Quality Gates — MANDATORY

Before declaring "done / fixed / passing":

1. **Actually run** the relevant command (lint/build/test or run the app) and **read the output**.
2. Only assert with evidence. If you cannot run it → state clearly "not verified".
3. For backend changes with logic: run `pnpm --filter backend build` (at minimum) + tests if any.
4. Do not change tests to match wrong code; fix the code to match the correct behavior.

## 7. Token discipline

- Keep the root CLAUDE.md concise; details live in `apps/<app>/CLAUDE.md` — read only when working on that app.
- Broad searches (scanning many files) → use the **Explore/Task agent**, don't read files one by one yourself.
- Do not read `pnpm-lock.yaml`, `img/**`, `**/dist`, `**/.next`, model weights (`*.pth`), or large files unless truly necessary.
- Use the dedicated agents (section 8) for work within each app.

## 8. Harness: AGRI-SCAN-AI

**Goal:** route work to the right specialist per app and orchestrate multi-app/refactor/debug tasks.

**Trigger:** Work touching **multiple apps**, a large refactor, or "whole-system debugging" → use the **`agri-orchestrator`** skill. Work within a **single app** → call the corresponding agent directly (`backend-nest`, `ai-service-py`, `web-next`, `mobile-expo`). About to declare "done/passing" → use the **`verify-agri`** skill. Simple questions → answer directly.

Definitions live in `.claude/agents/` and `.claude/skills/`. See [`.claude/README.md`](.claude/README.md).

**Change history:**
| Date | Change | Target | Reason |
|------|--------|--------|--------|
| 2026-07-10 | Bootstrap the harness (5 agents + orchestrator + verify) | all of `.claude/` | Initial setup |
