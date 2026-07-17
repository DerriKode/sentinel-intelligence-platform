import { useId, type HTMLAttributes, type ReactNode } from "react";

export interface DataCardProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  title: string;
  eyebrow?: string;
  actions?: ReactNode;
  children: ReactNode;
}

export function DataCard({ title, eyebrow, actions, children, className = "", ...cardProps }: DataCardProps) {
  const titleId = useId();

  return (
    <article
      {...cardProps}
      className={["data-card", className].filter(Boolean).join(" ")}
      aria-labelledby={titleId}
    >
      <header className="data-card__header">
        <div>
          {eyebrow && <p className="data-card__eyebrow">{eyebrow}</p>}
          <h3 id={titleId}>{title}</h3>
        </div>
        {actions && <div className="data-card__actions">{actions}</div>}
      </header>
      <div className="data-card__body">{children}</div>
    </article>
  );
}

export interface MetricProps {
  label: string;
  value: ReactNode;
  description?: string;
}

export function Metric({ label, value, description }: MetricProps) {
  return (
    <div className="data-metric">
      <dl>
        <div>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      </dl>
      {description && <p>{description}</p>}
    </div>
  );
}
