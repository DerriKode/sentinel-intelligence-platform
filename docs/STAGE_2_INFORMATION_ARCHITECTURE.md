# Stage 2 Information Architecture and Route Map

**Work package:** S2-02 — Finalize Information Architecture
**Status:** Locked for Stage 2 implementation
**Date:** 2026-07-17
**Approved direction:** `docs/STAGE_2_DESIGN_DIRECTION.md`

## 1. Architecture decision

Sentinel has two deliberately separate navigation experiences:

1. **Internal operations portal** under the logical `/app/*` namespace for authenticated staff.
2. **Public reporting portal** under the logical `/public/*` namespace for reporters and members of the public.

The portals must use separate route trees, shells, navigation, authorization assumptions, and data contracts. A production deployment may map them to separate origins; exact hostnames remain an operations decision. Local development may serve both logical namespaces from the approved frontend foundation, but the public shell must never inherit internal navigation, session details, records, or error content.

Route visibility is a usability decision, not an authorization decision. Every protected route loader, API endpoint, query, object, mutation, export, and file retrieval must independently enforce authentication, organization/unit scope, assignment, role/capability, workflow state, responsibility, and sensitivity.

## 2. Global route rules

- URLs use stable nouns, lowercase kebab-case, and opaque identifiers: `/app/cases/:caseId`.
- Do not place names, email addresses, report narratives, tracking secrets, biometric values, evidence filenames, or other sensitive data in URLs, query strings, fragments, analytics labels, or document titles.
- Filters may use allow-listed non-sensitive query parameters such as `status`, `page`, `sort`, and date range; server authorization still scopes results.
- Unknown or unauthorized protected objects return the approved safe `404` or `403` behavior without confirming hidden records.
- Page refresh and deep links preserve only safe route state. Sensitive drafts and tracking credentials do not persist in URLs or browser storage by default.
- Breadcrumbs show the authorized hierarchy and human-readable labels after data is safely loaded; they never reveal inaccessible ancestors.
- Every major route defines loading, empty, error, success, permission-denied, validation, keyboard/focus, and responsive behavior.
- Route titles follow `Page — Sentinel Intelligence Platform` internally and `Page — Sentinel Public Reporting` publicly; sensitive record names are excluded from browser titles.

## 3. Internal navigation model

The internal shell presents a compact primary navigation grouped by user intent. Groups with no visible destinations are omitted. The active organization/unit and role context remain visible in the shell; context changes require reloading permissions and route availability.

| Group | Destination | Canonical route | Purpose |
|---|---|---|---|
| Home | Role dashboard | `/app` | Redirect to the authorized dashboard and show assigned work, review queues, and operational notices. |
| Work | Cases | `/app/cases` | Search, filter, create where authorized, and open scoped case work. |
| Work | People | `/app/people` | Find and manage permitted person records and case participation. |
| Work | Missing persons | `/app/missing-persons` | Register, review, and manage missing-person workflows. |
| Work | Public submissions | `/app/public-submissions` | Moderate and escalate reports, sightings, and tips without exposing internal data publicly. |
| Evidence and review | Evidence | `/app/evidence` | Register, retrieve, verify, transfer, and audit permitted evidence. |
| Evidence and review | Candidate reviews | `/app/candidate-reviews` | Review candidate results with provenance, uncertainty, and mandatory human disposition. |
| Evidence and review | Alerts | `/app/alerts` | Acknowledge, route, update, and close reversible alerts. |
| Evidence and review | Assessments | `/app/assessments` | Review transparent lead factors and evidence links without guilt or arrest conclusions. |
| Oversight | Reports | `/app/reports` | Generate authorized, scoped operational and academic reports. |
| Oversight | Audit | `/app/audit` | Inspect permitted security, workflow, custody, and recovery events. |
| Administration | Organizations | `/app/admin/organizations` | Manage organizations and units within administrative authority. |
| Administration | Users and access | `/app/admin/access` | Manage users, memberships, roles, activation state, and approved access. |
| Administration | Configuration | `/app/admin/configuration` | Manage approved non-secret settings, retention defaults, and controlled feature configuration. |
| Administration | Operations | `/app/admin/operations` | View health, jobs, backups, and recovery status without exposing credentials. |
| Support | Help and accessibility | `/app/help` | Provide workflow help, keyboard guidance, accessibility support, and safe escalation paths. |

## 4. Internal route hierarchy

```text
/app
├── dashboard/:dashboardKey
├── cases
│   ├── new
│   └── :caseId
│       ├── overview
│       ├── people
│       ├── tasks
│       ├── notes
│       ├── evidence
│       ├── candidate-reviews
│       ├── alerts
│       ├── assessments
│       └── activity
├── people
│   └── :personId
├── missing-persons
│   ├── new
│   └── :missingPersonId
├── public-submissions
│   └── :submissionId
├── evidence
│   ├── register
│   └── :evidenceId
│       ├── overview
│       ├── custody
│       ├── integrity
│       └── access-history
├── candidate-reviews
│   └── :candidateId
├── alerts
│   └── :alertId
├── assessments
│   └── :assessmentId
├── reports
│   └── :reportKey
├── audit
│   └── :eventId
├── admin
│   ├── organizations
│   ├── access
│   ├── configuration
│   └── operations
├── help
└── access-denied
```

Detail tabs are contextual child routes, not duplicate top-level navigation. A route appears only when the current user has a plausible capability, but the server makes the final decision for every request. `dashboardKey` is allow-listed to `administrator`, `supervisor`, `investigator`, `evidence-officer`, or `auditor`; arbitrary values are rejected.

## 5. Role visibility matrix

Legend: **Manage** = create/update within authorized scope; **Work** = perform assigned workflow actions; **Read** = permitted read-only view; **Context** = limited related information needed for the role; **—** = hidden from primary navigation. These labels do not grant permission.

| Destination | Administrator | Supervisor | Investigator | Evidence officer | Auditor |
|---|---|---|---|---|---|
| Role dashboard | Manage | Work | Work | Work | Read |
| Cases | Context | Manage | Work | Context | Read |
| People | Context | Manage | Work | Context | Read |
| Missing persons | Context | Manage | Work | Context | Read |
| Public submissions | Context | Manage | Work when assigned | — | Read |
| Evidence | Context | Read/approve where authorized | Context | Manage | Read |
| Candidate reviews | — | Manage/review | Work/review | Context | Read |
| Alerts | Context | Manage | Work | — | Read |
| Assessments | — | Manage/review | Work | — | Read |
| Reports | Operations only | Manage | Scoped read | Evidence reports | Read |
| Audit | Security/configuration scope | Scoped read | Own-action context | Custody context | Read |
| Organizations | Manage | Scoped read | — | — | Read |
| Users and access | Manage | Scoped assignment view | — | — | Read |
| Configuration | Manage approved settings | — | — | — | Read |
| Operations | Manage recovery operations | Operational status | — | Storage/integrity status | Read |

Background workers and AI providers have no human navigation, dashboard, or interactive route. A person with multiple approved memberships sees the union of navigation capabilities for the active context, while backend authorization remains the intersection of all applicable constraints. Switching context must invalidate stale route data and return the user to an authorized landing route.

## 6. Internal route guards and outcomes

| Condition | Required outcome |
|---|---|
| Not authenticated | Redirect to `/auth/sign-in` with only an allow-listed relative return path. |
| Authenticated but no active context | Redirect to `/auth/select-context`; expose no operational records. |
| Route capability absent | Omit the navigation item; direct access resolves to the safe denied/not-found policy. |
| Object outside scope | API denies access; UI shows a generic safe state without object details. |
| Session expired | Preserve only a safe return path and non-sensitive draft state; require sign-in or re-authentication. |
| Sensitive action requires re-authentication | Route to `/auth/re-authenticate`, then return only if authorization still succeeds. |
| Service degradation | Show the affected capability and recovery guidance; do not represent stale or partial data as current. |

Authentication support routes are `/auth/sign-in`, `/auth/select-context`, `/auth/re-authenticate`, and `/auth/signed-out`. These routes are outside the operational navigation shell.

## 7. Public navigation and route hierarchy

The public portal has no internal sidebar, staff role indicators, operational record search, candidate results, evidence access, or internal case navigation. Its top-level navigation is limited to **Report**, **Track a submission**, **Safety and privacy**, **Help**, and language selection when translations are available.

```text
/public
├── report
│   ├── missing-person
│   ├── sighting
│   └── tip
├── submission-received
├── track
├── status
├── privacy
├── accessibility
├── help
└── service-unavailable
```

| Route | Public behavior and privacy boundary |
|---|---|
| `/public` | Explain the service, emergencies limitation, available report types, privacy summary, and safe next actions. |
| `/public/report/missing-person` | Collect the minimum approved fields and media for a missing-person report. |
| `/public/report/sighting` | Collect a sighting linked by safe reference where available; never expose an internal case record. |
| `/public/report/tip` | Accept a tip with clear consent/privacy language and moderation expectations. |
| `/public/submission-received` | Show a one-time safe confirmation and reference after server acceptance; do not put the reference or secret in the URL. |
| `/public/track` | Accept a reference plus approved tracking secret using a POST-backed lookup; apply rate limits and safe errors. |
| `/public/status` | Show only the allow-listed public status for the verified reporter session; no internal notes, assignments, evidence, candidate data, or staff identity. |
| `/public/privacy` | Explain purpose, data use, retention, consent/lawful-basis boundaries, and contact routes. |
| `/public/accessibility` | State accessibility support, keyboard use, known limitations, and assistance options. |
| `/public/help` | Explain reporting, tracking, emergencies limitation, and safe escalation. |

Public routes must not confirm whether a person, case, candidate, report, or staff account exists. Tracking state expires and is cleared on sign-out/timeout; tracking secrets are never stored in local storage or analytics.

## 8. Navigation behavior and accessibility

- Desktop internal navigation may remain persistent; tablet/mobile uses the approved accessible drawer. Public navigation remains shallow and task-led.
- Navigation landmarks have unique accessible names. The current route uses `aria-current="page"`; expanded groups expose state programmatically.
- Opening a mobile drawer moves focus to its first meaningful control; Escape closes it and focus returns to the trigger.
- Route changes move focus to the page heading or main landmark and announce the new page title without excessive live-region output.
- Breadcrumbs are ordered lists and collapse safely on narrow screens; the current page is not a redundant link.
- Unsaved changes require an accessible confirmation before an in-app route change or browser exit where feasible.
- Error, denied, and not-found pages retain a safe route back to an authorized landing page.

## 9. Verification contract

Implementation must include:

1. route-tree tests for every canonical route and unknown-route fallback;
2. role/capability navigation tests for each matrix row, including multi-role context changes;
3. direct-route negative tests proving hidden navigation does not grant or replace API authorization;
4. public/internal isolation tests, safe tracking tests, and checks that sensitive values never enter URLs or public responses;
5. keyboard, focus restoration, responsive drawer, breadcrumbs, page-title, loading/error/denied, and 320 px-to-desktop checks.

## 10. Bounded unresolved decisions

The following are intentionally deferred because they require later approved implementation or operations work:

- production hostnames and whether portal origins are deployed separately;
- authentication provider and final session/return-path mechanics;
- exact capability identifiers and multi-role context-switching policy;
- localized URL strategy for English and Twi;
- final report catalog, operational health detail, and route-level audit event taxonomy.

These decisions may refine implementation but must preserve the route boundaries, public/internal isolation, safe URL rules, and deny-by-default model in this document.

## 11. Completion

The information architecture, route hierarchy, navigation groups, role visibility, safe route outcomes, and verification obligations are locked for the next Stage 2 work package.

Exact next external prompt:

`prompts/03_stage2_ui_ux/S2-03_IMPLEMENT_DESIGN_TOKENS_AND_TYPOGRAPHY.md`
