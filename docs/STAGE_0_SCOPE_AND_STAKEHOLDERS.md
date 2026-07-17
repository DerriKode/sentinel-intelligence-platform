# Stage 0: Locked Release 1 Scope and Stakeholders

**Status:** Completed discovery decision checkpoint  
**Date:** 2026-07-17  
**Related review:** `docs/STAGE_0_ACADEMIC_REPORT_REVIEW.md`

## 1. Scope decision

Release 1 is a secure academic demonstration and controlled-pilot platform. It is not a national deployment, a police integration, or an autonomous decision system.

### Included capabilities

- One unified internal operations portal for authorized staff.
- One separate public reporting portal for reports, sightings, and tips.
- Organization-aware authentication, role-based access, case assignment, and audit.
- People, missing-person, case, participant, task, note, and status workflows.
- Evidence registration, protected media storage, SHA-256 hashing, custody events, retention state, and restricted retrieval.
- Still-image and uploaded-video candidate matching plus a controlled webcam demonstration.
- Mandatory human review with `confirmed`, `rejected`, and `inconclusive` outcomes.
- Alerts, notifications, transparent Investigative Lead Prioritisation, Evidence Assessment, reports, backup restoration, manuals, and academic evidence.

### Explicitly deferred

- National or production-wide deployment.
- Large-scale live CCTV or unrestricted camera ingestion.
- Official police, identity, or national database integrations.
- Native mobile applications and high-availability guarantees.
- Autonomous legal, arrest, guilt, or risk decisions.
- Opaque suspect prediction or probability-of-guilt scoring.
- Real sensitive operational data in development or demonstration.

## 2. Stakeholders and actors

| Stakeholder or actor | Release 1 responsibility | Permission boundary |
|---|---|---|
| System administrator | Manage users, organizations, configuration, and retention settings | Cannot rewrite evidence or audit history |
| Supervisor | Assign work, approve sensitive workflow actions, review escalations and reports | Organization and supervisory scope |
| Investigator / officer | Work assigned cases, manage participants, review candidate matches, and record decisions | Assigned case and organization scope |
| Evidence officer | Register evidence, manage custody, verify hashes, and control retrieval | Evidence and case scope; restricted media access |
| Auditor | Inspect audit events, custody history, reports, and restoration evidence | Read-only audit scope |
| Public reporter | Submit and track permitted public reports, sightings, and tips | Public portal only; no internal records or biometric access |
| Background worker / AI provider | Process approved media jobs and return candidate results | No user authority; isolated, versioned, observable provider |

Access is deny-by-default. Every sensitive action requires backend authentication, object-level authorization, organization boundaries, assignment/workflow checks, and an audit event. Frontend visibility alone is never a security control.

## 3. Assumptions locked for Release 1

1. Development and demonstration use synthetic, licensed, or explicitly consented data only.
2. MySQL is the authoritative structured-data store; large media is protected outside MySQL behind an abstraction.
3. The application is a modular monolith with separately scalable background workers, not microservices.
4. CPU-friendly processing, one video job at a time initially, configurable frame sampling, and reduced resolution are acceptable on the approved Windows laptop.
5. AI produces candidate matches and transparent factors only. An authorized human owns every final decision.
6. Every candidate result records provider, model, version, threshold, quality, source, reviewer, timestamp, decision, and reason where applicable.
7. Release 1 acceptance is based on reproducible controlled scenarios, not claims of general-world accuracy.
8. English is complete for Release 1 and Twi is demonstrated as the first secondary language.
9. Retention, deletion, lawful-basis, access, and data-residency rules must be approved before sensitive data workflows are enabled.

## 4. Critical workflows

| ID | Workflow | Required safety and acceptance result |
|---|---|---|
| CW-01 | Authenticate and select organization/work | Unauthorized users are denied; authorized users see only permitted work and an audit event is recorded |
| CW-02 | Submit, moderate, and triage a public report | Public data is isolated; moderation status, reporter access, escalation, and audit history are visible |
| CW-03 | Create and assign a case | Unique case identity, organization boundary, assignment, status transition, and audit trail are present |
| CW-04 | Register and transfer evidence | Metadata, hash, custody event, actor, timestamps, retention state, and restricted media retrieval are verifiable |
| CW-05 | Register a missing person and process approved media | Candidate results include provenance and uncertainty; no automatic identity or guilt claim is exposed |
| CW-06 | Human-review a candidate and manage an alert | Reviewer chooses `confirmed`, `rejected`, or `inconclusive`; decision reason and reversible alert state are recorded |
| CW-07 | Produce a transparent lead prioritization or evidence assessment | Factors link to evidence and uncertainty; output is decision support, not a legal or arrest recommendation |
| CW-08 | Audit, report, back up, and restore | Authorized audit/report access works; backup restoration is demonstrated without losing custody or audit integrity |

These workflows are the minimum end-to-end path for Release 1. A later requirements package must define detailed acceptance thresholds, screen states, API contracts, and test data for each workflow.

## 5. Cross-cutting quality commitments

- **Security:** secure authentication, least privilege, object permissions, organization isolation, secure uploads, audit, rate limits, and secret separation.
- **Privacy and data:** data minimization, lawful-basis and consent records where required, retention/deletion controls, protected media, no real operational data, and disclosed limitations.
- **UI/UX:** calm enterprise presentation; role-aware navigation; clear loading, empty, error, success, denied, validation, keyboard-focus, responsive, and accessible states.
- **Accessibility and language:** keyboard support, readable contrast and labels, English completion, and a planned Twi demonstration path.
- **Operations:** reproducible setup, observable workers, backup and restore, failure handling, monitoring, support documentation, and controlled deployment.
- **Evaluation:** accuracy and error rates under defined controlled conditions, latency, authorization, custody/hash integrity, usability, restoration, and critical workflow tests.

## 6. Decisions deferred to requirements and design

The scope is locked, but the following design decisions must be made before implementation of the affected workflow: exact role-permission matrix, organization hierarchy, retention periods, lawful-basis evidence, candidate thresholds and evaluation dataset, alert escalation rules, evidence storage provider, backup schedule, and measurable latency/usability targets.

These are bounded design decisions, not permission to expand Release 1. Any request for national deployment, live large-scale CCTV, official integrations, mobile applications, high availability, or autonomous legal decisions requires a separate approved scope change.

## Checkpoint result

Release 1 boundaries, stakeholders, actors, assumptions, and minimum critical workflows are locked for the next requirements stage. The next work package may refine testable requirements within this boundary; it must not begin implementation or expand scope silently.
