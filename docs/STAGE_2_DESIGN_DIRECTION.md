# Stage 2 Design Direction

**Work package:** S2-01 — Define Enterprise Design Direction
**Status:** Proposed; awaiting `APPROVE DESIGN DIRECTION`
**Date:** 2026-07-17
**Applies to:** Unified internal portal and separate public portal

## Direction

Sentinel uses **calm enterprise authority**: a modern public-safety operations interface that is dependable, readable, secure, role-aware, task-oriented, and information-rich without feeling crowded. The interface should help people make careful decisions under pressure. It must communicate status and responsibility clearly without dramatizing cases, implying certainty, or turning sensitive work into a spectacle.

The visual foundation is a restrained navy, slate, white, teal, amber, red, and purple semantic palette; readable system typography; bounded content panels; modest borders; visible focus; and responsive layouts. Color is a supporting signal, never the only way to convey meaning.

## Experience principles

1. **Clarity before decoration.** Every screen has one primary purpose, a descriptive page title, a clear next action, and a visible current location.
2. **Operational calm.** Use steady hierarchy, generous spacing, concise copy, and predictable placement. Avoid urgency theater, alarmist language, and visual noise.
3. **Evidence before assertion.** Show source, timestamp, status, uncertainty, provenance, and review ownership where decisions depend on them.
4. **Human authority is visible.** Candidate results and assessments are review inputs, not proof, guilt findings, arrest decisions, or autonomous actions. The responsible human and reason remain explicit.
5. **Permission is understandable.** Explain denied access and safe next steps without revealing protected object existence, internal notes, or sensitive fields. Frontend visibility never replaces backend authorization.
6. **Progressive disclosure.** Put the minimum safe information in the primary view; expose detail, history, filters, and technical provenance through deliberate secondary surfaces.
7. **Accessible by construction.** Use semantic landmarks, labels, keyboard operation, visible focus, readable contrast, predictable focus order, screen-reader announcements, and reduced-motion behavior from the first component.
8. **Responsive without loss of control.** Preserve primary actions, context, status, and safe error recovery from 320 px through desktop widths. Tables and dense evidence views must have an intentional compact or alternative presentation.
9. **Consistent, not uniform.** Shared layout, tokens, state patterns, and language should be stable; role-specific workflows may emphasize different information without inventing page-specific visual dialects.
10. **Safe content.** Use plain English first and prepare labels and messages for Twi localization. Never place credentials, raw biometric vectors, unnecessary personal data, or real evidence in UI fixtures or examples.

## Layout and interaction contract

| Concern | Rule |
|---|---|
| Shell | One application shell with persistent context, a skip link, named main landmark, role/environment context, and predictable navigation. |
| Page hierarchy | Eyebrow or section label, one `h1`, purposeful `h2` sections, short explanatory copy, then task content. Do not use headings only for visual size. |
| Grid | Use bounded content width and a small number of meaningful columns. Collapse to one column where content or controls would become cramped. |
| Actions | One primary action per surface where possible; secondary and destructive actions are visually and verbally distinct. Destructive actions require confirmation and reason where policy requires it. |
| Forms | Labels remain visible; validation is inline, specific, associated with the field, and recoverable. Preserve user input after safe validation failure. |
| Lists and tables | Show loading, empty, error, denied, and populated states. Provide pagination/filter context and do not imply a complete dataset when results are scoped. |
| Status | Pair semantic color with text, iconography, or shape. Use stable labels such as `Loading`, `Needs review`, `Permission denied`, and `Inconclusive`. |
| Navigation | Desktop may use a persistent sidebar; tablet/mobile uses an accessible toggle and scrim. Escape, focus return, and outside interaction must be handled by the component implementation. |
| Feedback | Use polite live regions for routine updates and alerts only for actionable urgent errors. Do not expose backend exception details or protected identifiers. |
| Motion | Motion is brief and functional. Respect `prefers-reduced-motion`; no animation is required to understand or complete a task. |

## Semantic design tokens

Components must consume shared tokens rather than inventing page-level colors or spacing. The initial foundation values are:

| Token family | Initial direction |
|---|---|
| Ink and structure | Deep navy for headings and navigation; slate for supporting text; light slate for borders and surfaces. |
| Action and positive | Teal for primary actions and confirmed/ready states, always paired with text. |
| Caution | Amber for validation, pending, and loading states; never use caution color as a decorative accent only. |
| Error | Red for actionable failure and invalid input; messages must explain recovery. |
| Restricted | Purple is reserved for permission-denied or restricted states and must not imply danger or guilt. |
| Surfaces | White content surfaces on a light neutral page background; borders carry separation before shadows. |
| Focus | A high-visibility focus indicator with sufficient contrast against each tested surface. |
| Typography | Readable system sans-serif stack, comfortable line height, and responsive type sizing without clipped text. |

Contrast and focus values must be checked for each component state against WCAG 2.2 AA expectations during implementation. No token is considered compliant solely because it is named semantically.

## Prohibited patterns

The following are prohibited across the internal and public portals:

- generic starter-template appearance or unreviewed component-library defaults;
- neon, gaming, cyberpunk, militarized, sensational, or surveillance-theater aesthetics;
- glassmorphism, excessive gradients, excessive shadows, glossy surfaces, or ornamental chrome;
- random card colors, oversized internal hero banners, decorative charts, fake metrics, or KPI walls without verified data;
- emojis as primary icons, ambiguous icon-only actions, or color-only status communication;
- dense unstructured dashboards that make the primary task unclear;
- language that presents a candidate match as proof, guilt, criminality, risk, or an automatic arrest recommendation;
- exposing hidden records, staff notes, evidence, biometric data, raw model vectors, credentials, or unnecessary personal fields in UI states, URLs, screenshots, logs, or examples;
- frontend-only authorization, optimistic claims of success before an API confirms them, or silent failure;
- infinite scroll where pagination, scope, and record counts are operationally important;
- page-specific visual systems that bypass shared tokens, state patterns, keyboard rules, or responsive behavior.

## Role and privacy expression

The UI should identify the active role, organization/unit scope, assignment context, workflow state, and sensitivity where the user is authorized to see them. It must not disclose those values to unauthorized users. Permission-denied screens should provide a safe explanation and next step without confirming the existence of a protected record.

Internal workflow pages must keep audit, custody, provenance, reviewer, timestamp, and reason information close to the action they explain. Public pages must remain separate from internal records and return only a safe reference/status experience for the reporter.

## Required state and acceptance matrix

Every major page and reusable data component must specify and test:

| State or behavior | Acceptance expectation |
|---|---|
| Loading | Clear non-sensitive progress message; primary structure remains understandable; no misleading success. |
| Empty | Explain why no records appear and provide an authorized next step or safe guidance. |
| Error | Actionable recovery; no stack trace, secret, raw identifier, or protected detail. |
| Success | Confirm the actual completed action, its scope, and any next step. |
| Permission denied | Safe message; no protected record disclosure; route/API remains denied independently. |
| Validation | Field-level association, plain-language correction, preserved safe input, keyboard access, and announced error. |
| Keyboard and focus | All actions reachable and operable by keyboard; visible focus; no trapped or skipped context. |
| Responsive | Critical actions usable at 320 px, tablet, and desktop widths without intentional horizontal clipping. |
| Accessibility | Semantic landmarks, labels, heading order, contrast, status announcements, reduced motion, and screen-reader review. |

## Implementation guardrails

- Extend the existing frontend foundation and its tests; do not add a significant dependency for visual polish without an approved decision.
- Keep UI state local until an API contract and authorization behavior exist. Do not invent data or metrics to fill empty surfaces.
- Add screenshots or browser evidence only from synthetic or approved fixtures.
- Each new component has a clear owner, states, keyboard behavior, responsive behavior, and targeted tests before it is reused across role workflows.
- Design changes that affect privacy, permissions, AI language, evidence handling, or public/internal trust boundaries require the relevant decision and security review.

## Approval gate

This direction formalizes the existing Stage 1 calm enterprise foundation. It is not approved for downstream UI implementation until the team provides:

`APPROVE DESIGN DIRECTION`

Exact next external prompt after approval:

`prompts/03_stage2_ui_ux/S2-02_FINALIZE_INFORMATION_ARCHITECTURE.md`
