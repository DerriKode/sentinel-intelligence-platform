import type { HTMLAttributes, ReactNode } from "react";

export type BadgeTone = "neutral" | "info" | "success" | "warning" | "error" | "denied";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  tone?: BadgeTone;
}

export function Badge({ children, tone = "neutral", className = "", ...badgeProps }: BadgeProps) {
  return (
    <span
      {...badgeProps}
      className={["data-badge", `data-badge--${tone}`, className].filter(Boolean).join(" ")}
    >
      {children}
    </span>
  );
}
