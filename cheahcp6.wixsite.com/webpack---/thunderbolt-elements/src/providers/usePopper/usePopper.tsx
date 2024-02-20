import * as React from 'react';
// eslint-disable-next-line no-restricted-imports
import {
  usePopper as useExternalPopper,
  PopperProps,
  StrictModifierNames,
} from 'react-popper';
import { Placement as PopperPlacement } from '@popperjs/core';

export type CustomPopperProps = {
  placement?: PopperPlacement;
  strategy?: 'fixed' | 'absolute';
  modifiers?: PopperProps<StrictModifierNames>['modifiers'];
};

export function usePopper<
  RefElementType extends HTMLElement = HTMLElement,
  PopperElementType extends HTMLElement = HTMLElement,
>(options?: CustomPopperProps) {
  const [ref, setRef] = React.useState<RefElementType | null>(null);
  const [popper, setPopper] = React.useState<PopperElementType | null>(null);
  const { styles, attributes, update } = useExternalPopper(ref, popper, {
    ...options,
  });
  return { ref, setRef, popper, setPopper, styles, attributes, update };
}
