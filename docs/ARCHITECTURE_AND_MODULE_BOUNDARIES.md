# Release 1 Architecture and Module Boundaries

**Status:** Stage 0 architecture baseline  
**Date:** 2026-07-17  
**Decision:** Approved modular monolith with separately scalable background workers

## 1. Locked architecture

| Concern | Locked decision | Boundary |
|---|---|---|
| Web clients | React + TypeScript + Vite internal portal and separate public portal | Browsers call the API; they never connect directly to databases, queues, storage, or AI providers |
| Application | Django + Django REST Framework modular monolith | Modules own models, services, permissions, APIs, tests, and documentation |
| Structured data | MySQL is the authoritative database | No second authoritative database; schema changes require migrations and review |
| Background processing | Redis + Celery workers | Jobs are authenticated, idempotent, observable, and never grant user authority |
| Media | Protected local development storage with an S3-compatible production abstraction | Large media stays outside MySQL; metadata, hashes, custody, and access policy remain in MySQL |
| AI | Isolated, replaceable provider interface | Providers return candidate results and metadata only; human review owns decisions |
| Operations | Reverse proxy, application server, MySQL, Redis, workers, protected storage, TLS, monitoring, backups, and rollback in the production direction | Production deployment remains outside Release 1 unless separately approved |

Microservices are not part of Release 1. A separate service requires an approved architecture decision showing a boundary, operational owner, data contract, security model, and measured need.

## 2. Request and trust-boundary flow

1. An internal or public browser sends a validated HTTPS request to the appropriate portal/API boundary.
2. Django authenticates and authorizes the request against organization, unit, assignment, workflow, responsibility, and sensitivity rules.
3. Domain services read or write MySQL records and append required audit events.
4. Uploads are validated, safely named, hashed, stored through the protected media abstraction, and linked to metadata.
5. Approved media jobs enter Redis/Celery with an idempotency key and minimum necessary data.
6. A worker invokes the AI provider adapter, stores provenance and candidate output, and emits an observable result.
7. An authorized human reviews the candidate; alerts and notifications use the recorded human disposition.
8. Reports and audit views apply the same authorization boundaries as the underlying records.

No browser, worker, provider, or report bypasses the domain authorization layer.

## 3. Module ownership

| Module | Owns | May depend on | Must not own or bypass |
|---|---|---|---|
| accounts | Authentication identity, sessions, roles, and access state | organizations, audit | Case or evidence business rules |
| organizations | Organizations, units, memberships, and scope | accounts, audit | Cross-organization access |
| people | Person records and participant identity links | organizations, audit | Evidence bytes or candidate decisions |
| cases | Cases, assignments, tasks, notes, and workflow state | people, organizations, audit | Direct provider or storage access |
| evidence | Evidence metadata, files, hashes, custody, retention | cases, accounts, organizations, audit, storage adapter | Silent replacement, deletion, or unrestricted media access |
| missing_persons | Missing-person reports and related review workflow | people, cases, evidence, alerts | Automatic identity decisions |
| public_submissions | Public reports, sightings, tips, moderation, and escalation | cases, people, alerts, audit | Internal notes, biometric data, or staff-only records in public responses |
| media | Upload validation, media jobs, source metadata, and processing state | evidence, Redis/Celery, recognition adapter, audit | Human review outcomes or authorization bypass |
| recognition | Provider adapter, candidate scores, quality, provenance, and result state | media, people, missing_persons, audit | Guilt, arrest, or autonomous legal conclusions |
| alerts | Alert routing, acknowledgment, escalation, and closure | cases, recognition, public_submissions, accounts, audit | Irreversible action without authorized human workflow |
| assessments | Transparent lead factors and evidence assessment | cases, evidence, people, audit | Opaque probability-of-guilt output |
| audit | Append-oriented security, custody, workflow, and configuration events | all modules through explicit event contracts | Ordinary-user mutation or erasure |
| reporting | Authorized read models and operational reports | all modules through approved query/service contracts | New business truth or permission bypass |

Cross-module behavior uses explicit services or contracts. Shared global business logic and circular dependencies are prohibited.

## 4. Architecture validation gates

- Module tests prove ownership and negative dependency boundaries.
- API tests prove browsers cannot access protected storage, queues, providers, or MySQL directly.
- Authorization tests run at endpoint and object level for every module.
- Worker tests prove retries are idempotent and cannot finalize candidate decisions.
- Storage tests prove path traversal, unsafe names, missing hashes, and unauthorized retrieval fail safely.
- Architecture changes record the reason, affected trust boundary, migration plan, risk, and approval.
