import { useEffect, useRef, useState, type FormEvent } from "react";
import { DataFeedbackPreview } from "./components/data-feedback";
import { Button, FormComponentPreview, TextField } from "./components/forms";

type FoundationState = "loading" | "empty" | "error" | "success" | "denied" | "validation";

const stateLabels: Record<FoundationState, string> = {
  loading: "Loading",
  empty: "Empty",
  error: "Error",
  success: "Success",
  denied: "Permission denied",
  validation: "Validation"
};

const stateContent: Record<FoundationState, { kicker: string; title: string; message: string }> = {
  loading: {
    kicker: "Loading state",
    title: "Preparing your workspace",
    message: "The platform is checking the services required for this view."
  },
  empty: {
    kicker: "Empty state",
    title: "No records to show yet",
    message: "When authorized records become available, they will appear here with clear next steps."
  },
  error: {
    kicker: "Error state",
    title: "We could not load this workspace",
    message: "Try again or contact an administrator if the problem continues. No sensitive details are shown here."
  },
  success: {
    kicker: "Success state",
    title: "The foundation is ready",
    message: "This shell is ready for authenticated, role-aware workflows backed by the API."
  },
  denied: {
    kicker: "Permission-denied state",
    title: "Access is not available for this view",
    message: "Your role or assignment does not currently authorize this action. Request access through your supervisor."
  },
  validation: {
    kicker: "Validation state",
    title: "Review the highlighted fields",
    message: "Required information is identified in plain language before an action can continue."
  }
};

const compactNavigationQuery = "(max-width: 52.5rem)";

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => window.matchMedia?.(query).matches ?? false);

  useEffect(() => {
    const mediaQuery = window.matchMedia?.(query);
    if (!mediaQuery) {
      return;
    }

    function handleChange(event: MediaQueryListEvent) {
      setMatches(event.matches);
    }

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [query]);

  return matches;
}

function App() {
  const [activeState, setActiveState] = useState<FoundationState>("success");
  const [menuOpen, setMenuOpen] = useState(false);
  const [workspaceLabel, setWorkspaceLabel] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const isCompactNavigation = useMediaQuery(compactNavigationQuery);
  const menuToggleRef = useRef<HTMLButtonElement>(null);
  const firstNavigationLinkRef = useRef<HTMLAnchorElement>(null);
  const workspaceInputRef = useRef<HTMLInputElement>(null);
  const restoreMenuFocusRef = useRef(false);
  const content = stateContent[activeState];
  const isInvalid = submitted && workspaceLabel.trim().length === 0;

  useEffect(() => {
    if (!isCompactNavigation || !menuOpen) {
      return;
    }

    document.body.dataset.navigationOpen = "true";
    const focusTimer = window.setTimeout(() => firstNavigationLinkRef.current?.focus(), 0);

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        restoreMenuFocusRef.current = true;
        setMenuOpen(false);
      }
    }

    document.addEventListener("keydown", handleEscape);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", handleEscape);
      delete document.body.dataset.navigationOpen;

      if (restoreMenuFocusRef.current) {
        restoreMenuFocusRef.current = false;
        menuToggleRef.current?.focus();
      }
    };
  }, [isCompactNavigation, menuOpen]);

  useEffect(() => {
    if (!isCompactNavigation && menuOpen) {
      restoreMenuFocusRef.current = false;
      setMenuOpen(false);
    }
  }, [isCompactNavigation, menuOpen]);

  function closeNavigation(restoreFocus: boolean) {
    restoreMenuFocusRef.current = restoreFocus;
    setMenuOpen(false);
  }

  function toggleNavigation() {
    if (menuOpen) {
      closeNavigation(true);
      return;
    }

    restoreMenuFocusRef.current = false;
    setMenuOpen(true);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    const isValid = workspaceLabel.trim().length > 0;
    setActiveState(isValid ? "success" : "validation");

    if (!isValid) {
      workspaceInputRef.current?.focus();
    }
  }

  function chooseState(state: FoundationState) {
    setSubmitted(false);
    setActiveState(state);
  }

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>

      <aside
        id="application-navigation"
        className={`sidebar${menuOpen ? " sidebar--open" : ""}`}
        aria-hidden={isCompactNavigation && !menuOpen ? true : undefined}
        aria-label="Application navigation"
        inert={isCompactNavigation && !menuOpen ? true : undefined}
      >
        <div className="brand-lockup">
          <span className="brand-mark" aria-hidden="true">SI</span>
          <span>
            <strong>Sentinel</strong>
            <small>Intelligence Platform</small>
          </span>
        </div>

        <nav className="primary-nav" aria-label="Primary navigation">
          <a
            ref={firstNavigationLinkRef}
            className="nav-link nav-link--active"
            href="#foundation"
            aria-current="page"
            onClick={() => closeNavigation(false)}
          >
            <span aria-hidden="true">01</span>
            Foundation
          </a>
          <a className="nav-link" href="#access-posture" onClick={() => closeNavigation(false)}>
            <span aria-hidden="true">02</span>
            Access posture
          </a>
          <a className="nav-link" href="#setup-notes" onClick={() => closeNavigation(false)}>
            <span aria-hidden="true">03</span>
            Setup notes
          </a>
          <a className="nav-link" href="#form-components" onClick={() => closeNavigation(false)}>
            <span aria-hidden="true">04</span>
            Form components
          </a>
          <a className="nav-link" href="#data-feedback-components" onClick={() => closeNavigation(false)}>
            <span aria-hidden="true">05</span>
            Data and feedback
          </a>
        </nav>

        <div className="sidebar-footer">
          <span className="status-dot" aria-hidden="true" />
          <span>
            <small>Environment</small>
            <strong>Local foundation</strong>
          </span>
        </div>
      </aside>

      {isCompactNavigation && menuOpen && (
        <button
          className="nav-scrim"
          type="button"
          aria-label="Dismiss navigation"
          onClick={() => closeNavigation(true)}
        />
      )}

      <div className="main-column">
        <header className="topbar">
          <button
            ref={menuToggleRef}
            className="menu-toggle"
            type="button"
            aria-controls="application-navigation"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            hidden={!isCompactNavigation}
            onClick={toggleNavigation}
          >
            Menu
          </button>
          <div className="topbar-status" role="status" aria-live="polite">
            <span className="status-dot" aria-hidden="true" />
            Development foundation
          </div>
        </header>

        <main id="main-content" className="main-content" tabIndex={-1}>
          <section className="page-heading" aria-labelledby="page-title">
            <p className="eyebrow">Platform foundation</p>
            <h1 id="page-title">A dependable shell for public-safety work.</h1>
            <p className="lede">
              A calm, role-aware starting point for secure case, evidence, and public-report workflows.
              The API remains the source of authorization and truth.
            </p>
          </section>

          <section className="panel state-panel" id="foundation" aria-labelledby="states-title">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Interaction contract</p>
                <h2 id="states-title">Accessible states are first-class</h2>
              </div>
              <span className="panel-index">S1 / 02</span>
            </div>

            <div className="state-switcher" role="group" aria-label="Foundation state preview">
              {(Object.keys(stateLabels) as FoundationState[]).map((state) => (
                <button
                  className={`state-button${activeState === state ? " state-button--active" : ""}`}
                  key={state}
                  type="button"
                  aria-pressed={activeState === state}
                  onClick={() => chooseState(state)}
                >
                  {stateLabels[state]}
                </button>
              ))}
            </div>

            <div
              className={`state-card state-card--${activeState}`}
              role={activeState === "error" ? "alert" : "status"}
              aria-atomic="true"
              aria-busy={activeState === "loading"}
              aria-live={activeState === "error" ? "assertive" : "polite"}
            >
              <span className="state-marker" aria-hidden="true">{activeState === "success" ? "OK" : "--"}</span>
              <div>
                <p className="state-kicker">{content.kicker}</p>
                <h3>{content.title}</h3>
                <p>{content.message}</p>
              </div>
            </div>
          </section>

          <div className="content-grid">
            <section className="panel" id="setup-notes" aria-labelledby="setup-title">
              <div className="panel-heading">
                <div>
                  <p className="eyebrow">Safe setup</p>
                  <h2 id="setup-title">A small, testable action</h2>
                </div>
              </div>
              <form onSubmit={handleSubmit} noValidate>
                <TextField
                  ref={workspaceInputRef}
                  id="workspace-label"
                  name="workspaceLabel"
                  label="Workspace label"
                  description="This foundation action is local only; no data is sent to an API."
                  error={isInvalid ? "Enter a workspace label before continuing." : undefined}
                  required
                  value={workspaceLabel}
                  onChange={(event) => setWorkspaceLabel(event.target.value)}
                  placeholder="e.g. Central operations"
                />
                <div className="form-actions form-actions--spaced">
                  <Button type="submit">Save placeholder</Button>
                </div>
              </form>
            </section>

            <section className="panel" id="access-posture" aria-labelledby="posture-title">
              <div className="panel-heading">
                <div>
                  <p className="eyebrow">Authorization boundary</p>
                  <h2 id="posture-title">Access posture</h2>
                </div>
              </div>
              <ul className="control-list">
                <li><strong>Deny by default</strong><span>Visibility is a usability aid, never a security control.</span></li>
                <li><strong>Scoped by role</strong><span>Organization, assignment, workflow, and sensitivity remain API-enforced.</span></li>
                <li><strong>Human authority</strong><span>Candidate output can inform review but cannot finalize an operational decision.</span></li>
              </ul>
            </section>
          </div>

          <FormComponentPreview />
          <DataFeedbackPreview />
        </main>

        <footer className="footer">
          <span>Sentinel Intelligence Platform</span>
          <span>Foundation v0.1.0</span>
        </footer>
      </div>
    </div>
  );
}

export default App;
