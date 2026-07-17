# Stage 0 Decision Register

| ID | Decision | Evidence | Status |
|---|---|---|---|
| D-001 | Release 1 is a secure academic demonstration and controlled pilot, not national or autonomous deployment | `STAGE_0_SCOPE_AND_STAKEHOLDERS.md` | Locked |
| D-002 | Use a modular monolith with separately scalable workers | `ARCHITECTURE_AND_MODULE_BOUNDARIES.md` | Locked |
| D-003 | React/TypeScript/Vite portals use Django/DRF APIs; browsers never access data services directly | `ARCHITECTURE_AND_MODULE_BOUNDARIES.md` | Locked |
| D-004 | MySQL is the authoritative structured-data store; protected media is outside MySQL behind an abstraction | `DATA_MODEL_AND_DATA_GOVERNANCE.md` | Locked |
| D-005 | Access is deny-by-default across role, organization, unit, assignment, workflow, responsibility, sensitivity, and explicit authorization | `SECURITY_ROLE_AND_AI_GOVERNANCE.md` | Locked |
| D-006 | AI produces candidate results only; an authorized human must choose confirmed, rejected, or inconclusive | `SECURITY_ROLE_AND_AI_GOVERNANCE.md` | Locked |
| D-007 | Stage 0 budgets are provisional and require measurement; production sensitive-data retention requires formal review | `NON_FUNCTIONAL_REQUIREMENTS_AND_BUDGETS.md` | Locked with review gate |
| D-008 | Stage 1 implementation could not begin until `APPROVE BLUEPRINT` was observed | `STAGE_0_BLUEPRINT_V1_CHECKPOINT.md` | Satisfied |
| D-009 | Use the repository quality wrapper plus GitHub Actions for repeatable backend/frontend checks; keep the committed npm lockfile authoritative | `STAGE_1_QUALITY_TOOLING_AND_CI.md`, `STAGE_1_FOUNDATION_CHECKPOINT.md` | Locked for foundation |
| D-010 | Use eager/memory Celery settings for isolated tests until a Redis service is available; do not treat this as live-worker evidence | `STAGE_1_REDIS_CELERY_CONFIGURATION.md`, `STAGE_1_FOUNDATION_CHECKPOINT.md` | Locked with limitation |
| D-011 | Use the Windows setup, service, status, and check scripts as the supported local workflow; service actions remain explicit and reversible | `STAGE_1_LOCAL_SETUP_AND_SERVICES.md`, `STAGE_1_FOUNDATION_CHECKPOINT.md` | Locked for foundation |
| D-012 | Stage 2 may not begin until `APPROVE STAGE 1` is observed | `STAGE_1_FOUNDATION_CHECKPOINT.md` | Pending approval |
| D-013 | Use calm enterprise authority as the shared visual direction: restrained semantic tokens, task clarity, evidence-aware content, accessible states, and no sensational or decorative dashboard patterns | `STAGE_2_DESIGN_DIRECTION.md` | Approved 2026-07-17 |
| D-014 | Separate internal `/app/*` and public `/public/*` route trees; use capability-informed navigation with independent backend authorization and no sensitive values in URLs | `STAGE_2_INFORMATION_ARCHITECTURE.md` | Locked for Stage 2 |
| D-015 | Centralize visual foundations in CSS custom properties with semantic aliases and a local/system font stack; add no font, CSS framework, or token-build dependency | `STAGE_2_DESIGN_TOKENS_AND_TYPOGRAPHY.md`, `apps/web/src/styles/tokens.css` | Implemented |
| D-016 | Compact navigation is removed from keyboard/accessibility flow while closed and manages entry, Escape/scrim closure, and focus restoration; global styles support forced contrast, coarse input, reduced motion, and 320 px layouts | `STAGE_2_ACCESSIBILITY_AND_RESPONSIVE_FOUNDATIONS.md` | Implemented |

Material changes require an architecture, security, data, or scope decision record before implementation proceeds.
