import type { FormEvent, ReactNode } from "react";
import { Button } from "../forms";

export interface FilterBarProps {
  label: string;
  children: ReactNode;
  activeFilterCount?: number;
  busy?: boolean;
  onApply: () => void;
  onClear: () => void;
}

export function FilterBar({
  label,
  children,
  activeFilterCount = 0,
  busy = false,
  onApply,
  onClear
}: FilterBarProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onApply();
  }

  return (
    <form className="filter-bar" role="search" aria-label={label} aria-busy={busy} onSubmit={handleSubmit}>
      <div className="filter-bar__fields">{children}</div>
      <div className="filter-bar__footer">
        <p className="filter-bar__status" role="status" aria-live="polite">
          {activeFilterCount === 0
            ? "No filters applied."
            : `${activeFilterCount} ${activeFilterCount === 1 ? "filter" : "filters"} applied.`}
        </p>
        <div className="filter-bar__actions">
          <Button type="submit" loading={busy} loadingLabel="Applying filters...">Apply filters</Button>
          <Button type="button" variant="secondary" disabled={busy} onClick={onClear}>
            Clear filters
          </Button>
        </div>
      </div>
    </form>
  );
}
