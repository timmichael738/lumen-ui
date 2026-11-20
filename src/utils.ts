import { useCallback, useState, type Ref, type RefCallback } from 'react';

/** Joins truthy class names. */
export const cx = (...classes: (string | false | null | undefined)[]) =>
  classes.filter(Boolean).join(' ');

/**
 * State that can be controlled (value + onChange from the parent) or uncontrolled (defaultValue),
 * the convention used by native inputs and most component libraries.
 */
export function useControllableState<T>(
  value: T | undefined,
  defaultValue: T,
  onChange?: (value: T) => void,
): [T, (next: T) => void] {
  const [internal, setInternal] = useState(defaultValue);
  const controlled = value !== undefined;

  const set = useCallback(
    (next: T) => {
      if (!controlled) setInternal(next);
      onChange?.(next);
    },
    [controlled, onChange],
  );
  return [controlled ? value : internal, set];
}

/** Combines several refs (callback or object) into one. */
export function mergeRefs<T>(...refs: (Ref<T> | undefined)[]): RefCallback<T> {
  return (node) => {
    for (const ref of refs) {
      if (typeof ref === 'function') ref(node);
      else if (ref) (ref as { current: T | null }).current = node;
    }
  };
}

/** Index of the next enabled item when moving with arrow keys, wrapping around. */
export function nextIndex(
  current: number,
  count: number,
  step: 1 | -1,
  isDisabled: (i: number) => boolean,
): number {
  for (let n = 1; n <= count; n++) {
    const i = (current + step * n + count) % count;
    if (!isDisabled(i)) return i;
  }
  return current;
}
