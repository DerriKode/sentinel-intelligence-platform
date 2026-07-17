import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "quiet" | "danger";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  loading?: boolean;
  loadingLabel?: string;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    children,
    variant = "primary",
    loading = false,
    loadingLabel = "Working…",
    fullWidth = false,
    disabled,
    className = "",
    type = "button",
    ...buttonProps
  },
  ref
) {
  const classes = [
    "action-button",
    `action-button--${variant}`,
    fullWidth ? "action-button--full" : "",
    className
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      {...buttonProps}
      ref={ref}
      className={classes}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading}
    >
      {loading && <span className="action-button__spinner" aria-hidden="true" />}
      <span>{loading ? loadingLabel : children}</span>
    </button>
  );
});
