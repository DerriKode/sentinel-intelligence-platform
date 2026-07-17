# Release 1 Requirements Traceability

**Status:** Stage 0 requirements baseline  
**Date:** 2026-07-17  
**Related documents:** `docs/STAGE_0_ACADEMIC_REPORT_REVIEW.md`, `docs/STAGE_0_SCOPE_AND_STAKEHOLDERS.md`, `docs/REQUIREMENTS_FUNCTIONAL_AND_ACCEPTANCE.md`

## Objective and workflow traceability

| Source objective or workflow | Functional requirements | Verification evidence | Status |
|---|---|---|---|
| Secure authentication, roles, organizations, and audit | FR-101, FR-102, FR-103, FR-201 | Authorization tests; audit event fixtures; denied-access evidence | Baseline |
| People, missing persons, and case management | FR-301, FR-401, FR-601 | Case and person workflow tests; status-history evidence | Baseline |
| Public reports, sightings, and tips | FR-701 | Public portal submission, moderation, isolation, and escalation tests | Baseline |
| Evidence integrity and chain of custody | FR-501, FR-502 | Hash mismatch, custody sequence, retention, and restricted-retrieval tests | Baseline |
| Candidate matching and mandatory human review | FR-801, FR-802 | Controlled media scenarios; candidate provenance; reviewer disposition tests | Baseline |
| Alerts and notifications | FR-901 | Trigger, routing, acknowledgment, closure, and audit tests | Baseline |
| Transparent lead prioritization and evidence assessment | FR-1001 | Factor/evidence-link review; uncertainty; no guilt or arrest output test | Baseline |
| Audit, reporting, backup, and restoration | FR-103, FR-1101, FR-1201 | Report authorization; audit reconstruction; isolated restore evidence | Baseline |

## Role acceptance traceability

| Role acceptance area | Requirements | Required evidence |
|---|---|---|
| Internal login and scoped access | FR-101, FR-102, FR-201 | Valid login, denied cross-scope request, deactivation test |
| Supervisory assignment and approval | FR-401, FR-901, FR-1001 | Assignment, approval, escalation, and reason evidence |
| Investigator case and candidate work | FR-301, FR-401, FR-601, FR-801, FR-802 | End-to-end assigned-case and human-review scenario |
| Evidence custody and integrity | FR-501, FR-502 | SHA-256 verification, custody history, restricted retrieval |
| Audit and oversight | FR-103, FR-1101, FR-1201 | Read-only audit, report filters, restore verification |
| Public reporting | FR-701 | Public reference, safe status, isolation, and moderation evidence |
| Background processing | FR-801, FR-901 | Job provenance, failure handling, version record, no user authority |

## Required test record

Every implementation test linked to this matrix should identify:

1. requirement ID and critical workflow ID;
2. actor, organization, scope, and preconditions;
3. synthetic or approved data fixture;
4. action and expected result;
5. observed result, pass/fail, and failure reason;
6. audit, screenshot, report, hash, log, or restore evidence location.

Non-functional budgets and performance thresholds are defined provisionally in `docs/NON_FUNCTIONAL_REQUIREMENTS_AND_BUDGETS.md`; broader quality gates remain subject to measurement. No requirement in this matrix authorizes autonomous legal decisions, unrestricted surveillance, real sensitive data, or scope expansion.

## Non-functional budget traceability

| Quality area | Budget IDs | Functional or workflow coverage | Verification evidence |
|---|---|---|---|
| Security and privacy | NFR-SEC-001 to NFR-SEC-006, NFR-PRIV-001 to NFR-PRIV-002 | FR-101, FR-102, FR-103, FR-501, FR-502, FR-701, FR-801, FR-802; CW-01 to CW-06 | Authorization matrix, secret scan, rate-limit, upload, session, privacy, and log tests |
| Performance and capacity | NFR-PERF-001 to NFR-PERF-007 | FR-401, FR-501, FR-701, FR-801, FR-901; CW-02 to CW-07 | API/browser traces, pagination/query plans, queue and upload measurements |
| Resilience and recovery | NFR-RES-001 to NFR-RES-005 | FR-103, FR-501, FR-502, FR-901, FR-1201; CW-04, CW-06, CW-08 | Backup/restore report, failure injection, integrity and audit reconstruction |
| Accessibility and browser support | NFR-A11Y-001 to NFR-A11Y-005 | All user-facing FRs; CW-01 to CW-08 | Keyboard, contrast, screen-reader, responsive, and browser matrix |
| Operations and observability | NFR-OPS-001 to NFR-OPS-006 | FR-103, FR-801, FR-901, FR-1101, FR-1201; CW-01, CW-05, CW-06, CW-08 | Timed setup, health checks, logs, monitoring, runbooks, and capacity evidence |

## Architecture and governance traceability

| Locked decision | Source requirements or workflows | Governing document | Verification evidence |
|---|---|---|---|
| Modular monolith, module ownership, and trust boundaries | All FRs; CW-01 to CW-08 | `docs/ARCHITECTURE_AND_MODULE_BOUNDARIES.md` | Architecture review, dependency checks, API boundary tests |
| MySQL authority, protected media, logical entities, retention, and custody | FR-301, FR-401, FR-501, FR-502, FR-1201; CW-03, CW-04, CW-08 | `docs/DATA_MODEL_AND_DATA_GOVERNANCE.md` | Migration, relationship, hash, retention, backup, and restore tests |
| Deny-by-default roles, threats, upload, audit, and AI human review | FR-101, FR-102, FR-103, FR-501, FR-701, FR-801, FR-802, FR-901, FR-1001; CW-01, CW-02, CW-04 to CW-07 | `docs/SECURITY_ROLE_AND_AI_GOVERNANCE.md` | Negative authorization, threat-control, secure-upload, audit, candidate-review, and incident tests |

## Stage 1 foundation checkpoint traceability

| Foundation capability | Requirements/NFR affected | Observed evidence | Status |
|---|---|---|---|
| Repository and local control boundary | NFR-OPS-001, NFR-SEC-001 | Clean `main`, local exclusions, no tracked governance-pack paths | Pass |
| Backend quality and migration safety | NFR-SEC-001, NFR-OPS-002 | Ruff, Django checks, migration drift check, and 7 backend tests | Pass |
| Frontend foundation quality | NFR-A11Y-001 to NFR-A11Y-005, NFR-PERF-001 | 8 tests, typecheck, lint, and build passed in S1-07; clean reinstall currently blocked | Limited pass |
| Local database and worker foundation | NFR-RES-001, NFR-OPS-003 | MySQL service and prior MySQL-backed checks; Celery eager/memory tests; Redis unavailable | Limited pass |
| Reproducible Windows workflow and CI | NFR-OPS-001 to NFR-OPS-006 | Setup/status/check scripts and GitHub Actions workflow present and reviewed | Pass; remote run pending |

Checkpoint evidence is recorded in `docs/STAGE_1_FOUNDATION_CHECKPOINT.md`. Remaining performance, recovery, live-worker, browser-session, and production-security evidence is intentionally deferred to the stages where those capabilities exist.

## Stage 2 design-direction traceability

| Design obligation | Source requirements/NFR | Design evidence | Status |
|---|---|---|---|
| Calm, task-oriented internal and public experience | FR-301, FR-401, FR-601, FR-701; NFR-A11Y-001, NFR-PERF-002 | `docs/STAGE_2_DESIGN_DIRECTION.md` experience principles and layout contract | Proposed; approval pending |
| Accessible, responsive, state-complete components | Cross-cutting acceptance rules; NFR-A11Y-001 to NFR-A11Y-005 | Required state and acceptance matrix | Proposed; implementation verification required |
| Permission, privacy, evidence, and human-review language | FR-102, FR-103, FR-501, FR-502, FR-701, FR-801, FR-802, FR-1001; NFR-SEC-001, NFR-PRIV-001, NFR-PRIV-002 | Role/privacy expression and prohibited patterns | Proposed; security review required per workflow |

## Stage 2 information-architecture traceability

| IA obligation | Source requirements/workflows | Evidence | Status |
|---|---|---|---|
| Separate internal and public trust/navigation boundaries | FR-101, FR-102, FR-701; CW-01, CW-02 | `/app/*` and `/public/*` route trees in `STAGE_2_INFORMATION_ARCHITECTURE.md` | Locked; implementation pending |
| Role-aware navigation with independent authorization | FR-102, FR-201, FR-401, FR-501, FR-502, FR-801, FR-802, FR-1101 | Internal navigation groups, role visibility matrix, and route guards | Locked; permission tests required |
| Safe public reporting and tracking | FR-701; NFR-SEC-005, NFR-PRIV-002 | Public route hierarchy and privacy boundaries | Locked; API/rate-limit tests required |
| Accessible and responsive navigation | Cross-cutting acceptance rules; NFR-A11Y-001 to NFR-A11Y-005 | Navigation behavior and verification contract | Locked; component/browser tests required |

## Stage 2 token and typography traceability

| Token obligation | Source requirement/NFR | Evidence | Status |
|---|---|---|---|
| Semantic state colors and non-color meaning | Cross-cutting state rules; NFR-A11Y-001, NFR-A11Y-003 | `tokens.css`, existing state text/structure, `tokens.test.ts` | Implemented; contextual contrast review continues |
| Keyboard focus and reduced motion | NFR-A11Y-001, NFR-A11Y-002 | Dual-contrast focus tokens and reduced-motion global rule | Implemented; browser review required |
| Responsive spacing, typography, breakpoints, and layout | NFR-A11Y-004, NFR-PERF-002 | Central type/layout tokens and 320 px/mobile/tablet foundations | Implemented; viewport review required |
| Dependency-free and operationally safe fonts | NFR-OPS-001, NFR-PERF-002, NFR-PRIV-002 | System font stack with no external request or package | Implemented |

## Stage 2 accessibility and responsive traceability

| Foundation obligation | Source requirement/NFR | Evidence | Status |
|---|---|---|---|
| Semantic state announcements and validation focus | Cross-cutting state rules; NFR-A11Y-001, NFR-A11Y-002 | `App.tsx`, 9 application/accessibility tests | Implemented |
| Keyboard-safe compact navigation and focus restoration | Information-architecture navigation contract; NFR-A11Y-001, NFR-A11Y-002 | `inert`, managed focus, Escape/scrim tests | Implemented |
| Contrast and user preferences | NFR-A11Y-001, NFR-A11Y-003 | 4.5:1 token tests, increased/forced contrast, reduced motion | Implemented; visual review pending |
| Tablet/mobile and coarse-input behavior | NFR-A11Y-002, NFR-A11Y-004 | 320 px/narrow/mobile/tablet CSS, overflow rules, 48 px coarse targets | Implemented; viewport review pending |

## Stage 2 form and action traceability

| Component obligation | Source requirement/NFR | Evidence | Status |
|---|---|---|---|
| Native labels, descriptions, errors, and keyboard behavior | Cross-cutting acceptance rules; NFR-A11Y-001, NFR-A11Y-002 | Shared field primitives and focused component tests | Implemented |
| Safe upload selection and explicit denied/error states | FR-102, FR-501, FR-701; NFR-SEC-001, NFR-SEC-004, NFR-PRIV-001 | `FileUploadField`, server-revalidation contract, upload-state tests | Client foundation implemented; API enforcement pending |
| Deliberate confirmation and focus restoration | Cross-cutting destructive-action rules; NFR-A11Y-001, NFR-A11Y-002 | Modal focus containment, Escape, busy-state, and restoration tests | Implemented |
| Responsive, contrast-aware shared actions | NFR-A11Y-001 to NFR-A11Y-004 | Tokenized CSS, narrow/coarse/forced-color rules and contract tests | Implemented; browser review pending |

## Stage 2 data and feedback traceability

| Component obligation | Source requirement/NFR | Evidence | Status |
|---|---|---|---|
| Scoped tables, filters, metrics, and pagination | FR-102, FR-301, FR-401, FR-501, FR-701, FR-1101; NFR-SEC-001, NFR-PERF-003 | Native table/filter/pagination contracts and 16 focused tests | Client foundation implemented; API scope enforcement pending |
| Explicit loading, empty, error, success, denied, and validation outcomes | Cross-cutting state rules; NFR-A11Y-001, NFR-A11Y-002, NFR-RES-003 | `ApplicationState`, `Alert`, table-state substitution, live-region tests | Implemented |
| Keyboard-safe dialogs and drawers | Cross-cutting action rules; NFR-A11Y-001, NFR-A11Y-002 | Modal naming, Tab containment, Escape, scroll lock, restoration tests | Implemented |
| Responsive and non-color data presentation | NFR-A11Y-001 to NFR-A11Y-004, NFR-PERF-002 | Text-bearing badges, focusable table region, tablet/mobile/coarse/forced-color CSS | Implemented; browser review pending |

## Stage 2 internal application shell traceability

| Shell obligation | Source requirement/NFR | Evidence | Status |
|---|---|---|---|
| Capability-informed internal navigation with independent authorization | FR-102, FR-103, FR-201, FR-401, FR-501, FR-801, FR-802, FR-1101; NFR-SEC-001 | `InternalAppShell` capability filtering, empty-group behavior, safe denied state, and focused tests | Client presentation implemented; authenticated API/route enforcement pending |
| Clear organization, role, route, and workspace context | FR-102, FR-201, FR-401; NFR-PRIV-001 | Display-ready synthetic context, breadcrumbs, current destination, workspace heading, and safe copy | Implemented without protected data; live context pending |
| Keyboard-safe responsive navigation and route focus | NFR-A11Y-001, NFR-A11Y-002, NFR-A11Y-004 | Inert closed sidebar, opening fallback focus, Escape/close/scrim restoration, and route-heading focus tests | Implemented; browser review pending |
| Explicit workspace loading, error, and permission-denied boundaries | Cross-cutting state rules; NFR-A11Y-001, NFR-RES-003 | Shared `ApplicationState` boundary and retry tests | Implemented; API error mapping pending |

## Stage 2 public portal shell traceability

| Public-shell obligation | Source requirement/NFR | Evidence | Status |
|---|---|---|---|
| Separate public trust, route, and navigation boundary | FR-701; NFR-SEC-001, NFR-PRIV-001, NFR-PRIV-002 | `/public` App branch, public-only shell landmarks/navigation, and public/internal isolation test | Shell implemented; router/API isolation pending |
| Safe reporting, tracking, privacy, help, and emergency language | FR-701; NFR-SEC-005, NFR-PRIV-002 | Approved public destinations, no-secret URL tests, privacy reminder, emergency limitation, and inactive-workflow copy | Implemented without submission behavior |
| Reviewed-language availability rather than fabricated localization | Public multilingual mission; NFR-A11Y-001 | English enabled, Twi disabled with accessible unavailable description, and language-choice tests | Foundation implemented; Twi translation/review pending |
| Mobile-first public navigation and complete page states | Cross-cutting state rules; NFR-A11Y-001 to NFR-A11Y-004, NFR-RES-003 | Inert compact navigation, focus restoration, title/focus tests, six public states, and responsive CSS contracts | Implemented; browser review pending |

## Stage 2 dashboard data architecture traceability

| Dashboard obligation | Source requirement/NFR | Evidence | Status |
|---|---|---|---|
| Server-scoped role dashboards and safe drill-downs | FR-101 to FR-103, FR-201, FR-401, FR-501, FR-701, FR-801, FR-802, FR-901, FR-1101; NFR-SEC-001 | Five allow-listed role contracts, exclusions, context invalidation, and negative-test obligations in `STAGE_2_DASHBOARD_DATA_ARCHITECTURE.md` | Contract locked; API enforcement pending |
| Truthful KPI, queue, workload, activity, health, and visualization data | FR-401, FR-501, FR-801, FR-901, FR-1001, FR-1101; NFR-PRIV-002, NFR-OPS-005 | Shared widget definitions, provenance, units, time windows, human-review language, and prohibited patterns | Contract locked; metric definitions pending |
| Bounded, fresh, resilient operational reads | NFR-PERF-001, NFR-PERF-004, NFR-PERF-006, NFR-RES-003, NFR-OPS-002 to NFR-OPS-005 | Freshness classes, partial/stale recovery, correlation IDs, bounded pagination, query/cache controls, and reconciliation tests | Contract locked; runtime measurement pending |
| Accessible, responsive, non-misleading presentation | NFR-A11Y-001 to NFR-A11Y-005, NFR-PERF-002 | Text summaries, table alternatives, non-color meaning, keyboard behavior, 320 px/zoom/preferences obligations, and visualization prohibitions | Contract locked; role-dashboard UI evidence pending |

## Stage 0 checkpoint traceability

| Quality gate area | Stage 0 evidence | Runtime status |
|---|---|---|
| Functionality and acceptance | Requirements, roles, workflows, and traceability documents | Runtime not yet applicable |
| Authorization and security | Permission model, threat controls, upload and AI governance | Runtime tests pending foundation |
| Data integrity and privacy | Data model, classification, custody, retention, and synthetic-data rules | Runtime tests pending foundation |
| UI/UX, accessibility, and responsive behavior | Cross-cutting requirements and NFR budgets | UI does not yet exist |
| Performance, resilience, and operations | 31 provisional budgets and recovery/operations evidence requirements | Measurement pending foundation |
| Academic evidence and documentation | `docs/ACADEMIC_EVIDENCE_BASELINE.md`, progress, changelog, decisions, risks, documentation status | Implementation evidence pending |
| Git safety and external control | Clean branch, exclusions, genuine docs only, external pack outside repository | Verified at checkpoint |
