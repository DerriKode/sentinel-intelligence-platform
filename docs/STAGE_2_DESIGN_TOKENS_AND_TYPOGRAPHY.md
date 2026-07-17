# Stage 2 Design Tokens and Typography

**Work package:** S2-03 — Implement Design Tokens and Typography
**Status:** Implemented
**Date:** 2026-07-17

## Implemented capability

`apps/web/src/styles/tokens.css` is the single CSS source for the Stage 2 visual foundations. It defines:

- primitive and semantic colors for text, surfaces, navigation, actions, success, loading, warning/validation, error, permission-denied, overlays, and focus;
- a dependency-free system font stack, responsive display size, text scale, weights, line heights, and letter spacing;
- spacing, radius, border, restrained shadow, motion, breakpoint-reference, z-index, control-size, and layout tokens;
- semantic aliases so components express purpose instead of consuming palette values directly.

The global stylesheet imports the token file first and uses the shared variables for the existing shell, loading/empty/error/success/permission-denied/validation states, forms, focus, navigation, panels, tablet drawer, mobile layout, and reduced motion.

## Accessibility and responsive decisions

- Focus uses an amber ring plus a dark contrast halo so it remains distinguishable on light and dark surfaces; each future component still requires contextual contrast verification.
- State color always accompanies existing text or structure. Color is not the sole status signal.
- Typography uses local/system fonts and therefore creates no external font request, tracking dependency, layout delay, or offline failure.
- The minimum supported viewport remains 320 px. Breakpoint reference tokens are centralized at 40 rem (mobile), 52.5 rem (tablet), and 90 rem (wide).
- Native CSS does not permit `var()` inside media-query conditions. The media conditions repeat the documented token values and are protected by token-contract tests.
- Reduced-motion mode collapses transitions and animations to the centralized instant duration without removing state meaning.

## Verification contract

`src/styles/tokens.test.ts` verifies every required token family, semantic state tokens, focus treatment, token import, absence of raw component color literals, breakpoint alignment, reduced-motion use, and 4.5:1 or better contrast for the primary text/action and semantic state foreground/background pairs. Existing application tests continue to cover all state messages, form validation, landmarks, skip navigation, and responsive navigation semantics.

## Observed verification

- Lockfile-clean dependency installation completed with 288 packages and no tracked package change.
- TypeScript typecheck and ESLint completed successfully.
- The full Vitest suite passed 27 tests across token and application behavior; the dedicated accessibility-state suite passed 8 tests.
- The Vite production build completed with 29 transformed modules and generated the ignored `dist/` artifact.
- The development server returned HTTP 200. Manual browser viewport inspection could not be completed because no connected browser instance was available in this session.

Manual browser checks must still confirm computed fonts, focus visibility, state contrast, 320 px/mobile, tablet drawer, desktop layout, and reduced-motion behavior when a browser instance is available.

## Limitations and change control

- Token names and semantic roles are stable for Stage 2; values may change only with contrast, responsive, or usability evidence and a reviewed diff.
- Breakpoint values are intentionally duplicated only in media-query conditions because of the native CSS limitation described above.
- No dark theme, external font, CSS framework, component library, or design-token build dependency was introduced.
- Token implementation does not grant authorization or change API/data behavior.

Exact next external prompt:

`prompts/03_stage2_ui_ux/S2-04_IMPLEMENT_ACCESSIBILITY_AND_RESPONSIVE_FOUNDATIONS.md`
