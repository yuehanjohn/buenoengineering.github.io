import { useRef, useEffect } from 'react';

/**
 * Returns value passed on previous render
 * @param {P} value - value on current render - to store
 * @param {P | null} - default value, returned in case it's first render
 * @returns {P | null} - value passed on previous render
 */
export function usePrevious<P>(
  value: P,
  defaultValue: P | null = null,
): P | null {
  // References are a good way to store any values related to component instance
  const valueRef = useRef<P | null>(defaultValue);

  // Store value on current render into our reference
  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  // It will return previous version of value, because useEffect will be
  // called (and rewrite ref.current) AFTER render
  return valueRef.current;
}
