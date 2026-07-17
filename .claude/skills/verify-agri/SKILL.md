---
name: verify-agri
description: The quality gate for AGRI-SCAN-AI — run the correct build/lint/test commands for each app (backend NestJS, ai-service Python, web Next.js, mobile Expo) and read the output before declaring "done/fixed/passing". Use whenever you are about to assert a change is complete, or before committing/merging.
---

# verify-agri — Per-app Quality Gate

Do not declare "done / fixed / passing" without running the appropriate command and reading the output. Evidence first, assertions second.

## Pick commands by affected app

### backend (`apps/backend`)
```bash
pnpm build:backend               # builds packages first THEN backend (use this one, required)
# (pnpm --filter backend build on its own fails if @agri-scan/* is not built yet)
pnpm --filter backend lint
pnpm --filter backend test       # if the touched module has *.spec.ts (auth, users, app)
```

### ai-service (`apps/ai-service`)
```bash
cd apps/ai-service
python -c "import ai.main"        # imports without errors (after installing requirements)
# if it runs:
uvicorn ai.main:app --port 8000 &  # then: curl -s localhost:8000/  → {"status":"ok"}
```

### web (`apps/web`)
```bash
pnpm --filter web build           # required for changes with logic
pnpm --filter web lint
```

### mobile (`apps/mobile`)
```bash
# Can't build a binary quickly in CI → typecheck at minimum:
pnpm --filter mobile exec tsc --noEmit   # if there's a suitable tsconfig
# and describe clearly the manual test steps on Expo Go
```

### packages
```bash
pnpm --filter @agri-scan/database build
pnpm --filter @agri-scan/shared build
```

## Rules
1. Only run commands for the app that is **actually affected** (save time/tokens).
2. Read the output; if it fails → report the error output, do NOT say it's done.
3. Do not change tests to match wrong code — fix the code to match the correct behavior.
4. For runtime changes, prefer running for real (drive the flow), not just building.
5. Record the commands you ran + a summary of the results in the final report.

## When you can't run it
If the environment is missing something (deps not installed, no DB/Redis/GPU) → state clearly "couldn't verify because X" and suggest how the user can run it themselves (hint: use `! <command>` in the session). Don't pretend it passed.
