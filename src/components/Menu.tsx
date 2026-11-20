import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { cx, nextIndex } from '../utils';

export interface MenuItem {
  label: string;
  onSelect: () => void;
  disabled?: boolean;
  danger?: boolean;
}

export interface MenuProps {
  /** Content of the trigger button. */
  trigger: ReactNode;
  items: MenuItem[];
  /** Accessible name when `trigger` isn't plain text (e.g. an icon). */
  label?: string;
  className?: string;
}

/**
 * WAI-ARIA menu button pattern. Enter/Space/ArrowDown open the menu on the first item, ArrowUp on
 * the last; arrows move, Home/End jump, typing a letter jumps to the next item starting with it;
 * Escape or Tab closes, and focus returns to the trigger.
 */
export function Menu({ trigger, items, label, className }: MenuProps) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const id = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const disabled = (i: number) => !!items[i]?.disabled;

  const openAt = (index: number) => {
    setActive(index);
    setOpen(true);
  };

  const close = useCallback((refocus = true) => {
    setOpen(false);
    if (refocus) triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (open) menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]')[active]?.focus();
  }, [open, active]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!menuRef.current?.contains(target) && !triggerRef.current?.contains(target)) close(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open, close]);

  const activate = (index: number) => {
    const item = items[index];
    if (!item || item.disabled) return;
    close();
    item.onSelect();
  };

  const onTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openAt(nextIndex(-1, items.length, 1, disabled));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      openAt(nextIndex(items.length, items.length, -1, disabled));
    }
  };

  const onMenuKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    const keys: Record<string, () => void> = {
      ArrowDown: () => setActive(nextIndex(active, items.length, 1, disabled)),
      ArrowUp: () => setActive(nextIndex(active, items.length, -1, disabled)),
      Home: () => setActive(nextIndex(-1, items.length, 1, disabled)),
      End: () => setActive(nextIndex(items.length, items.length, -1, disabled)),
      Escape: () => close(),
      Enter: () => activate(active),
      ' ': () => activate(active),
    };
    if (event.key === 'Tab') return close(false);
    const handler = keys[event.key];
    if (handler) {
      event.preventDefault();
      handler();
      return;
    }
    // Typeahead: jump to the next enabled item starting with the typed character.
    if (event.key.length === 1 && /\S/.test(event.key)) {
      const char = event.key.toLowerCase();
      for (let n = 1; n <= items.length; n++) {
        const i = (active + n) % items.length;
        if (!disabled(i) && items[i]!.label.toLowerCase().startsWith(char)) {
          setActive(i);
          break;
        }
      }
    }
  };

  return (
    <div className={cx('lumen-menu', className)}>
      <button
        ref={triggerRef}
        type="button"
        id={`${id}-trigger`}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? `${id}-menu` : undefined}
        aria-label={label}
        className="lumen-button lumen-button--secondary lumen-button--md"
        onClick={() => (open ? close() : openAt(nextIndex(-1, items.length, 1, disabled)))}
        onKeyDown={onTriggerKeyDown}
      >
        {trigger}
      </button>
      {open && (
        <ul
          ref={menuRef}
          role="menu"
          id={`${id}-menu`}
          aria-labelledby={`${id}-trigger`}
          className="lumen-menu__list"
          onKeyDown={onMenuKeyDown}
        >
          {items.map((item, i) => (
            <li
              key={item.label}
              role="menuitem"
              tabIndex={i === active ? 0 : -1}
              aria-disabled={item.disabled || undefined}
              className={cx('lumen-menu__item', item.danger && 'lumen-menu__item--danger')}
              onClick={() => activate(i)}
              onPointerMove={() => !item.disabled && setActive(i)}
            >
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
