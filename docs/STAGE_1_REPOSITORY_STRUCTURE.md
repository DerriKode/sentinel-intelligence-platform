# Stage 1 Repository Structure

**Status:** S1-01 complete  
**Date:** 2026-07-17  
**Scope:** Directory structure and environment placeholders only

## Approved structure

```text
apps/
  api/                 Django/DRF application foundation (S1-03)
  web/                 React/TypeScript/Vite foundation (S1-02)
  worker/              Redis/Celery background-worker boundary
packages/
  contracts/           Explicit cross-module/API contracts
infra/
  mysql/               MySQL configuration boundary (S1-04)
  redis/               Redis/Celery configuration boundary
  storage/             Protected media storage abstraction
scripts/               Safe repository and operational scripts
tests/
  architecture/        Module and dependency-boundary checks
  security/             Authorization and threat-control checks
  fixtures/             Synthetic test data only
docs/                  Genuine project documentation
```

## Environment safety

- The existing root `.env.example` contains variable names and placeholder values only.
- Real `.env` files, credentials, keys, evidence, personal photographs, biometric data, and production exports remain excluded.
- No framework was initialized, no package was installed, and no database or service was started in S1-01.
- `.git/info/exclude` continues to exclude local `AGENTS.md`, `HANDOFF.md`, and `/.sentinel-local/`.

## Verification and recovery

The structure is additive and contains no application state. Recovery is to leave the placeholders in place and continue with the next approved foundation prompt. Any framework initialization, dependency installation, database configuration, or service startup requires its own scoped prompt and targeted verification.

## Next foundation ownership

- S1-02 owns `apps/web/`.
- S1-03 owns `apps/api/` and the worker boundary as scoped by its prompt.
- S1-04 owns `infra/mysql/` configuration and verification.
