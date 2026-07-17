# Changelog

## 2026-07-17 - Stage 0 blueprint baseline

- Recorded academic report review in commit `fb81841`.
- Locked Release 1 scope and stakeholders in commit `13fc2e9`.
- Added functional requirements and role acceptance in commit `4e8b005`.
- Added provisional non-functional budgets in commit `c40d470`.
- Locked architecture, data, security, permissions, threats, and AI governance in commit `1c64c6a`.
- Assembled the Blueprint Version 1 checkpoint; approval is pending.

No application source, package dependency, runtime configuration, production data, or external governance-pack file has been added.

## 2026-07-17 - Stage 1 foundation checkpoint

- Verified repository safety, backend quality, migration drift, backend tests, and Windows operational checks.
- Recorded prior passing frontend typecheck, lint, tests, and build evidence from S1-07.
- Recorded the subsequent frontend clean-install registry failure, unavailable Redis service, and deferred manual browser verification as explicit limitations.
- Added the Stage 1 checkpoint evidence and requested `APPROVE STAGE 1`.

## 2026-07-17 - Stage 2 design direction proposal

- Formalized calm enterprise authority as the shared visual direction for internal and public portals.
- Added UI state, accessibility, responsive, privacy, security, human-review, and prohibited-pattern guardrails.
- Linked the design direction to requirements and recorded decision D-013.
- Requested `APPROVE DESIGN DIRECTION`; information architecture remains gated.

## 2026-07-17 - Stage 2 information architecture

- Recorded team approval of the calm enterprise design direction.
- Locked separate internal `/app/*` and public `/public/*` route trees.
- Defined navigation groups, nested routes, role visibility, safe route outcomes, accessibility behavior, and route-level verification obligations.
- Added decision D-014 and risk R-013 for navigation-versus-authorization leakage.

## 2026-07-17 - Stage 2 design tokens and typography

- Added centralized primitive and semantic color, typography, spacing, radius, border, shadow, motion, breakpoint-reference, z-index, control, and layout tokens.
- Refactored the global shell and state styles to consume shared semantic tokens without changing application behavior.
- Added token-contract tests for required families, state/focus semantics, raw component colors, breakpoint alignment, and reduced motion.
- Kept the system font stack dependency-free and documented native CSS media-query token limitations.

## 2026-07-17 - Stage 2 accessibility and responsive foundations

- Added atomic status/busy semantics and validation focus behavior to the foundation states.
- Made closed compact navigation inert, managed opening focus, and restored trigger focus after Escape, close, or scrim dismissal.
- Added overflow-safe text/media, background scroll locking, coarse-pointer targets, increased/forced contrast, narrow-mobile, and strengthened reduced-motion rules.
- Added targeted keyboard, focus, state-announcement, CSS preference, and responsive-foundation tests.

## 2026-07-17 - Stage 2 form and action components

- Added dependency-free shared buttons, fields, selects, text areas, upload states, linked validation summaries, and confirmations.
- Added a local-only component preview with no API, storage, authorization, or sensitive-data behavior.
- Added keyboard focus containment and restoration, announced errors and statuses, responsive action layouts, coarse-pointer sizing, and forced-color support.
- Recorded that client upload checks are guidance only and that all authorization, content, and file controls require server enforcement.
- Added 8 focused component tests; the full 37-test suite, accessibility suite, lint, typecheck, and production build pass.

## 2026-07-17 - Stage 2 data and feedback components

- Recorded `APPROVE COMPONENT SYSTEM` and continued to the approved shared data/feedback scope.
- Added cards, semantic metrics, text-bearing badges, responsive native tables, named filter forms, bounded pagination, alerts, dialogs, drawers, and six application states.
- Added a clearly synthetic local preview for filtering, pagination, status, dialog, and drawer behavior without API or storage operations.
- Added keyboard focus containment/restoration, Escape behavior, safe empty/error/denied states, 48 px coarse targets, and forced-color support.
- Added 16 focused tests; the full 53-test suite, accessibility suite, lint, typecheck, and production build pass.

## 2026-07-17 - Stage 2 internal application shell

- Recorded the prior `APPROVE COMPONENT SYSTEM` gate and continued to the internal-shell scope.
- Extracted a reusable AppShell with grouped sidebar navigation, top-bar organization/user context, breadcrumbs, workspace heading/actions, application-state boundary, environment status, and footer.
- Added capability-informed destination filtering, empty authorized-navigation feedback, current-destination semantics, and an explicit reminder that the API remains the authorization boundary.
- Added inert compact navigation, first-authorized-link or close-control focus, Escape/close/scrim focus restoration, and route-selection focus transfer.
- Added 10 focused shell tests; the full 63-test suite, lint, typecheck, and 51-module production build pass.
- Recorded that HTTP verification passed while desktop/tablet/mobile browser visual inspection remains pending because no browser session was connected.

## 2026-07-17 - Stage 2 public portal shell

- Recorded `APPROVE INTERNAL APP SHELL` and continued only to the separate public-layout scope.
- Added a reusable mobile-first public shell and `/public` preview with public-only branding, shallow navigation, emergency limitation, privacy reminder, page states, and support footer.
- Added an availability-aware language foundation: English is enabled, while Twi is explicitly disabled and described as not yet available.
- Preserved the public/internal trust boundary and safe URL rules; no staff context, internal records, identifiers, tracking secrets, forms, API calls, analytics, storage, or fabricated translations were introduced.
- Added inert compact navigation, first-link focus, Escape/close/scrim restoration, current-route semantics, public document titles, and route-heading focus.
- Added 15 focused tests; the full 78-test suite, lint, typecheck, and 54-module production build pass. `/public` returned HTTP 200; browser visual inspection remains pending.

## 2026-07-17 - Stage 2 dashboard data architecture

- Recorded `APPROVE PUBLIC PORTAL DESIGN` and closed the S2-08 approval gate.
- Locked dashboard composition and widget contracts for KPI, queue, workload, activity, health, and visualization data.
- Defined separate administrator, supervisor, investigator, evidence-officer, and auditor dashboard obligations and exclusions.
- Required server-scoped totals and rows, source/freshness labels, safe partial and stale states, bounded queries, context-aware cache isolation, and aggregate/detail reconciliation.
- Prohibited hidden-scope leakage, fake zeroes, punitive staff rankings, autonomous decisions, guilt/risk scoring, and inaccessible or decorative charts.
- Recorded implementation decisions that remain open without weakening authorization, privacy, provenance, human review, accessibility, or truthful-state rules.
