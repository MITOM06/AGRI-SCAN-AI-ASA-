# Contributing & Team Workflow — AGRI-SCAN-AI

> ⚠️ **Important:** This project follows Open Source grading criteria. Every member **must** follow the Git workflow below to demonstrate project-management skills to the judging panel.

See also: [overall architecture](ARCHITECTURE.md) · [roadmap & business model](ROADMAP.md).

## 1. Branching Strategy

Use a basic Git Flow model to avoid code conflicts:

| Branch | Role |
|--------|------|
| `main` | The complete, most stable source code. Used for CI/CD & deployment. **NEVER PUSH DIRECTLY.** |
| `dev` | The central branch for integrating members' code during development. |
| `feature/<feature-name>` | Branch for building a new feature (e.g. `feature/ai-scan-ui`). |
| `fix/<bug-name>` | Branch for fixing a bug (e.g. `fix/camera-crash`). |
| `refactor/<scope>` | Branch for optimization/cleanup with no behavior change (e.g. `refactor/harness-docs`). |

## 2. Pull Request Process

1. Finish the feature on your own `feature/...` branch.
2. Push the branch to GitHub and open a Pull Request (PR) to merge into the `dev` branch.
3. At least **one other member** must review the code and confirm it runs without errors before it can be approved & merged.

## 3. Commit Convention (Conventional Commits)

| Prefix | When to use |
|--------|-------------|
| `feat:` | Adding a new feature. |
| `fix:` | Fixing a system bug. |
| `docs:` | Updating documentation (README, API Swagger, docs/). |
| `chore:` | Miscellaneous configuration, adding a library. |
| `refactor:` | Re-optimizing code without changing behavior. |

## 4. Quality Gate Before Opening a PR

Before declaring "done", **actually run** the relevant commands and read the output (details in [`CLAUDE.md`](../CLAUDE.md), section 6):

```bash
pnpm build                    # packages → backend → web (in order)
pnpm --filter backend lint
pnpm --filter backend test
```

> Do not change tests to match wrong code; fix the code to match the correct behavior.
