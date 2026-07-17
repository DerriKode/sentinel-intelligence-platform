# Release 1 Security, Role, Threat, and AI Governance

**Status:** Stage 0 governance baseline  
**Date:** 2026-07-17  
**Principles:** deny by default, least privilege, human authority, evidence integrity, privacy by design

## 1. Permission model

Effective access is the intersection of role, organization, unit, assignment, workflow state, responsibility, sensitivity, and explicit authorization. Frontend controls improve usability but never replace backend endpoint and object permissions.

| Role | Allowed authority | Explicit prohibition |
|---|---|---|
| System administrator | Manage identity, organizations, configuration, retention settings, and recovery operations | Cannot rewrite evidence, erase audit history, or approve their own sensitive review by default |
| Supervisor | Assign work, approve sensitive transitions, review escalations, and access permitted reports | Cannot access unrelated organizations or turn candidate output into an autonomous legal action |
| Investigator / officer | Work assigned cases, participants, reports, candidates, alerts, and assessments | Cannot access unassigned/cross-organization objects or finalize without review authority |
| Evidence officer | Register evidence, verify hashes, record custody, and retrieve permitted media | Cannot silently replace evidence, delete custody history, or alter audit events |
| Auditor | Read permitted audit, custody, restoration, and report evidence | Cannot mutate cases, evidence, candidate decisions, or audit records |
| Public reporter | Submit and track own public reports, sightings, and tips | Cannot access internal records, staff notes, evidence, biometric data, or other reporters |
| Background worker / AI provider | Process approved jobs and return structured candidate results | Cannot authenticate as a human, grant access, change thresholds, or make final decisions |

Every negative authorization case is a required test for each module and critical workflow.

## 2. Threat controls

| Threat | Required control | Residual risk to track |
|---|---|---|
| IDOR or object-permission failure | Backend object authorization, scoped identifiers, negative tests, safe 404/403 behavior, audit | New endpoints can bypass shared policy if not reviewed |
| Cross-organization leakage | Mandatory organization/unit filters, membership checks, scoped query services, isolation fixtures | Reporting and exports can reintroduce aggregation leakage |
| Session theft or credential abuse | Secure session settings, inactivity/absolute expiry, rate limits, re-auth for sensitive actions, audit | Compromised endpoint or device remains an operational risk |
| Unauthorized evidence access | Protected storage, signed/authorized retrieval, hash verification, access logs, least privilege | Misconfiguration or exposed storage credentials |
| Custody/audit tampering | Append-oriented events, restricted mutation, safe before/after values, integrity checks, restore tests | Administrative compromise requires external governance and recovery controls |
| Malicious uploads and path traversal | MIME/content checks, size limits, generated names, path normalization, malware-scanning readiness, orphan cleanup | Novel parser or malware bypass requires layered scanning and quarantine |
| Public-form abuse | Rate limits, validation, abuse logging, moderation, safe error messages, escalation controls | Distributed abuse and social engineering require operational response |
| Biometric exposure | Data minimization, protected media, no raw vectors in logs, inherited retention, human review, approved fixtures only | Model inversion, re-identification, and unauthorized secondary use |
| False-match misuse | Candidate language, thresholds, quality, provenance, human states, reviewer reason, no guilt/arrest output | Bias and error under unseen populations require evaluation and disclosure |
| Leaked secrets or debug data | Environment-only secrets, secret scans, production debug off, redaction, safe error handling | Host or CI compromise requires infrastructure controls |
| Unsafe retries or duplicate actions | Idempotency keys, bounded retries, state checks, duplicate-event tests | Partial external notification failure needs reconciliation |

## 3. AI and human-review rules

1. AI output is always a `candidate match` or `potential match`, never proof of identity, criminality, guilt, or risk.
2. Candidate results may only be `confirmed`, `rejected`, or `inconclusive`.
3. An authorized human reviewer owns every final operational disposition; the worker and provider cannot finalize it.
4. Each candidate records provider, model, version, threshold, metric, quality, source, reviewer, timestamp, decision, and reason where applicable.
5. Threshold changes are explicit, versioned, approved, tested, and visible in provenance; silent threshold changes are prohibited.
6. Low-quality input, missing provenance, provider failure, or uncertainty produces a visible non-final state rather than an automatic negative or positive decision.
7. Assessment factors link to evidence and uncertainty. No probability-of-guilt, automatic arrest recommendation, or autonomous legal decision is generated.
8. Training and evaluation use only synthetic, licensed, or explicitly consented data; model and dataset limitations are disclosed.
9. Alerts triggered by candidates remain reversible and require the authorized workflow state and human review appropriate to the action.

## 4. Governance and review gates

- Security, privacy, institutional, and legal review is required before real sensitive or biometric data is enabled.
- A threat-model update is required for new modules, trust boundaries, providers, storage destinations, or public exposure.
- A role-permission review is required before each sensitive workflow is released.
- An AI evaluation record is required before candidate thresholds or provider versions are used in a demonstration.
- An incident record is required for authorization bypass, data exposure, custody/audit integrity failure, unsafe AI result, or secret exposure.
- Residual risks remain visible in the risk register and are not converted into feature claims.

## 5. Governance verification

The baseline is accepted only when endpoint/object negative tests, upload tests, audit reconstruction, hash/custody tests, candidate review tests, retention checks, and backup/restore checks have observed evidence. The next implementation stages must preserve these rules in code, tests, UI states, operations, and documentation.
