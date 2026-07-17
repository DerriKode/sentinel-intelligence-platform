# Stage 0 Risk Register

| ID | Risk | Probability | Impact | Mitigation | Owner | Trigger | Status |
|---|---|---|---|---|---|---|---|
| R-001 | Limited Windows laptop, 8 GB RAM, and no CUDA constrain media processing | High | High | CPU-friendly processing, one worker initially, frame sampling, reduced resolution, measured budgets | Technical lead | Queue or memory target fails | Open |
| R-002 | No application runtime exists, so code-level quality claims cannot yet be tested | Certain | High | Explicitly mark Stage 0 runtime checks not applicable; make them Stage 1 gates | Technical lead | Foundation is created | Accepted for stage |
| R-003 | Sensitive or biometric data could be introduced prematurely | Medium | Critical | Synthetic/consented fixtures only, protected storage, retention/legal gate, secret scans | Data/privacy owner | Real data proposed | Open |
| R-004 | Authorization or cross-organization leakage | Medium | Critical | Deny-by-default matrix, object tests, scoped queries, negative tests, audit | Security owner | New protected endpoint/module | Open |
| R-005 | False matches or opaque assessments could cause harmful action | Medium | Critical | Candidate-only language, human review states, provenance, thresholds, no guilt/arrest outputs | AI governance owner | Candidate workflow changes | Open |
| R-006 | Evidence or audit/custody tampering | Low | Critical | SHA-256, append-oriented events, restricted mutation, restore/integrity tests | Evidence owner | Integrity check fails | Open |
| R-007 | Scope expansion into live national surveillance or autonomous decisions | Medium | High | Explicit deferred scope, change control, stage gate, approval requirement | Product owner | New scope request | Open |
| R-008 | Documentation drifts from implementation | Medium | High | Traceability matrix, checkpoint reviews, requirement-linked tests, handoff cadence | Technical lead | Code differs from docs | Open |
| R-009 | Formal blueprint approval is absent | Certain | High | Stop at checkpoint and request `APPROVE BLUEPRINT` | Project sponsor | Approval received | Pending |
