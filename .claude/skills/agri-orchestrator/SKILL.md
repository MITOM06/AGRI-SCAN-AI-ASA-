---
name: agri-orchestrator
description: Orchestrates AGRI-SCAN-AI's specialist agent team (backend-nest, ai-service-py, web-next, mobile-expo, reviewer-qa) for multi-app tasks, refactors, whole-system debugging, and cross-service feature work. Use when the work touches multiple apps at once, or when work needs to be routed to the right specialist. Also use for follow-up requests like "redo", "update", "keep fixing", "only part X", "re-review", "whole-system debug".
---

# agri-orchestrator — AGRI-SCAN-AI Team Orchestration

Route work to the right specialist agent and coordinate when the work touches multiple apps. This is the default run mode for multi-app tasks in this repo.

## Lineup (specialist pool)
| Agent | Scope |
|-------|-------|
| `backend-nest` | `apps/backend` (NestJS, Mongo, RabbitMQ, Redis, auth) |
| `ai-service-py` | `apps/ai-service` (FastAPI, ViT-MoE/YOLO, RAG, Gemini) |
| `web-next` | `apps/web` (Next.js) |
| `mobile-expo` | `apps/mobile` (Expo/RN) |
| `reviewer-qa` | Cross-cutting review/QA (generate-verify) |

Invoke agents with the `Agent` tool using `model: "opus"`.

## Phase 0 — Context check (mandatory before starting)
1. An old `_workspace/` exists + the user asks to fix part of it → **re-run partially** (only call the relevant agent).
2. An old `_workspace/` exists + the user provides new input → move it to `_workspace_prev/`, **run fresh**.
3. No `_workspace/` → **first run**.

## Routing
1. Determine which apps the work touches (by path/keyword).
2. **Single app** → call the corresponding agent directly.
3. **Multiple apps** → choose a model:
   - **Pipeline** (sequential dependencies): e.g. changing the ai-service response shape → update the backend consumer → update the web/mobile services. Run in order, passing results through files.
   - **Fan-out** (independent, parallel): fixing the same kind of bug across several independent apps → `run_in_background: true` for each agent.
4. **Always close with generate-verify**: once the specialists finish, call `reviewer-qa` to cross-check boundaries + run the quality gate (`verify-agri`).

## Passing data
- Intermediates: write to `_workspace/{phase}_{agent}_{artifact}.md`.
- Parallel/independent: use the `Agent` return value.
- API/schema contract changes: write the new shape clearly into `_workspace/contract.md` so all sides read from the same source.

## Error handling
- Agent failure → retry once; if it still fails → continue with the other parts and clearly note the missing item in the report (don't silently skip).
- Conflicting data between sides → don't delete anything on your own; surface both sources for the user to decide (this is a "fork", see CLAUDE.md Rule #1).

## Quality gate
Before reporting completion, run the `verify-agri` skill for the affected apps and read the output. Don't declare "done" without evidence.

## Follow-up tasks
- "keep fixing part X" → only re-call X's agent, read the prior diff/report from `_workspace/`.
- "re-review" → call `reviewer-qa` over the current scope.
- "whole-system debug" → see `## Scenario: Whole-system debug`.

## Test scenarios
**Normal flow** — "Add a `severity` field to the scan result":
1. `ai-service-py` adds the field to the `/predict` response → writes `_workspace/contract.md`.
2. `backend-nest` reads the contract, updates the consumer + `ScanHistory`.
3. `web-next` + `mobile-expo` (fan-out) update the display.
4. `reviewer-qa` cross-checks the shape across the 3 sides + runs `verify-agri`.

**Failure flow** — one agent's build fails:
1. Take the error output, retry once with a specific hint.
2. Still failing → the report clearly states that app is not done + the error log; the other apps still complete.

## Scenario: Whole-system debug
1. `reviewer-qa` scans the whole repo and lists issues by severity into `_workspace/issues.md`.
2. The orchestrator groups the issues by app.
3. Fan-out the specialist agents to fix by group (independent) or pipeline (if dependent).
4. `reviewer-qa` re-verifies everything + `verify-agri`.
5. Summary report: what was fixed, what remains, evidence.
