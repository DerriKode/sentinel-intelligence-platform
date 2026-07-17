# Release 1 Data Model and Governance Baseline

**Status:** Stage 0 logical data baseline  
**Date:** 2026-07-17  
**Authoritative store:** MySQL for structured records and protected metadata

## 1. Logical entity groups

| Group | Entities | Governing relationship |
|---|---|---|
| Identity and scope | Organization, Unit, User, Role, Membership, Assignment | Every protected record is scoped to an organization and, where applicable, unit and assignment |
| People and cases | Person, Case, Participant, Task, Note, StatusEvent | Cases link participants and work history; a person may participate in multiple permitted cases |
| Public reporting | PublicSubmission, Sighting, Tip, ModerationEvent, Escalation | Public input is isolated until an authorized moderation or escalation action links it to internal work |
| Evidence | EvidenceItem, MediaFile, EvidenceHash, CustodyEvent, RetentionState | Evidence belongs to a case, has immutable identity, and has append-oriented custody history |
| Missing persons | MissingPersonReport, LastSeenEvent, ReferenceMedia | Report links to a person/case and approved reference media without implying a candidate decision |
| Media and recognition | MediaJob, EnrollmentReference, Detection, CandidateMatch, HumanReview | A job produces provenance-rich candidate output; only a human review changes the operational disposition |
| Response and analysis | Alert, Notification, Assessment, AssessmentFactor | Alerts and assessments link to source records and retain actor, reason, and state history |
| Governance | AuditEvent, ConfigurationChange, ReportRun, BackupRecord, RestoreCheck | Security, custody, workflow, reporting, backup, and restore events are attributable and queryable |

## 2. Required relationships and constraints

- Organization and unit foreign keys are mandatory for internal records unless an explicitly approved global configuration record is used.
- Users require active membership and role scope before protected access; assignments narrow access further.
- Case participants require a case and organization link; participant type and source are validated enumerations.
- Evidence items require case link, classification, owner, hash, custody state, retention state, and source metadata before retrieval.
- A media file is never exposed by path alone; access resolves through an authorization and storage service.
- Candidate matches require source media, provider/model/version, threshold, quality, score, timestamp, and processing outcome.
- Human review requires an authorized reviewer, one of `confirmed`, `rejected`, or `inconclusive`, a reason, and timestamp.
- Alerts require a source, recipient scope, state, and history; state transitions are validated and reversible where practical.
- Assessments require declared factors and evidence links; the data model must not contain a probability-of-guilt field.
- Audit events capture actor or system identity, action, target, time, organization/unit, request or correlation ID, outcome, reason, and safe before/after values.
- Custody and audit history are append-only where practical; ordinary users cannot update or erase prior events.

## 3. Data classification and ownership

| Classification | Examples | Owner and control |
|---|---|---|
| Public | Approved public status and reference number | Public portal service; exclude internal notes and sensitive details |
| Internal | Case titles, assignments, workflow statuses, operational reports | Owning module; organization and role scope |
| Sensitive | Names, contact details, addresses, reports, case notes, evidence metadata | Owning operational role; least privilege, audit, retention, and minimization |
| Highly sensitive | Images, video, face references, embeddings, candidate results, custody, assessments | Explicit authorization, protected storage, access logging, approved retention, human review, and legal/institutional review |
| Secret | Passwords, tokens, private keys, connection credentials | Secret manager or environment only; never database content, logs, fixtures, or source control |

Synthetic data is the default. Field-level documentation must record type, purpose, required state, validation, sensitivity, ownership, index/constraint, retention, audit behavior, and a synthetic example.

## 4. Storage, retention, and lifecycle

- MySQL stores structured records, relationships, status, hashes, custody, audit, and protected metadata.
- Protected media stays behind the storage abstraction and is never committed to Git or returned through an unscoped URL.
- Development/demo defaults follow the approved provisional budgets: synthetic media 30 days, logs 30 days, audit/custody 365 days, backups 30 days.
- Production retention, deletion, legal hold, data residency, and biometric retention require separate legal, institutional, privacy, security, and operational approval.
- Deletion is a governed lifecycle action that records actor, reason, target, retention policy, and result; custody and audit history are not silently erased.
- Derived embeddings and candidate artifacts inherit source classification and retention unless an approved policy says otherwise.

## 5. Data-model validation gates

- Migration checks reject broken foreign keys, invalid states, unsafe nullability, and duplicate business identifiers.
- Tests cover organization leakage, assignment leakage, unauthorized media retrieval, hash mismatch, custody order, audit continuity, and retention behavior.
- Query/index plans cover critical list pages and the Stage 0 performance fixture before performance claims are made.
- Backup and restore checks compare record counts, hashes, custody sequence, audit continuity, and permission behavior.
