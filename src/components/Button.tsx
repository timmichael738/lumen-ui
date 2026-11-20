import type { ComponentPropsWithRef } from 'react';
import { cx } from '../utils';

export interface ButtonProps extends ComponentPropsWithRef<'button'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  /** Shows a spinner, sets aria-busy and blocks clicks while keeping the button focusable. */
  loading?: boolean;
}

export function Button({
  variant = 'secondary',
  size = 'md',
  loading = false,
  disabled,
  className,
  children,
  onClick,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cx('lumen-button', `lumen-button--${variant}`, `lumen-button--${size}`, className)}
      // aria-disabled (not disabled) while loading keeps focus on the button for screen readers.
      disabled={disabled}
      aria-disabled={loading || undefined}
      aria-busy={loading || undefined}
      onClick={(event) => {
        if (loading) {
          event.preventDefault();
          return;
        }
        onClick?.(event);
      }}
      {...rest}
    >
      {loading && <span className="lumen-spinner" aria-hidden="true" />}
      <span className="lumen-button__label">{children}</span>
    </button>
  );
}
