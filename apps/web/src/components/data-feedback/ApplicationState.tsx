import type { ReactNode } from "react";

export type ApplicationStateKind = "loading" | "empty" | "error" | "success" | "denied" | "validation";

export interface ApplicationStateProps {
  kind: ApplicationStateKind;
  title: string;
  message: string;
  actions?: ReactNode;
  compact?: boolean;
}

const stateMarkers: Record<ApplicationStateKind, string> = {
  loading: "LD",
  empty: "--",
  error: "!",
  success: "OK",
  denied: "NO",
  validation: "!"
};

const stateLabels: Record<ApplicationStateKind, string> = {
  loading: "Loading",
  empty: "Empty",
  error: "Error",
  success: "Success",
  denied: "Permission denied",
  validation: "Validation required"
};

export function ApplicationState({
  kind,
  title,
  message,
  actions,
  compact = false
}: ApplicationStateProps) {
  const assertive = kind === "error" || kind === "validation";

  return (
    <section
      className={`application-state application-state--${kind}${compact ? " application-state--compact" : ""}`}
    >
      <span className="application-state__marker" aria-hidden="true">{stateMarkers[kind]}</span>
      <div>
        <div
          className="application-state__announcement"
          role={assertive ? "alert" : "status"}
          aria-live={assertive ? "assertive" : "polite"}
          aria-atomic="true"
          aria-busy={kind === "loading"}
        >
          <p className="application-state__label">{stateLabels[kind]}</p>
          <h3>{title}</h3>
          <p>{message}</p>
        </div>
        {actions && <div className="application-state__actions">{actions}</div>}
      </div>
    </section>
  );
}
