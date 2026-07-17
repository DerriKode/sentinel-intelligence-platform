import type { ReactNode } from "react";

export interface FieldAccessibilityProps {
  describedBy: string | undefined;
  invalid: boolean;
}

export interface FieldFrameProps {
  id: string;
  label: string;
  description?: string;
  error?: string;
  required?: boolean;
  children: (accessibility: FieldAccessibilityProps) => ReactNode;
}

export function FieldFrame({ id, label, description, error, required = false, children }: FieldFrameProps) {
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [descriptionId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className="form-field" data-invalid={error ? "true" : undefined}>
      <label className="form-field__label" htmlFor={id}>
        {label}
        {required && <span className="form-field__required" aria-hidden="true"> *</span>}
      </label>
      {children({ describedBy, invalid: Boolean(error) })}
      {description && <p className="form-field__description" id={descriptionId}>{description}</p>}
      {error && <p className="form-field__error" id={errorId} role="alert">{error}</p>}
    </div>
  );
}
