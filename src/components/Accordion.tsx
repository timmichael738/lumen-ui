import { createContext, use, useId, type ReactNode } from 'react';
import { cx, useControllableState } from '../utils';

interface AccordionContextValue {
  open: string[];
  toggle: (value: string) => void;
  headingLevel: 2 | 3 | 4 | 5 | 6;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

export interface AccordionProps {
  /** "single" keeps at most one section open; "multiple" lets any number be open. */
  type?: 'single' | 'multiple';
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  /** Heading level for item titles, so the accordion fits the page's document outline. */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  className?: string;
  children: ReactNode;
}

/** WAI-ARIA accordion pattern: real headings wrapping buttons with aria-expanded/aria-controls. */
export function Accordion({
  type = 'single',
  value,
  defaultValue = [],
  onValueChange,
  headingLevel = 3,
  className,
  children,
}: AccordionProps) {
  const [open, setOpen] = useControllableState(value, defaultValue, onValueChange);
  const toggle = (item: string) => {
    if (open.includes(item)) setOpen(open.filter((v) => v !== item));
    else setOpen(type === 'single' ? [item] : [...open, item]);
  };
  return (
    <AccordionContext value={{ open, toggle, headingLevel }}>
      <div className={cx('lumen-accordion', className)}>{children}</div>
    </AccordionContext>
  );
}

export function AccordionItem({
  value,
  title,
  children,
}: {
  value: string;
  title: ReactNode;
  children: ReactNode;
}) {
  const ctx = use(AccordionContext);
  if (!ctx) throw new Error('<AccordionItem> must be used inside <Accordion>');
  const id = useId();
  const expanded = ctx.open.includes(value);
  const Heading = `h${ctx.headingLevel}` as const;

  return (
    <div className={cx('lumen-accordion__item', expanded && 'lumen-accordion__item--open')}>
      <Heading className="lumen-accordion__heading">
        <button
          type="button"
          id={`${id}-trigger`}
          aria-expanded={expanded}
          aria-controls={`${id}-panel`}
          className="lumen-accordion__trigger"
          onClick={() => ctx.toggle(value)}
        >
          <span>{title}</span>
          <span className="lumen-accordion__chevron" aria-hidden="true" />
        </button>
      </Heading>
      <div
        id={`${id}-panel`}
        role="region"
        aria-labelledby={`${id}-trigger`}
        hidden={!expanded}
        className="lumen-accordion__panel"
      >
        {children}
      </div>
    </div>
  );
}
