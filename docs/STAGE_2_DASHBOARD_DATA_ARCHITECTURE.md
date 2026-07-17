# Stage 2 Dashboard Data Architecture

**Work package:** S2-09 — Define Dashboard Data Architecture
**Status:** Contract locked for role-dashboard implementation
**Date:** 2026-07-17

## Purpose and scope

This document defines the Release 1 information contract for the five internal role dashboards. It covers KPI, queue, workload, activity, dependency-health, and visualization data. It does not create an API endpoint, database table, cache, chart library, business metric, or new authorization rule.

The public reporter has no internal dashboard. Background workers and external providers have no interactive human dashboard.

## Locked decisions

1. A dashboard is an authorized read model, not a new source of business truth. Cases, evidence, public reports, candidate reviews, alerts, users, organizations, audit events, and operational health remain owned by their approved modules.
2. The reporting/query layer composes display-ready data from those authoritative modules. It may materialize a measured aggregate later, but it must retain source lineage and may not weaken source-module permissions or workflow rules.
3. Every request is evaluated using the authenticated actor, active organization and unit, active role, capabilities, assignments, workflow responsibility, record sensitivity, and explicit authorization. The browser must never receive a broad result and hide unauthorized portions.
4. Dashboard visibility is not authorization. Every widget, total, row, drill-down target, and export must be independently server-scoped. A denied response must not disclose whether a hidden record or non-zero total exists.
5. Dashboard data supports human awareness and prioritization. It must not present guilt, arrest recommendations, autonomous case decisions, opaque risk scores, employee rankings, or candidate-match confirmation.

## Dashboard composition contract

The logical response is versioned independently of the UI. Exact endpoint names and transport schemas remain an API-design decision.

| Field | Required meaning |
|---|---|
| `schema_version` | Stable contract version used to reject unsupported response shapes |
| `dashboard_key` | One allow-listed value: `administrator`, `supervisor`, `investigator`, `evidence-officer`, or `auditor` |
| `generated_at` | Server timestamp for response composition |
| `data_as_of` | Oldest material source timestamp represented by the response |
| `timezone` | Time zone used for date boundaries and display |
| `context` | Display-safe organization, unit, role, and assignment-scope summary; identifiers are opaque |
| `overall_state` | `ready`, `empty`, `partial`, `stale`, or `unavailable` |
| `freshness` | Declared data class, target, last successful refresh, and stale state |
| `partial_failures` | Safe component identifiers and recovery guidance without exception details |
| `correlation_id` | Non-secret support identifier matching server telemetry |
| `widgets` | Only widgets authorized for the active context |

The server returns a deterministic widget order. Unknown widget kinds or unsupported schema versions fail safely. Context changes invalidate the prior response, pending requests, client state, and scoped caches before the new dashboard is shown.

## Shared widget obligations

Every widget declares:

- a stable, non-sensitive identifier, type, title, and plain-language purpose;
- source module, scope statement, generated/as-of timestamps, freshness state, and time window;
- units, definitions, filter state, and threshold or status basis where applicable;
- permitted actions and an authorized opaque drill-down destination, if one exists;
- explicit loading, empty, partial, stale, unavailable, and permission-denied behavior;
- an accessible text summary and non-color status label.

The UI must never substitute `0` for unavailable, denied, stale, or failed data. A trend is optional and requires a declared comparison period, baseline, direction, units, and neutral interpretation. “Up” or “down” is not inherently good or bad.

### KPI contract

A KPI is a scoped count, duration, rate, or status backed by an approved definition. It includes value, unit, numerator/denominator when a rate is shown, source, time window, and comparison basis. Counts must be calculated inside the same authorization scope as their drill-down records. Rounded, estimated, suppressed, or delayed values must be labelled.

### Queue contract

A queue represents work requiring an authorized human action. It includes queue definition, total within scope, ordering basis, bounded page size, opaque cursor, and minimal display-safe rows. A row may expose only its opaque key, safe label, workflow state, priority basis, due time, display-safe owner or assignment, and authorized action target. Priority is explainable workflow metadata, not an inferred personal-risk score.

### Workload contract

Workload summarizes assignment volume and age bands for operational balancing. It declares included work states, time window, unassigned handling, and capacity caveats. It must not rank staff, infer productivity, expose private personnel information, or compare individuals using an unexplained score. Investigator views show only the current actor’s workload; supervisor team views require supervisory scope.

### Activity contract

Activity is a bounded, reverse-chronological projection of append-oriented events. Each item contains a display-safe actor label, action, object type, outcome, timestamp, and authorized destination. It does not replace the authoritative audit log and does not expose secrets, raw request bodies, hidden identifiers, or inaccessible object existence.

### Health contract

Health communicates user-relevant service readiness. It includes component class, `healthy`, `degraded`, `unavailable`, or `unknown` status, last check, operational impact, and safe recovery guidance. It must not expose hostnames, ports, credentials, stack traces, database names, queue payloads, storage paths, or infrastructure topology. Detailed diagnostics remain restricted operations evidence.

### Visualization contract

A visualization is permitted only when it answers a stated operational question better than text or a table. It includes title, question, source, scope, time window, as-of time, units, legend, and an equivalent accessible table or list.

Permitted forms include honest time series, bounded horizontal comparisons, and composition views where every category remains readable. Prohibited forms include 3D charts, decorative gauges, misleading truncated axes, unexplained heat maps, animated meaning, guilt/risk scoring, low-count sensitive-cohort disclosure, and charts that rely on color alone. Mobile layouts provide a readable summary and table without page-level horizontal clipping.

## Role dashboard contracts

### System administrator

**Purpose:** maintain safe access, configuration, and operational readiness without exposing operational case content.

- **KPIs:** active organizations/units/users within administrative scope; pending access reviews; failed background jobs; latest backup and restore-verification status.
- **Queues:** user/access administration, configuration review, failed-job recovery, backup/recovery follow-up.
- **Workload:** administrative backlog by safe category and age band, not case workload or staff ranking.
- **Activity:** access, role, configuration, retention-policy, backup, and restore events.
- **Health:** abstract application, database, worker/queue, and protected-storage readiness.
- **Excluded by default:** case narratives, evidence content, public-report details, candidate results, and audit-only data unless separately and explicitly authorized.

### Supervisor

**Purpose:** coordinate work and approve controlled transitions within the active organization, unit, and supervisory assignment.

- **KPIs:** scoped open/assigned cases, overdue tasks, unassigned eligible work, moderation backlog, actionable alerts, and candidate reviews awaiting authorized human disposition.
- **Queues:** assignment, escalation, transition approval, public-submission moderation, alert handling, and candidate-review oversight.
- **Workload:** team assignment distribution and age bands with unassigned work visible; no productivity league table or inferred performance score.
- **Activity:** scoped assignments, escalations, approvals, alert state changes, and workflow transitions.
- **Health:** only service degradation that affects supervised workflows, with safe impact language.
- **Excluded:** other organizations, teams outside supervisory scope, unrelated evidence content, and infrastructure diagnostics.

### Investigator/officer

**Purpose:** focus the current actor on authorized assigned work.

- **KPIs:** the actor’s active assigned cases, tasks due/overdue, assigned public submissions, candidate reviews awaiting that actor, and actionable alerts.
- **Queues:** assigned case tasks, reports requiring review, candidate-review actions, alerts, and assessment follow-up.
- **Workload:** the current actor’s own work by state and age; no peer comparison.
- **Activity:** recent events on the actor’s assigned and otherwise explicitly authorized records.
- **Health:** workflow availability and submission state, not infrastructure detail.
- **Excluded:** unassigned work not eligible for claim, peer workload, cross-organization records, and confirmed-match language before human disposition.

### Evidence officer

**Purpose:** protect evidence intake, integrity, custody, retrieval, and storage operations.

- **KPIs:** pending intake, custody transfers requiring action, integrity/hash exceptions, authorized retrieval requests, and storage readiness.
- **Queues:** intake verification, custody acceptance/transfer, integrity exception review, retrieval, and retention actions where explicitly authorized.
- **Workload:** evidence operations by state and age band within evidence/case responsibility.
- **Activity:** custody, integrity, retrieval, and authorized retention events.
- **Health:** protected-storage and integrity-check readiness expressed without infrastructure secrets.
- **Excluded:** unrelated case narratives, public-report content, candidate details, and evidence outside assigned responsibility.

### Auditor

**Purpose:** review authorized security, custody, integrity, restoration, and governance evidence without mutation.

- **KPIs:** scoped authorization denials, custody/integrity exceptions, backup/restore verification, and configuration/security change volumes.
- **Queues:** read-only review sets for audit exceptions and evidence packages; no workflow mutation action.
- **Workload:** review inventory by evidence class and age, not operational staff productivity.
- **Activity:** authorized audit, custody, integrity, access, configuration, and restoration events.
- **Health:** verification evidence and service-control outcomes allowed by audit scope.
- **Excluded:** mutation controls, unapproved content fields, and aggregates that reveal inaccessible cases, people, reports, or organizations.

## Freshness, failure, and recovery

Each widget declares one freshness class:

- `request-time` for transactional queues and actions expected to reflect committed current state;
- `near-current` for asynchronously refreshed operational summaries;
- `scheduled-snapshot` for measured aggregates;
- `historical` for an explicit closed reporting window.

Target refresh and stale-after intervals are deployment/configuration decisions and must be measured before being claimed. Health uses the last successful check, not the page-load time. Historical values display the full window and time zone.

A failed widget does not erase successful widgets. The dashboard becomes `partial`, identifies the affected component generically, preserves committed information with its last-success timestamp, and offers a safe retry. Stale data is visibly labelled and cannot enable a mutation or unsafe drill-down. A full authorization failure replaces the dashboard with the generic permission-denied state.

## Query, cache, and pagination controls

- Source modules own metric definitions and object authorization; the reporting layer owns composition only.
- Query plans must be bounded, indexed, paginated, and measured against the API read budgets. Default list size is 25 and maximum size is 100.
- Any server cache key includes actor, organization, unit, active role, capabilities, assignment scope, filter, time window, and schema version. Permission, assignment, role, or context changes invalidate affected entries.
- Shared or client caches must not reuse protected results across actors or contexts. Protected dashboard responses use approved cache-control behavior.
- Background jobs may build snapshots but cannot expand scope. Each snapshot retains source window, generation time, job outcome, and definition version.
- Aggregate-to-detail reconciliation tests prove that an authorized total matches its authorized rows for the same filter and window.

## Accessibility, responsive, and state contract

- Loading uses labelled busy structure without fabricated values.
- Empty states explain scope and filters without implying hidden records.
- Errors contain a correlation identifier and safe recovery action, never raw exceptions.
- Permission-denied and unavailable states do not confirm record or queue existence.
- Filters have labels, validation, a clear action, and keyboard-operable reset.
- Status, trend, and urgency always use text or symbols in addition to color.
- Tables and chart alternatives retain headings, captions, scope, source, and as-of information.
- Interactive charts, if later approved, expose keyboard access and equivalent text; non-interactive charts are not inserted into the tab order.
- Layouts remain usable from 320 px through desktop widths, at 200% zoom, with reduced motion, forced colors, and coarse input.

## Verification contract

Implementation is not complete until tests demonstrate:

1. the five dashboard keys return only allow-listed widgets and fields;
2. cross-organization, cross-unit, cross-assignment, role, sensitivity, and workflow denials, including totals and drill-downs;
3. context switching, permission changes, in-flight cancellation, and cache invalidation;
4. aggregate/detail reconciliation, bounded pagination, stable ordering, query-plan review, and NFR performance measurement;
5. request-time, stale, partial, dependency-outage, retry, empty, and unknown-schema behavior;
6. source, definition, units, time window, time zone, as-of, trend baseline, and suppression labels;
7. read-only auditor behavior and absence of hidden mutation controls;
8. candidate-only terminology, provenance, uncertainty, and mandatory human-review ownership;
9. no secrets, raw biometrics, sensitive narratives, infrastructure details, or protected identifiers in payloads, URLs, logs, errors, or telemetry;
10. semantic landmarks, screen-reader summaries, keyboard filters/drill-downs, non-color meaning, accessible table alternatives, 320 px layouts, zoom, reduced motion, and forced colors.

## Unresolved implementation decisions

The following remain open for their directly relevant work packages:

- endpoint paths, serialized field names, transport error schema, and API versioning;
- approved KPI formulas, owners, thresholds, comparison periods, and definition-version process;
- refresh intervals, stale-after limits, polling strategy, and cache technology;
- reporting time zone, day-boundary policy, and locale formatting;
- privacy suppression/rounding rules for low-count cohorts;
- exact health detail available to each role;
- export formats and additional authorization for exports;
- whether any visualization justifies a chart dependency.

These decisions may refine implementation but may not weaken the authorization, provenance, human-review, privacy, accessibility, or truthful-state rules above.

## Next work package

`prompts/03_stage2_ui_ux/S2-10_BUILD_ADMINISTRATOR_DASHBOARD.md`
