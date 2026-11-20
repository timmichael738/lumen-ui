import { createContext, use, useId, useRef, type KeyboardEvent, type ReactNode } from 'react';
import { cx, nextIndex, useControllableState } from '../utils';

interface TabsContextValue {
  baseId: string;
  value: string;
  select: (value: string) => void;
  orientation: 'horizontal' | 'vertical';
}

const TabsContext = createContext<TabsContextValue | null>(null);

const useTabs = () => {
  const ctx = use(TabsContext);
  if (!ctx) throw new Error('Tab components must be used inside <Tabs>');
  return ctx;
};

const slug = (value: string) => value.replace(/[^\w-]/g, '_');

export interface TabsProps {
  value?: string;
  defaultValue: string;
  onValueChange?: (value: string) => void;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  children: ReactNode;
}

/**
 * WAI-ARIA tabs pattern with automatic activation: arrow keys move focus *and* select,
 * Home/End jump to the ends, and only the active tab is in the tab order (roving tabindex).
 */
export function Tabs({
  value,
  defaultValue,
  onValueChange,
  orientation = 'horizontal',
  className,
  children,
}: TabsProps) {
  const [current, select] = useControllableState(value, defaultValue, onValueChange);
  const baseId = useId();
  return (
    <TabsContext value={{ baseId, value: current, select, orientation }}>
      <div className={cx('lumen-tabs', `lumen-tabs--${orientation}`, className)}>{children}</div>
    </TabsContext>
  );
}

export function TabList({ label, children }: { label: string; children: ReactNode }) {
  const { orientation } = useTabs();
  const ref = useRef<HTMLDivElement>(null);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const tabs = [...ref.current!.querySelectorAll<HTMLButtonElement>('[role="tab"]')];
    const index = tabs.indexOf(document.activeElement as HTMLButtonElement);
    if (index === -1) return;
    const prev = orientation === 'horizontal' ? 'ArrowLeft' : 'ArrowUp';
    const next = orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown';
    const disabled = (i: number) => tabs[i]!.disabled;
    let target: number | null = null;
    if (event.key === next) target = nextIndex(index, tabs.length, 1, disabled);
    else if (event.key === prev) target = nextIndex(index, tabs.length, -1, disabled);
    else if (event.key === 'Home') target = nextIndex(-1, tabs.length, 1, disabled);
    else if (event.key === 'End') target = nextIndex(tabs.length, tabs.length, -1, disabled);
    if (target === null) return;
    event.preventDefault();
    tabs[target]!.focus();
    tabs[target]!.click(); // automatic activation
  };

  return (
    <div
      ref={ref}
      role="tablist"
      aria-label={label}
      aria-orientation={orientation}
      className="lumen-tabs__list"
      onKeyDown={onKeyDown}
    >
      {children}
    </div>
  );
}

export function Tab({
  value,
  disabled,
  children,
}: {
  value: string;
  disabled?: boolean;
  children: ReactNode;
}) {
  const { baseId, value: current, select } = useTabs();
  const selected = current === value;
  return (
    <button
      type="button"
      role="tab"
      id={`${baseId}-tab-${slug(value)}`}
      aria-selected={selected}
      aria-controls={`${baseId}-panel-${slug(value)}`}
      tabIndex={selected ? 0 : -1}
      disabled={disabled}
      className="lumen-tabs__tab"
      onClick={() => select(value)}
    >
      {children}
    </button>
  );
}

export function TabPanel({ value, children }: { value: string; children: ReactNode }) {
  const { baseId, value: current } = useTabs();
  return (
    <div
      role="tabpanel"
      id={`${baseId}-panel-${slug(value)}`}
      aria-labelledby={`${baseId}-tab-${slug(value)}`}
      hidden={current !== value}
      // Panels are focusable so keyboard users can reach content that has no focusable children.
      tabIndex={0}
      className="lumen-tabs__panel"
    >
      {children}
    </div>
  );
}
