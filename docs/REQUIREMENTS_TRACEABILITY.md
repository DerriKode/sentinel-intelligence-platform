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

Non-functional budgets, performance thresholds, and broader quality gates are intentionally deferred to S0-04. No requirement in this matrix authorizes autonomous legal decisions, unrestricted surveillance, real sensitive data, or scope expansion.
