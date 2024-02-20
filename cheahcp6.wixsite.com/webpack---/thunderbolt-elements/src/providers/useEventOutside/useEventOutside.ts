import React, { useEffect } from 'react';

export const useEventOutside = (
  type: keyof DocumentEventMap,
  toExclude:
    | Array<React.RefObject<HTMLElement | SVGElement> | undefined>
    | Array<HTMLElement | null>,
  onEventOutside: () => void,
  useCapture: boolean = true,
) => {
  useEffect(
    () => {
      const handleEventOutside = (event: Event) => {
        const target = event.target as HTMLElement;
        if (!target) {
          return;
        }

        for (const candidateToExclude of toExclude) {
          if (candidateToExclude instanceof HTMLElement) {
            if (candidateToExclude && candidateToExclude.contains(target)) {
              return;
            }
          } else {
            if (candidateToExclude?.current?.contains(target)) {
              return;
            }
          }
        }
        onEventOutside();
      };

      document.addEventListener(type, handleEventOutside, useCapture);
      return () => {
        document.removeEventListener(type, handleEventOutside, useCapture);
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [...toExclude, onEventOutside, type],
  );
};
