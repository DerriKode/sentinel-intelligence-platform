import { useId, useRef, type ReactNode } from "react";
import { Button } from "../forms";
import { useModalLayer } from "./useModalLayer";

export interface ModalDialogProps {
  open: boolean;
  title: string;
  description?: string;
  children: ReactNode;
  actions?: ReactNode;
  closeLabel?: string;
  busy?: boolean;
  onClose: () => void;
}

export function ModalDialog({
  open,
  title,
  description,
  children,
  actions,
  closeLabel = "Close dialog",
  busy = false,
  onClose
}: ModalDialogProps) {
  const titleId = useId();
  const descriptionId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useModalLayer({ open, busy, onClose, initialFocusRef: closeRef });

  if (!open) {
    return null;
  }

  return (
    <div className="modal-layer modal-layer--centered">
      <div
        ref={dialogRef}
        className="modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        aria-busy={busy}
        tabIndex={-1}
      >
        <header className="modal-dialog__header">
          <div>
            <p className="modal-dialog__eyebrow">Dialog</p>
            <h2 id={titleId}>{title}</h2>
          </div>
          <Button ref={closeRef} variant="quiet" aria-label={closeLabel} disabled={busy} onClick={onClose}>
            Close
          </Button>
        </header>
        {description && <p className="modal-dialog__description" id={descriptionId}>{description}</p>}
        <div className="modal-dialog__body">{children}</div>
        {actions && <footer className="modal-dialog__actions">{actions}</footer>}
      </div>
    </div>
  );
}
