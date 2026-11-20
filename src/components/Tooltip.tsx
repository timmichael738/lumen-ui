import { cloneElement, useEffect, useId, useRef, useState, type ReactElement } from 'react';

export interface TooltipProps {
  content: string;
  /** A single focusable element (usually a button). */
  children: ReactElement<{ 'aria-describedby'?: string }>;
  /** Hover delay in ms before showing (focus shows immediately). */
  delay?: number;
  side?: 'top' | 'bottom';
}

/**
 * Tooltip that meets WCAG 1.4.13: shown on hover *and* keyboard focus, dismissable with Escape
 * without moving focus, and it stays open while the pointer is over it. It describes the trigger
 * via aria-describedby; it is never the only label.
 */
export function Tooltip({ content, children, delay = 400, side = 'top' }: TooltipProps) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const show = (wait: number) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(true), wait);
  };
  const hide = () => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(false), 100);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  useEffect(() => () => clearTimeout(timer.current), []);

  // Only the description is attached to the child; interaction handlers live on the wrapper
  // (React focus and pointer events bubble), so the child's own handlers stay untouched.
  const trigger = cloneElement(children, {
    'aria-describedby': open ? id : children.props['aria-describedby'],
  });

  return (
    <span
      className="lumen-tooltip"
      onFocus={() => show(0)}
      onBlur={hide}
      onPointerEnter={() => show(delay)}
      onPointerLeave={hide}
    >
      {trigger}
      {open && (
        <span
          role="tooltip"
          id={id}
          className={`lumen-tooltip__bubble lumen-tooltip__bubble--${side}`}
          onPointerEnter={() => clearTimeout(timer.current)}
          onPointerLeave={hide}
        >
          {content}
        </span>
      )}
    </span>
  );
}
