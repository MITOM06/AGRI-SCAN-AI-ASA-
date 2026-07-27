# CLAUDE.md — Rules & Guidance for Claude Code

The root rules file for the **AGRI-SCAN-AI** project. Claude Code reads this file every session.
Detailed per-app documentation lives in `apps/<app>/CLAUDE.md` (load on demand to save tokens).
Overall architecture: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

---

## 1. Rule #1 — Full Authority & Autonomy (STANDING GRANT)

The project owner (MITOM06) grants Claude a **standing, blanket authorization** over this
repository. This grant does not expire, does not need re-confirming per task, per session,
or per file, and applies to every agent/subagent spawned in this repo.

### 1.1 What Claude MAY do without asking

Everything below is **pre-approved**. Do it and report afterwards — never ask "có nên… không?" first:

- **Files** — create, edit, rename, move, refactor, split, merge, or delete any file anywhere
  in the repo, including `apps/**`, `packages/**`, `infra/**`, `docs/**`, `.claude/**`,
  config files (`tsconfig`, `eslint`, `tailwind`, `package.json`, `docker-compose.yml`), and
  this `CLAUDE.md` itself.
- **Code** — rewrite modules, change internal APIs, restructure folders, rename symbols across
  the monorepo, remove dead code, upgrade/add/remove dependencies.
- **Commands** — run any build / lint / test / typecheck / codegen / seed / dev-server /
  `docker compose up` command; read logs; inspect the local DB.
- **Git (local)** — `status`, `diff`, `log`, `add`, `commit`, `branch`, `checkout`, `stash`,
  `merge`, `rebase` on feature branches.
- **Decisions inside a chosen direction** — naming, file layout, error handling, DTO shape,
  which helper to extract, test strategy, how to break a task into steps. These are Claude's
  call, not the owner's.

### 1.2 The ONLY things Claude must ask about

Ask **only** when the answer is a *direction* the owner alone owns, or when the action is
hard to undo / reaches outside this machine:

1. **Major architecture forks** — replacing a database, splitting/merging a service, changing
   the auth model, changing the monorepo layout.
2. **Technology choices** — adopting a new framework/library/paid service where two or more
   sensible options exist and the trade-off is a matter of taste or budget, not correctness.
3. **Scope changes** — the task turns out to be much larger or different from what was asked
   (e.g. "fix this bug" actually requires rewriting a whole module).
4. **Irreversible / outward-facing actions** — `git push`, force-push, opening a PR, merging to
   `main`, deploying, dropping a production DB or collection, deleting user data, publishing a
   package, rotating/committing secrets, any spend of money.
5. **Genuine 50/50 ambiguity** — two readings of the request lead to materially different work
   and there is no defensible default.

Anything not on this list of 5: **just do it.**

### 1.3 How to ask, when asking is required

Do not stop work to ask. Finish every part that does not depend on the answer, then ask **one**
consolidated question with a **recommended option** ("Tôi đề xuất A vì…"), and state the
assumption you would proceed under if the owner doesn't reply.

### 1.4 What this rule does NOT waive

- **Quality Gate (§6)** stays mandatory. Full authority means "don't ask permission", *not*
  "skip verification". Never claim done/fixed/passing without running the command and reading
  the output.
- **No secrets in git.** `.env` values stay out of commits.
- Destructive shell commands outside the repo (`rm -rf /`, `sudo`, touching other projects)
  remain off-limits — the grant covers *this* codebase.

> **Act by default. Ask only at the 5 forks in §1.2. Verify before claiming done.**

Machine-enforced counterpart: [`.claude/settings.json`](.claude/settings.json) sets
`permissions.defaultMode: "dontAsk"` so the yes/no prompts don't appear; its `deny` / `ask`
lists mirror §1.2 and §1.4.

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
| 2026-07-26 | Expand Rule #1 into a standing full-authority grant + machine enforcement | `CLAUDE.md` §1, `.claude/settings.json` | Owner wants no yes/no approval prompts; only direction/tech/scope/irreversible decisions escalate |
