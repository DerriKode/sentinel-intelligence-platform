# Stage 0 Decision Register

| ID | Decision | Evidence | Status |
|---|---|---|---|
| D-001 | Release 1 is a secure academic demonstration and controlled pilot, not national or autonomous deployment | `STAGE_0_SCOPE_AND_STAKEHOLDERS.md` | Locked |
| D-002 | Use a modular monolith with separately scalable workers | `ARCHITECTURE_AND_MODULE_BOUNDARIES.md` | Locked |
| D-003 | React/TypeScript/Vite portals use Django/DRF APIs; browsers never access data services directly | `ARCHITECTURE_AND_MODULE_BOUNDARIES.md` | Locked |
| D-004 | MySQL is the authoritative structured-data store; protected media is outside MySQL behind an abstraction | `DATA_MODEL_AND_DATA_GOVERNANCE.md` | Locked |
| D-005 | Access is deny-by-default across role, organization, unit, assignment, workflow, responsibility, sensitivity, and explicit authorization | `SECURITY_ROLE_AND_AI_GOVERNANCE.md` | Locked |
| D-006 | AI produces candidate results only; an authorized human must choose confirmed, rejected, or inconclusive | `SECURITY_ROLE_AND_AI_GOVERNANCE.md` | Locked |
| D-007 | Stage 0 budgets are provisional and require measurement; production sensitive-data retention requires formal review | `NON_FUNCTIONAL_REQUIREMENTS_AND_BUDGETS.md` | Locked with review gate |
| D-008 | Stage 1 implementation cannot begin until `APPROVE BLUEPRINT` is observed | `STAGE_0_BLUEPRINT_V1_CHECKPOINT.md` | Pending approval |

Material changes require an architecture, security, data, or scope decision record before implementation proceeds.
