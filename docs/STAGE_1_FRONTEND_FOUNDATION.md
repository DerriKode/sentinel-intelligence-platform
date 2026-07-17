# Stage 1 Frontend Foundation

**Status:** S1-02 implementation recorded
**Scope:** Strict React, TypeScript, and Vite foundation under `apps/web/`

## Implemented boundary

- `apps/web/` is a private Vite application with strict TypeScript compiler settings.
- The shell provides a semantic skip link, named main landmark, responsive internal navigation, visible keyboard focus, and reduced-motion handling.
- The state preview makes the foundation interaction contract observable for loading, empty, error, success, permission-denied, and validation states.
- The placeholder form demonstrates labeled input, accessible validation, `aria-invalid`, an associated error message, and a successful local-only action.
- The access-posture panel states that frontend visibility never replaces API endpoint and object authorization.
- No API calls, authentication claims, evidence, biometric data, real metrics, or production configuration are included.

## Design and responsive decisions

The shell uses the approved calm enterprise direction: restrained semantic colors, readable typography, bounded panels, consistent focus treatment, and no decorative metrics or gradients. Desktop uses a persistent sidebar; tablet and mobile use a keyboard-operable navigation toggle and scrim. The content grid collapses to one column below 640px, with full-width action controls and no intentional horizontal overflow.

## Verification contract

Run from `apps/web/` after dependencies are available:

```text
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run test
npm.cmd run test:accessibility
npm.cmd run build
```

`src/App.test.tsx` covers the main landmark and skip link, state controls, validation and correction, and responsive navigation semantics. Manual verification must still inspect keyboard order/focus, 320px, tablet, and desktop layouts in a browser.

## Environment note

The dependency install was attempted with the declared fixed versions but could not complete in this environment: the default npm cache was not writable, offline mode lacked cached tarballs, and the sandboxed registry request returned `EACCES`. No `node_modules/` or lockfile was created. Re-run `npm.cmd install --no-audit --no-fund` from `apps/web/` in an environment with a writable npm cache and registry access before claiming runtime checks.

## Recovery

If initialization fails, remove only the untracked frontend foundation files after review and restore the empty `apps/web/` boundary; do not alter backend, worker, infrastructure, or governance-pack paths. Do not run the dev server until dependency installation and type checks pass.
