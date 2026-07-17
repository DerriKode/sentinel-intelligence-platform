# User, API, and Operations Documentation Status

**Checkpoint:** S2-03
**Status:** Design direction and information architecture locked; token implementation recorded

## Available now

- User-facing scope, actors, roles, critical workflows, and acceptance criteria are documented in the Stage 0 scope and requirements files.
- API behavior is represented by functional requirement IDs and authorization conditions; the backend foundation exists, while versioned endpoint contracts remain deferred.
- Operations expectations, health, logging, backup, restore, monitoring, and runbook budgets are documented; setup, local services, status, and quality-check workflows are recorded in the Stage 1 documents.
- Security, privacy, accessibility, and AI human-review rules are documented for implementation.
- Shared visual personality, interaction principles, prohibited patterns, state requirements, and UI privacy/security guardrails are documented in `STAGE_2_DESIGN_DIRECTION.md`.
- Internal/public navigation, canonical route hierarchies, role visibility, safe route outcomes, and route verification obligations are documented in `STAGE_2_INFORMATION_ARCHITECTURE.md`.
- Central colors, typography, spacing, shape, motion, breakpoint references, layout values, accessibility rationale, verification, and limitations are documented in `STAGE_2_DESIGN_TOKENS_AND_TYPOGRAPHY.md`.

## Deferred until foundation and workflow implementation

| Documentation | Current status | Required artifact |
|---|---|---|
| User documentation | Blueprint concepts and foundation state recorded | Role-specific guides with screenshots and tested workflows |
| API documentation | Foundation exists; no versioned business API contract | Versioned API contract, examples, authorization notes, and error model |
| Operations documentation | Local setup, status, health-check, and service boundaries recorded | Monitoring, backup/restore, incident, deployment, and rollback runbooks |
| Accessibility evidence | Source tests and responsive/reduced-motion rules recorded; browser session deferred | Keyboard, screen-reader, responsive, contrast, and browser evidence |

The Stage 2 design direction is approved. Accessibility/responsive components, shells, navigation, shared states, and role-specific pages remain deferred to the following work packages.

No documentation gap blocks design-direction approval; downstream artifacts must not be fabricated before the underlying behavior exists.
