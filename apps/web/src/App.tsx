import { useRef, useState, type FormEvent } from "react";
import { DataFeedbackPreview } from "./components/data-feedback";
import { Button, FormComponentPreview, TextField } from "./components/forms";
import { PublicPortalPreview } from "./components/public-shell";
import {
  InternalAppShell,
  type InternalNavigationGroup
} from "./components/shell";

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

const internalNavigation: InternalNavigationGroup[] = [
  {
    label: "Workspace",
    items: [
      {
        label: "Foundation",
        href: "#foundation",
        code: "FD",
        requiredCapabilities: ["foundation:view"]
      },
      {
        label: "Access posture",
        href: "#access-posture",
        code: "AP",
        requiredCapabilities: ["foundation:view"]
      }
    ]
  },
  {
    label: "Components",
    items: [
      {
        label: "Form components",
        href: "#form-components",
        code: "FM",
        requiredCapabilities: ["components:view"]
      },
      {
        label: "Data and feedback",
        href: "#data-feedback-components",
        code: "DT",
        requiredCapabilities: ["components:view"]
      }
    ]
  },
  {
    label: "Setup",
    items: [
      {
        label: "Setup notes",
        href: "#setup-notes",
        code: "ST",
        requiredCapabilities: ["setup:view"]
      },
      {
        label: "Administration",
        href: "#administration",
        code: "AD",
        requiredCapabilities: ["administration:manage"]
      }
    ]
  }
];

const previewCapabilities = ["foundation:view", "components:view", "setup:view"];
const previewUser = {
  displayName: "Local preview user",
  roleLabel: "Investigator preview",
  organizationLabel: "Synthetic operations context"
};

function InternalFoundationPreview() {
  const [activeState, setActiveState] = useState<FoundationState>("success");
  const [activeHref, setActiveHref] = useState("#foundation");
  const [workspaceLabel, setWorkspaceLabel] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const workspaceInputRef = useRef<HTMLInputElement>(null);
  const content = stateContent[activeState];
  const isInvalid = submitted && workspaceLabel.trim().length === 0;

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
    <InternalAppShell
      navigationGroups={internalNavigation}
      capabilities={previewCapabilities}
      activeHref={activeHref}
      userContext={previewUser}
      workspaceEyebrow="Platform foundation"
      workspaceTitle="A dependable shell for public-safety work."
      workspaceDescription={
        "A calm, role-aware starting point for secure case, evidence, and public-report workflows. " +
        "The API remains the source of authorization and truth."
      }
      breadcrumbs={[
        { label: "Internal workspace", href: "#foundation" },
        { label: "Foundation" }
      ]}
      onNavigate={setActiveHref}
    >
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
    </InternalAppShell>
  );
}

function App() {
  return window.location.pathname.startsWith("/public")
    ? <PublicPortalPreview />
    : <InternalFoundationPreview />;
}

export default App;
