# Stage 1 Quality Tooling and CI

**Status:** S1-07 implementation recorded
**Scope:** Local and GitHub Actions quality gates for the backend and frontend

## Quality gates

- Python uses Ruff for deterministic formatting and lint checks; Django system checks, migration drift checks, and targeted tests remain required.
- Frontend uses strict TypeScript, ESLint, Vitest, and Vite production build checks.
- `scripts/windows/run-checks.ps1` runs the same backend gates locally and optionally includes all frontend gates with `-IncludeFrontend`.
- `.github/workflows/quality.yml` runs on `main` pushes and pull requests with read-only repository permissions, cancellation of superseded runs, and no application credentials.
- CI uses SQLite and eager Celery test settings; MySQL and Redis service verification remains an environment/service concern covered by local setup documentation.

## Required local commands

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\windows\run-checks.ps1 -IncludeFrontend
```

The frontend lockfile is required for reproducible `npm ci` in CI. The workflow does not execute scripts from dependencies and builds only from repository source.

## Observed verification

Ruff formatting/lint, Django checks, migration drift, and 7 backend tests pass locally. Frontend typecheck, lint, 8 tests, and build also passed with the installed dependency tree. A subsequent clean `npm ci --ignore-scripts` attempt reached the registry but ended with `ECONNRESET`; offline repair could not find the `react-dom` tarball in the local cache. No tracked source was changed by that environment failure.

## Recovery

If a quality gate fails, preserve the output, fix the smallest affected scope, and rerun the same command. Do not bypass a gate, disable CI, commit generated build output, or use destructive cleanup. Database and Redis-backed checks remain separate from this CI job so unavailable local services do not turn into hidden credentials or non-reproducible CI state.
