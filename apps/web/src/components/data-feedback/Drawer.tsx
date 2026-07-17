import { useId, useRef, type ReactNode } from "react";
import { Button } from "../forms";
import { useModalLayer } from "./useModalLayer";

export interface DrawerProps {
  open: boolean;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  side?: "start" | "end";
  closeLabel?: string;
  busy?: boolean;
  onClose: () => void;
}

export function Drawer({
  open,
  title,
  description,
  children,
  footer,
  side = "end",
  closeLabel = "Close drawer",
  busy = false,
  onClose
}: DrawerProps) {
  const titleId = useId();
  const descriptionId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useModalLayer({ open, busy, onClose, initialFocusRef: closeRef });

  if (!open) {
    return null;
  }

  return (
    <div className={`modal-layer modal-layer--drawer modal-layer--${side}`}>
      <aside
        ref={drawerRef}
        className="data-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        aria-busy={busy}
        tabIndex={-1}
      >
        <header className="data-drawer__header">
          <div>
            <p className="data-drawer__eyebrow">Context panel</p>
            <h2 id={titleId}>{title}</h2>
          </div>
          <Button ref={closeRef} variant="quiet" aria-label={closeLabel} disabled={busy} onClick={onClose}>
            Close
          </Button>
        </header>
        {description && <p className="data-drawer__description" id={descriptionId}>{description}</p>}
        <div className="data-drawer__body">{children}</div>
        {footer && <footer className="data-drawer__footer">{footer}</footer>}
      </aside>
    </div>
  );
}
