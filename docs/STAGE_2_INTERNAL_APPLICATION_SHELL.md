# Stage 2 Internal Application Shell

**Work package:** S2-07 — Build Internal Application Shell  
**Status:** Implemented; approval and browser visual verification pending  
**Date:** 2026-07-17

## Implemented capability

The frontend now provides a reusable `InternalAppShell` for the authenticated portal. It composes the Sentinel brand, grouped sidebar navigation, environment status, compact-navigation controls, active organization and user context, breadcrumbs, workspace heading/actions, content boundary, and footer without adding a routing or UI dependency.

The foundation preview uses this shell with synthetic local context and grouped Foundation, Components, and Setup destinations. A deliberately unauthorized Administration destination demonstrates capability filtering without exposing an inaccessible link.

## Permission and data boundary

Navigation items declare required capability strings. The shell displays only items whose requirements are all present and removes empty groups. If no item is available, it shows a generic safe message and keeps a keyboard-reachable close control.

This filtering is presentation behavior only. It does not authenticate a user, authorize a route, scope a query, prove record existence, or replace backend endpoint/object/field checks. The API remains responsible for role, organization, unit, assignment, workflow, responsibility, sensitivity, and explicit-authorization enforcement. The shell accepts display-ready context only and must not receive secrets or unneeded protected attributes.

The current preview uses local hash destinations because the approved `/app/*` router and authenticated session are not implemented yet. Those integrations must preserve the public/internal route boundary and safe denied/not-found behavior.

## Accessibility and responsive behavior

- A skip link targets the focusable main workspace.
- Sidebar and breadcrumb navigation have distinct accessible names; the active destination uses `aria-current="page"`.
- Compact navigation is `inert` and hidden from the accessibility tree while closed.
- Opening focuses the first authorized destination, or the close control when no destination exists.
- Escape, the sidebar close action, and the scrim restore focus to the menu trigger.
- Route selection closes compact navigation and moves focus to the workspace title.
- Loading, error, and permission-denied workspace boundaries use the shared application-state semantics; recoverable errors can expose an explicit retry.
- Tokenized tablet, mobile, narrow-mobile, coarse-pointer, forced-color, and reduced-motion foundations apply without raw component colors.

## Observed verification

- Strict TypeScript typecheck and ESLint passed.
- Focused AppShell/application suite passed: 19 tests.
- Full Vitest suite passed: 63 tests across 5 files, including 10 shell tests.
- Production build passed: 51 modules transformed.
- Local Vite server returned HTTP 200 and was stopped.
- Tests cover capability filtering, empty navigation, landmarks, breadcrumbs, current destination, workspace states, retry, inert compact navigation, opening focus, Escape/scrim dismissal, focus restoration, route-focus transfer, responsive rules, and raw-color exclusion.

The in-app browser runtime reported no available browser session. Desktop, tablet, mobile, zoom, forced-color, and visual-focus inspection therefore remain required at the Stage 2 checkpoint.

## Approval gate

Stop until the team provides:

`APPROVE INTERNAL APP SHELL`

Exact next external prompt after approval:

`prompts/03_stage2_ui_ux/S2-08_BUILD_PUBLIC_PORTAL_SHELL.md`
