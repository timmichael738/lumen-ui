import { useId, type ComponentPropsWithRef, type ReactNode } from 'react';
import { cx, useControllableState } from '../utils';

export interface SwitchProps extends Omit<
  ComponentPropsWithRef<'button'>,
  'onChange' | 'value' | 'defaultValue'
> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  /** Visible label. Clicking it toggles the switch. */
  label: ReactNode;
  description?: ReactNode;
}

/** WAI-ARIA switch pattern: a button with role="switch" and aria-checked. Space/Enter toggle it. */
export function Switch({
  checked,
  defaultChecked = false,
  onCheckedChange,
  label,
  description,
  disabled,
  className,
  ...rest
}: SwitchProps) {
  const [on, setOn] = useControllableState(checked, defaultChecked, onCheckedChange);
  const id = useId();

  return (
    <div className={cx('lumen-switch', disabled && 'lumen-switch--disabled', className)}>
      <button
        type="button"
        role="switch"
        id={`${id}-switch`}
        aria-checked={on}
        aria-labelledby={`${id}-label`}
        aria-describedby={description ? `${id}-description` : undefined}
        disabled={disabled}
        className="lumen-switch__track"
        onClick={() => setOn(!on)}
        {...rest}
      >
        <span className="lumen-switch__thumb" aria-hidden="true" />
      </button>
      <div className="lumen-switch__text">
        <label id={`${id}-label`} htmlFor={`${id}-switch`} className="lumen-switch__label">
          {label}
        </label>
        {description && (
          <span id={`${id}-description`} className="lumen-switch__description">
            {description}
          </span>
        )}
      </div>
    </div>
  );
}
