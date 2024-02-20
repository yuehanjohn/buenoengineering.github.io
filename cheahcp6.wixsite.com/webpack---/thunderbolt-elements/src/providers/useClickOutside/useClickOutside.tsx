import * as React from 'react';
import { useEventOutside } from '../useEventOutside/useEventOutside';

export const useClickOutside = (
  toExclude:
    | Array<React.RefObject<HTMLElement | SVGElement> | undefined>
    | Array<HTMLElement | null>,
  onClickOutside: () => void,
  useCapture: boolean = true,
) => {
  useEventOutside('click', toExclude, onClickOutside, useCapture);
};
