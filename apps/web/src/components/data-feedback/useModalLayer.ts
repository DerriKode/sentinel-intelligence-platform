import { useEffect, useRef, type RefObject } from "react";

let openLayerCount = 0;

const focusableSelector = [
  "button:not(:disabled)",
  "[href]",
  "input:not(:disabled)",
  "select:not(:disabled)",
  "textarea:not(:disabled)",
  "[tabindex]:not([tabindex='-1'])"
].join(",");

export interface ModalLayerOptions {
  open: boolean;
  busy?: boolean;
  onClose: () => void;
  initialFocusRef: RefObject<HTMLElement | null>;
}

export function useModalLayer({ open, busy = false, onClose, initialFocusRef }: ModalLayerOptions) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const closeHandlerRef = useRef(onClose);
  const busyRef = useRef(busy);
  closeHandlerRef.current = onClose;
  busyRef.current = busy;

  useEffect(() => {
    if (!open) {
      return;
    }

    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    openLayerCount += 1;
    document.body.dataset.modalLayerOpen = "true";
    const focusTimer = window.setTimeout(() => initialFocusRef.current?.focus(), 0);

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !busyRef.current) {
        event.preventDefault();
        closeHandlerRef.current();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const focusable = Array.from(
        containerRef.current?.querySelectorAll<HTMLElement>(focusableSelector) ?? []
      );
      if (focusable.length === 0) {
        event.preventDefault();
        containerRef.current?.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", handleKeyDown);
      openLayerCount = Math.max(0, openLayerCount - 1);
      if (openLayerCount === 0) {
        delete document.body.dataset.modalLayerOpen;
      }
      previousFocusRef.current?.focus();
    };
  }, [initialFocusRef, open]);

  return containerRef;
}
