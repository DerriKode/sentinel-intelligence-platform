import { useEffect, useId, useRef } from "react";

export interface ValidationIssue {
  fieldId: string;
  message: string;
}

export interface ValidationSummaryProps {
  issues: ValidationIssue[];
  title?: string;
  focusOnMount?: boolean;
}

export function ValidationSummary({
  issues,
  title = "Review the highlighted fields",
  focusOnMount = true
}: ValidationSummaryProps) {
  const headingId = useId();
  const summaryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (focusOnMount && issues.length > 0) {
      summaryRef.current?.focus();
    }
  }, [focusOnMount, issues.length]);

  if (issues.length === 0) {
    return null;
  }

  return (
    <div
      ref={summaryRef}
      className="validation-summary"
      role="alert"
      aria-labelledby={headingId}
      tabIndex={-1}
    >
      <h3 id={headingId}>{title}</h3>
      <ul>
        {issues.map((issue) => (
          <li key={`${issue.fieldId}-${issue.message}`}>
            <a href={`#${issue.fieldId}`}>{issue.message}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
