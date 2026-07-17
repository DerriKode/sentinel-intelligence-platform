# Release 1 Non-Functional Requirements and Budgets

**Status:** Stage 0 provisional baseline  
**Date:** 2026-07-17  
**Measurement rule:** A target is achieved only when measured under the stated baseline and recorded as evidence.

## Measurement baseline and interpretation

These are provisional Release 1 targets for a controlled academic demonstration, not production-wide guarantees. Unless a test states otherwise, measurements use the approved Windows laptop, synthetic data, one worker, MySQL, a supported desktop browser, and 10 concurrent internal users plus 25 public-report sessions. Any target that fails is reported with workload, hardware, dataset size, and limitation; it is not silently relaxed.

## Security and privacy budgets

| ID | Target | Verification |
|---|---|---|
| NFR-SEC-001 | 100% of protected endpoint tests enforce the role, object, assignment, workflow, sensitivity, and organization matrix; zero known authorization bypasses at release gate | Automated permission matrix and denied-object tests |
| NFR-SEC-002 | Zero committed secrets, credentials, production exports, evidence, personal photographs, or biometric data | Secret scan, repository scan, and Git tree review |
| NFR-SEC-003 | Zero critical or high exploitable findings in the approved security checklist before a controlled demonstration | Dependency/configuration scan and documented triage |
| NFR-SEC-004 | Internal authentication sessions expire after 30 minutes of inactivity and 8 hours absolute; sensitive actions require re-authentication where configured | Session and sensitive-action tests |
| NFR-SEC-005 | Public report submission is rate-limited to 10 requests per IP per hour; failed internal authentication is limited to 5 attempts per account and IP within 15 minutes | Rate-limit integration tests and audit evidence |
| NFR-SEC-006 | Uploads accept only approved media types, reject executable content, enforce configured size limits, and create a hash before protected storage | Malformed, oversized, type-confusion, malware-test, and hash tests |
| NFR-PRIV-001 | Development and demonstration contain only synthetic, licensed, or explicitly consented data; no real sensitive workflow is enabled before retention and lawful-basis approval | Fixture inventory and preflight review |
| NFR-PRIV-002 | Logs and error responses contain zero secrets, raw biometric vectors, or unnecessary personal fields; sensitive fields are redacted | Log sampling and error-response tests |

## Performance and capacity budgets

| ID | Target | Verification |
|---|---|---|
| NFR-PERF-001 | API reads achieve p95 <= 500 ms and p99 <= 1,500 ms; API writes achieve p95 <= 750 ms and p99 <= 2,000 ms under the measurement baseline | Reproducible load test with endpoint breakdown |
| NFR-PERF-002 | Initial authenticated application load is p95 <= 4 seconds and common post-load interactions are p95 <= 2 seconds, excluding deliberate media processing | Browser performance trace on supported hardware |
| NFR-PERF-003 | Public report submission acknowledges valid input within p95 <= 2 seconds and never blocks on AI processing | Public-portal integration test |
| NFR-PERF-004 | Default list pages return 25 records, never exceed 100 without explicit pagination, and achieve p95 <= 500 ms for indexed queries | Pagination and query-plan test with 10,000 cases and 50,000 people |
| NFR-PERF-005 | Approved media jobs wait in the queue p95 <= 10 seconds under one-worker demo load; a controlled <=30-second, <=720p video job completes or fails visibly within 120 seconds | Worker queue and timeout test on the approved laptop |
| NFR-PERF-006 | No query used by a critical workflow performs an unbounded full-table scan at the stated fixture size without a documented exception and index plan | Query plan review and critical workflow load test |
| NFR-PERF-007 | Upload limits are 50 MB per still image and 250 MB per uploaded video for Release 1; rejected limits return a safe actionable error | Upload boundary tests |

## Resilience and recovery budgets

| ID | Target | Verification |
|---|---|---|
| NFR-RES-001 | Scheduled backups run at least daily; provisional RPO is <= 24 hours and provisional RTO is <= 4 hours for the controlled deployment | Backup schedule, restore stopwatch, and integrity report |
| NFR-RES-002 | A worker retries a transient job no more than 3 times with backoff, remains idempotent, and surfaces permanent failure without duplicating alerts, custody events, or audit records | Failure injection and duplicate-detection test |
| NFR-RES-003 | A database, storage, or worker failure produces a visible degraded state and preserves already committed case, evidence, custody, and audit data | Component failure scenario |
| NFR-RES-004 | Restore verification confirms record counts, SHA-256 evidence hashes, custody sequence, audit continuity, and permission behavior before a restored environment is accepted | Isolated restore checklist |
| NFR-RES-005 | Backup, restore, job failure, authorization failure, and integrity failure events are auditable with actor or system identity, time, outcome, and correlation ID | Audit reconstruction test |

## Accessibility, browser, and responsive budgets

| ID | Target | Verification |
|---|---|---|
| NFR-A11Y-001 | Critical workflows meet practical WCAG 2.2 AA alignment: semantic structure, labels, keyboard navigation, visible focus, accessible validation, contrast, tables, dialogs, notifications, and reduced-motion consideration | Manual keyboard/screen-reader review plus automated scan |
| NFR-A11Y-002 | 100% of critical workflow actions are operable by keyboard; zero critical accessibility violations and no blocked focus path | Keyboard test record and accessibility scan |
| NFR-A11Y-003 | Normal text contrast is at least 4.5:1 and large text/UI focus indicators meet the applicable AA contrast target | Contrast inspection |
| NFR-A11Y-004 | Public and internal critical pages remain usable from 320 px through 1,440 px viewport width without horizontal clipping of primary actions | Responsive viewport checks |
| NFR-A11Y-005 | Release 1 supports the latest two stable versions of Chrome, Edge, and Firefox on desktop; unsupported browsers receive a clear limitation | Browser compatibility smoke matrix |

## Operations and observability budgets

| ID | Target | Verification |
|---|---|---|
| NFR-OPS-001 | A clean supported environment can follow the documented setup and reach a verified health state within 60 minutes, excluding optional model downloads | Timed setup run using the repository documentation |
| NFR-OPS-002 | 100% of API requests, background jobs, alerts, backups, and security events carry a correlation ID; logs are structured and contain no prohibited sensitive fields | Log schema and sampled-event test |
| NFR-OPS-003 | Health/readiness checks respond within 5 seconds and distinguish unavailable database, worker, storage, and application states | Health endpoint and failure-state tests |
| NFR-OPS-004 | Every critical workflow has a documented runbook for normal operation, failure, recovery, and escalation before demonstration | Runbook review against CW-01 through CW-08 |
| NFR-OPS-005 | Queue depth, failed jobs, authentication failures, authorization denials, storage errors, backup results, and integrity failures are observable in permitted operational reporting | Monitoring/reporting verification |
| NFR-OPS-006 | Initial supported capacity is 10 concurrent internal users, 25 concurrent public-report sessions, 10,000 cases, 50,000 people, 100,000 audit events, and one media worker; higher capacity requires measured evidence and an approved capacity plan | Controlled capacity test and documented scaling assumption |

## Data retention defaults pending policy approval

These are temporary development/demo defaults only and do not authorize real sensitive data:

- synthetic uploaded media and derived artifacts: purge after 30 days;
- worker and application logs: retain 30 days;
- audit and custody records: retain 365 days in the demo environment;
- backups: retain 30 days with at least the latest 7 daily copies where storage permits.

Production retention, deletion, legal hold, data residency, and biometric retention require legal, institutional, privacy, security, and operational approval.

## Budget acceptance and change control

Each target must link to a test result, workload, environment, and evidence location. A failed target becomes a documented limitation or a change-control item; it is not silently changed. Numeric targets may be revised only through an approved decision record that states the reason, affected requirements, risk, and replacement measurement.
