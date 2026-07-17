# Stage 2 Public Portal Shell

**Work package:** S2-08 — Build Public Portal Shell
**Status:** Implemented and approved; browser visual verification pending
**Date:** 2026-07-17

## Implemented capability

The frontend now provides a reusable, mobile-first `PublicPortalShell` under the logical `/public/*` namespace. It is separate from the internal AppShell and includes:

- a public-reporting brand and public-only document title;
- a clear emergency-service limitation;
- shallow Report, Track a submission, Safety and privacy, and Help navigation;
- an availability-aware language selector with English enabled and Twi honestly marked unavailable;
- a privacy reminder, public page heading/actions, complete public page-state boundary, and public-only footer;
- a synthetic landing preview describing report types, tracking-secret safety, public-status limits, and inactive form workflows.

No routing, translation, analytics, API, authentication, storage, or form-submission dependency was added. The preview contains no real report, person, case, evidence, staff, tracking, or biometric data.

## Public/internal and privacy boundary

`App` selects the public preview only for paths beginning with `/public`; other paths preserve the internal foundation. Public output contains no internal sidebar, staff role/organization context, operational search, evidence access, candidate result, internal case navigation, or protected identifiers.

Navigation links use the approved safe `/public/*` paths without query strings, fragments, names, references, narratives, or tracking secrets. Shell navigation is intercepted locally until an approved router exists. Report forms, tracking lookup, verified status, one-time references, rate limits, server validation, moderation, consent, retention, and escalation remain future API/workflow responsibilities.

Public loading, empty, error, success, unavailable/denied, and validation states use non-sensitive copy. Unavailable and error text does not confirm whether a protected person, case, report, candidate, staff account, or submission exists.

## Accessibility, language, and responsive behavior

- Unique skip, primary-navigation, and policy/support landmarks are present.
- The current public destination uses `aria-current="page"` and route selection focuses the page heading.
- Closed mobile navigation is `inert`; opening focuses the first destination; Escape, close, and scrim dismissal restore trigger focus.
- Page titles follow `Page — Sentinel Public Reporting` without sensitive values.
- English is the only enabled preview language. Twi is visible as planned but disabled and described as unavailable; no unreviewed translation is presented.
- Mobile-first layout supports narrow screens, desktop expansion, coarse input, reduced motion, forced colors, and token-only component styling.

## Observed verification

- Strict TypeScript typecheck and ESLint passed.
- Focused public-shell/application suite passed: 24 tests.
- Full Vitest suite passed: 78 tests across 6 files, including 15 public-shell tests.
- Production build passed: 54 modules transformed.
- `/public` returned HTTP 200 from the already-running local Vite server.
- Tests cover approved routes, safe URLs, public/internal isolation, language availability, document title, privacy/emergency copy, all six public states, error retry, compact-navigation focus/restoration, route-heading focus, and responsive CSS contracts.

The connected browser service reported no available browser session. Visual checks at 320 px, mobile, tablet, desktop, zoom, reduced motion, and forced colors remain required at the Stage 2 checkpoint.

## Approval outcome

The team provided `APPROVE PUBLIC PORTAL DESIGN` on 2026-07-17. Browser visual verification remains a later checkpoint obligation and does not reopen the completed design approval.

Exact next external prompt:

`prompts/03_stage2_ui_ux/S2-09_DEFINE_DASHBOARD_DATA_ARCHITECTURE.md`
