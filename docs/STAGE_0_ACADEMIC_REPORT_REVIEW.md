# Stage 0: Academic Report Review

**Status:** Completed discovery checkpoint  
**Date:** 2026-07-17  
**Scope:** Academic report and directly related blueprint documents only

## Source basis

The following sources were reviewed as external guidance and were not copied into this repository:

- `academic-report/Project_Report_2.pdf`, Chapters 1-3, especially objectives, scope, requirements, architecture, data model, and evaluation language.
- `blueprint/PROJECT_CHARTER.md`
- `blueprint/BLUEPRINT_V1.md`
- `blueprint/RELEASE_1_SCOPE.md`
- `blueprint/SUCCESS_CRITERIA.md`

The academic report is a proposal and design reference. The approved blueprint and release scope control implementation decisions where the sources conflict.

## 1. Extracted objectives

The report's objectives, normalized into testable product goals, are:

1. Support missing-person and person-record workflows with controlled facial candidate search.
2. Centralize cases, participants, evidence, activity history, and public reports.
3. Provide secure authentication, role-based access, organization boundaries, and auditability.
4. Support image and uploaded-video analysis through an isolated, replaceable AI provider layer.
5. Provide transparent investigative lead prioritization and evidence assessment, never an autonomous guilt or legal decision.
6. Reduce false identification through thresholds, repeated checks where appropriate, provenance, and mandatory human review.
7. Demonstrate alerts, reporting, multilingual operation, and critical workflows using synthetic or approved non-sensitive data.

The report's original language about identifying criminals and predicting suspects is treated as a research motivation, not as permission to make or expose those decisions automatically.

## 2. Actors and system boundaries

| Actor | Legitimate need | Boundary or control to confirm |
|---|---|---|
| Public reporter / civilian | Submit a report, sighting, or tip and receive permitted updates | Separate public portal; no internal case or biometric access |
| Investigator / officer | Work assigned cases, review candidates, manage participants and notes | Organization and object permissions; human disposition required |
| Evidence officer | Register, classify, hash, transfer, and retrieve evidence | Chain of custody and restricted media access |
| Supervisor | Assign work, review escalations, approve sensitive actions and reports | Approval and oversight permissions |
| Auditor | Inspect audit records and evidence history | Read-only, least-privilege access |
| System administrator | Manage users, organizations, configuration, and retention controls | No implied authority to alter evidence history |
| Background worker / AI provider | Process approved jobs and return candidate results | No direct user authority; versioned, observable, replaceable provider |
| Camera or upload source | Supply controlled image/video input | Release 1 uses still images, uploaded video, and controlled webcam demo |

The report uses a smaller actor set than the approved blueprint. A role-permission matrix and public/internal portal boundary remain required decisions.

## 3. Data concepts

- **Identity and person:** missing person, suspect candidate, victim, witness, complainant, and other participant records.
- **Case:** identifier, title, type, status, assignments, organization, timestamps, and related participants.
- **Public report:** reporter details, sighting or tip content, location, time, status, and moderation history.
- **Evidence:** file or physical item metadata, classification, case links, hashes, custody events, uploader, timestamps, and retention state.
- **Face reference and candidate result:** consent or lawful basis, reference media, provider/model version, embedding reference, match score, threshold, candidate status, reviewer, and review reason.
- **Detection and alert:** input source, capture time, location, snapshot reference, candidate result, alert state, reviewer disposition, and notification history.
- **Assessment and audit:** evidence-linked lead factors, uncertainty, explanation, actions, actor, before/after values, and immutable event time.
- **Organization and user:** account, role, organization scope, authentication state, and access events.

Names, contact details, addresses, images, video, biometric representations, case history, and investigative assessments are sensitive. Synthetic data is the default for development and demonstration.

## 4. Evaluation expectations

The report expects functional, accuracy, performance, security, usability, reliability, scalability, data-integrity, and scenario-based testing. The approved success criteria add reproducible setup, secure permissions, evidence hashing and custody, public separation, human-reviewed facial candidates, English completion, Twi demonstration, critical tests, backup restoration, documented limitations, and reliable demonstration.

The following must be made measurable before implementation:

- candidate-search precision, recall, false-positive and false-negative rates under controlled conditions;
- review turnaround and alert latency targets for approved demo scenarios;
- authorization tests for every role, organization, portal, case, evidence, and audit boundary;
- evidence hash and custody-integrity checks, retention and deletion checks, and backup-restore evidence;
- usability tasks for internal users and public reporters, including English and the planned Twi demonstration;
- reproducible synthetic scenarios with recorded dataset, model/provider version, threshold, hardware, and limitations.

## 5. Unsafe legacy assumptions and controls

| Legacy assumption found in the report | Risk | Required control |
|---|---|---|
| A facial match identifies a criminal or suspect | False positive can cause harm and unlawful action | Return a candidate only; require trained human review and record disposition |
| A confirmed match can automatically trigger an operational response | Automation bias and unreviewed escalation | Use a review gate, calibrated thresholds, provenance, and reversible alert states |
| A probability or rank represents guilt | Opaque or biased decision support | Use explainable lead prioritization linked to evidence; prohibit autonomous legal decisions |
| Live CCTV and near-real-time operation are baseline requirements | Scope, privacy, compute, and deployment risk | Release 1 is controlled webcam, still-image, and uploaded-video demonstration only |
| SQLite plus PostgreSQL is the required production data design | Duplicate sensitive sources of truth and migration risk | MySQL is the approved authoritative database; record an ADR before any deviation |
| Fixed 128-dimensional embeddings and local file paths are stable contracts | Model lock-in and insecure media handling | Use provider abstraction, model/version metadata, protected storage, and retention controls |
| Prior criminal history and broad personal fields can be collected by default | Excessive or unlawfully retained sensitive data | Minimize fields, establish lawful basis, restrict access, document provenance and deletion |
| High accuracy can be claimed without a defined dataset | Misleading evaluation and hidden subgroup harm | Publish dataset, metrics, threshold, uncertainty, limitations, and subgroup checks |

## 6. Unresolved decisions

1. Approve the role-permission matrix for administrators, supervisors, investigators, evidence officers, auditors, and public reporters.
2. Confirm the organization and case isolation model, including public-report moderation and escalation.
3. Confirm MySQL as the sole authoritative database and define whether any local processing cache may retain biometric data.
4. Define the human-review workflow, reviewer qualifications, escalation, appeal, and audit requirements for candidate results.
5. Set retention, deletion, access, consent or lawful-basis, and data-residency rules for biometric and investigative data.
6. Approve evaluation datasets and thresholds using synthetic or authorized data, with explicit false-positive and false-negative tolerances.
7. Define measurable latency, usability, backup-restore, and critical-workflow acceptance thresholds.
8. Confirm the Release 1 boundary: no national deployment, live large-scale CCTV, official police integrations, native mobile app, high availability, or autonomous legal decisions.

## 7. Traceability checkpoint

| Discovery output | Verification artifact to create next |
|---|---|
| Objectives and scope | Scope and stakeholder decision record |
| Actors and boundaries | Role-permission matrix and portal boundary tests |
| Data concepts | Data dictionary, classification, retention, and model design |
| Evaluation expectations | Evaluation plan, test cases, and acceptance thresholds |
| Unsafe assumptions | Human-review policy, threat model, limitations, and ADRs |

## Checkpoint result

The academic report has been reviewed and converted into implementation-safe objectives, actors, data concepts, measurable evaluation expectations, and explicit legacy-risk controls. No application source or dependency was created. The next work package must resolve scope and stakeholder decisions before implementation begins.
