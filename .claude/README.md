# .claude/ — AGRI-SCAN-AI Harness

Per-project configuration for the agent team + skills. Claude Code loads the metadata from here automatically.

## Agents (`.claude/agents/`)
| Agent | Role | Scope |
|-------|------|-------|
| `backend-nest` | NestJS specialist | `apps/backend` |
| `ai-service-py` | Python/FastAPI/ML | `apps/ai-service` |
| `web-next` | Next.js | `apps/web` |
| `mobile-expo` | Expo/React Native | `apps/mobile` |
| `reviewer-qa` | Cross-cutting review/QA (generate-verify) | whole repo |

Every agent runs on `model: opus`.

## Skills (`.claude/skills/`)
| Skill | Purpose |
|-------|---------|
| `agri-orchestrator` | Multi-app orchestration: routing to agents, pipeline/fan-out, closing with QA |
| `verify-agri` | Quality gate: the correct build/lint/test commands for each app |

## Model
**Specialist pool + generate-verify**: one specialist per app, `reviewer-qa` signs off on quality, `verify-agri` is the evidence gate.

## Evolution
The harness is an evolving system. After every large run, update the agents/skills and record the change in the **Change history** table in `CLAUDE.md` (section 8).

## Conventions
- Do not create `.claude/commands/`.
- Multi-app intermediates go into `_workspace/` (already in `.gitignore`).
