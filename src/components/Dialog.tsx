import { useEffect, useId, useRef, type ReactNode } from 'react';
import { cx } from '../utils';

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  description?: ReactNode;
  /** Close when the backdrop is clicked. Default true. */
  dismissible?: boolean;
  className?: string;
  children?: ReactNode;
}

/**
 * Modal dialog built on the native <dialog> element: the browser provides the top layer,
 * focus trapping and inert background. We add labelling, Escape/backdrop handling and
 * returning focus to whatever opened the dialog.
 */
export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  dismissible = true,
  className,
  children,
}: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const id = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      returnFocus.current = document.activeElement as HTMLElement | null;
      if (typeof dialog.showModal === 'function') dialog.showModal();
      else dialog.setAttribute('open', '');
    } else if (!open && dialog.open) {
      if (typeof dialog.close === 'function') dialog.close();
      else dialog.removeAttribute('open');
      returnFocus.current?.focus();
    }
  }, [open]);

  return (
    <dialog
      ref={ref}
      className={cx('lumen-dialog', className)}
      aria-labelledby={`${id}-title`}
      aria-describedby={description ? `${id}-description` : undefined}
      onCancel={(event) => {
        // Escape: keep React state as the source of truth instead of letting the browser close it.
        event.preventDefault();
        onOpenChange(false);
      }}
      onClick={(event) => {
        if (dismissible && event.target === ref.current) onOpenChange(false);
      }}
    >
      {open && (
        <div className="lumen-dialog__content">
          <h2 id={`${id}-title`} className="lumen-dialog__title">
            {title}
          </h2>
          {description && (
            <p id={`${id}-description`} className="lumen-dialog__description">
              {description}
            </p>
          )}
          {children}
          <button
            type="button"
            className="lumen-dialog__close"
            aria-label="Close"
            onClick={() => onOpenChange(false)}
          >
            ×
          </button>
        </div>
      )}
    </dialog>
  );
}
