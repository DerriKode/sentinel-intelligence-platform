import type { ReactNode } from "react";
import { Button } from "../forms";

export type AlertTone = "info" | "success" | "warning" | "error" | "denied";

export interface AlertProps {
  tone?: AlertTone;
  title: string;
  children: ReactNode;
  actions?: ReactNode;
  dismissLabel?: string;
  onDismiss?: () => void;
}

const toneLabels: Record<AlertTone, string> = {
  info: "Information",
  success: "Success",
  warning: "Warning",
  error: "Error",
  denied: "Permission denied"
};

export function Alert({
  tone = "info",
  title,
  children,
  actions,
  dismissLabel = "Dismiss message",
  onDismiss
}: AlertProps) {
  return (
    <section className={`feedback-alert feedback-alert--${tone}`}>
      <div
        className="feedback-alert__content"
        role={tone === "error" ? "alert" : "status"}
        aria-live={tone === "error" ? "assertive" : "polite"}
        aria-atomic="true"
      >
        <p className="feedback-alert__tone">{toneLabels[tone]}</p>
        <h3>{title}</h3>
        <div className="feedback-alert__message">{children}</div>
      </div>
      {(actions || onDismiss) && (
        <div className="feedback-alert__controls">
          {actions && <div className="feedback-alert__actions">{actions}</div>}
          {onDismiss && (
            <Button className="feedback-alert__dismiss" variant="quiet" aria-label={dismissLabel} onClick={onDismiss}>
              Close
            </Button>
          )}
        </div>
      )}
    </section>
  );
}
