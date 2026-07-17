# Release 1 Functional Requirements and Role Acceptance

**Status:** Stage 0 requirements baseline  
**Date:** 2026-07-17  
**Scope:** Functional behavior and role-based acceptance; non-functional budgets are deferred to S0-04

## Requirement convention

Each requirement is testable through the stated acceptance condition. A requirement is not complete until the condition is demonstrated with authorized synthetic or approved data and an observable audit or response where specified.

## Functional requirements

| ID | Requirement | Role or system owner | Acceptance condition |
|---|---|---|---|
| FR-101 | The system shall authenticate users and establish an organization and role context before protected access. | All internal users | Given invalid or expired credentials, access is denied; given valid credentials, the session exposes only the approved organization and role context. |
| FR-102 | The system shall enforce deny-by-default role, object, assignment, workflow, sensitivity, and organization permissions on backend operations. | System administrator | Given a user outside the permitted boundary, the API denies access even when a protected URL or object identifier is known. |
| FR-103 | The system shall record authentication, authorization denial, sensitive access, and security-setting changes in an audit trail. | System administrator, auditor | Given each listed event, an actor, action, target, timestamp, outcome, and reason where applicable can be retrieved by an authorized auditor. |
| FR-201 | The system shall manage organizations, units, users, roles, assignments, and active/inactive access state. | System administrator | Given an organization and user, an administrator can assign permitted roles and scope; deactivation prevents new protected actions. |
| FR-301 | The system shall create and maintain person records for missing persons and case participants with type, status, source, and organization links. | Investigator, supervisor | Given valid required fields, a record receives a unique identifier and history; incomplete or unauthorized changes are rejected. |
| FR-401 | The system shall create, assign, update, and close cases with unique identifiers, organization scope, participants, tasks, notes, and status history. | Supervisor, investigator | Given an authorized assignment, a case can move only through allowed transitions and every transition identifies actor, time, and reason. |
| FR-501 | The system shall register evidence with metadata, case links, classification, uploader, hash, retention state, and custody events. | Evidence officer | Given an approved file or item, SHA-256 and custody records are created; a changed file fails integrity verification. |
| FR-502 | The system shall restrict evidence retrieval and prevent silent replacement or deletion of custody and audit history. | Evidence officer, auditor | Given a user without evidence permission, retrieval is denied; given a custody record, prior events remain visible and append-only where practical. |
| FR-601 | The system shall register and review missing-person reports, including identity data, last-seen details, source, status, and permitted media. | Investigator, supervisor | Given a valid report, the case link and status are visible to permitted staff; prohibited users cannot view sensitive details. |
| FR-701 | The public portal shall accept, validate, track, moderate, and escalate reports, sightings, and tips without exposing internal records. | Public reporter, supervisor | Given a public submission, the reporter receives a reference and permitted status; internal notes and biometric data are never returned to the public portal. |
| FR-801 | The system shall process approved still-image and uploaded-video jobs through an isolated provider interface and return candidate results with provenance and uncertainty. | Background worker, investigator | Given an authorized job, the result records source, provider, model/version, threshold, quality, score, timestamp, and processing outcome. |
| FR-802 | The system shall support only `confirmed`, `rejected`, and `inconclusive` candidate dispositions, each requiring an authorized human reviewer and reason. | Investigator, supervisor | Given a candidate, no final operational disposition is possible without an authorized reviewer, decision, reason, and timestamp. |
| FR-901 | The system shall create, route, acknowledge, update, and close alerts linked to candidate results, reports, or cases. | Supervisor, investigator | Given an alert trigger, the assigned recipients see a reversible alert state; every change records actor, time, reason, and related object. |
| FR-1001 | The system shall generate transparent investigative lead prioritization and evidence assessment from declared factors linked to available evidence. | Investigator, supervisor | Given an assessment, users can inspect factors, evidence links, uncertainty, provider/version if applicable, and author; output cannot be labelled as guilt or an arrest decision. |
| FR-1101 | The system shall provide authorized audit, case, evidence, alert, and operational reports with organization and sensitivity filtering. | Auditor, supervisor | Given a report request, results exclude unauthorized objects and identify source time range, filters, generated time, and requesting actor. |
| FR-1201 | The system shall support backup creation and a documented restore workflow that preserves structured records, evidence integrity, custody, and audit history. | System administrator, auditor | Given an approved test backup, restoration produces a usable isolated environment and integrity checks pass without losing custody or audit events. |

## Role-based acceptance criteria

| Role | Must be able to | Must not be able to | Acceptance test focus |
|---|---|---|---|
| System administrator | Manage organizations, users, roles, configuration, retention settings, and operational recovery | Rewrite evidence, erase audit history, or bypass review ownership | Create/deactivate a user; verify permission boundaries and immutable history |
| Supervisor | Assign work, approve sensitive actions, review escalations, and produce permitted reports | Access unrelated organizations or turn candidate output into an autonomous legal action | Approve a case/alert transition; verify scope and audit reason |
| Investigator / officer | Work assigned cases, participants, reports, media candidates, alerts, and assessments | View or change unassigned or cross-organization objects; finalize without human review authority | Complete CW-03, CW-05, CW-06, and CW-07 with denied-access tests |
| Evidence officer | Register evidence, verify hashes, record custody, and retrieve permitted media | Replace evidence silently, delete custody history, or alter audit events | Complete CW-04 with hash mismatch and restricted-retrieval tests |
| Auditor | Read permitted audit, custody, restoration, and report evidence | Mutate cases, evidence, candidate decisions, or audit records | Reconstruct a workflow from audit events and verify read-only behavior |
| Public reporter | Submit and track an own report, sighting, or tip | Access internal case data, staff notes, evidence, biometric results, or other reporters | Complete CW-02 and verify object isolation and safe error responses |
| Background worker / AI provider | Process approved jobs and return structured candidate results | Authenticate as a human, grant access, make a final decision, or change thresholds silently | Replay a versioned job and verify provenance, failure handling, and no user authority |

## Cross-cutting acceptance rules

- All protected endpoints enforce authorization independently of frontend visibility.
- Validation rejects malformed, incomplete, over-sized, unsupported, or unauthorized input without leaking sensitive details.
- Sensitive records and media are minimized, access-controlled, retained only under an approved policy, and never placed in source control.
- Internal pages and public pages provide loading, empty, error, success, denied, validation, keyboard-focus, responsive, and accessible states.
- Candidate matching uses `candidate match` or `potential match`, never proof, guilt, or automatic arrest language.
- Tests use synthetic, licensed, or explicitly consented data and record the scenario, actor, expected result, observed result, and evidence location.

## Bounded decisions for the next requirements work

The requirements baseline still needs approved values for role permissions, organization hierarchy, retention periods, candidate thresholds, evaluation datasets, alert escalation, and non-functional budgets. Those values are configuration and acceptance decisions, not permission to expand Release 1.
