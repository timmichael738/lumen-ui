import type { ComponentPropsWithRef } from 'react';
import { cx } from '../utils';

/** Content for screen readers only (e.g. a label for an icon-only control). */
export function VisuallyHidden({ className, ...rest }: ComponentPropsWithRef<'span'>) {
  return <span className={cx('lumen-visually-hidden', className)} {...rest} />;
}
