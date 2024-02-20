import React from 'react';
import { keyCodes } from '@wix/editor-elements-common-utils';
import { usePrevious } from '../usePrevious';
import { useExpandableListKeyDownParams } from './useExpandableListKeyDown.types';

const noop = () => {};

export const useExpandableListKeyDown = ({
  isListOpen,
  openListFn = noop,
  closeListFn = noop,
  openListKeyCodes = [],
  closeListKeyCodes = [],
  keyCodesToExcludeFromPreventDefault = [],
  initialHoveredOptionIndex = 0,
  listLength,
  circularMode = false,
  resetOnListClose = false,
  resetOnLengthChange = false,
}: useExpandableListKeyDownParams) => {
  const [hoveredOptionIndex, setHoveredOptionIndex] = React.useState(
    initialHoveredOptionIndex,
  );
  const prevListLength = usePrevious(listLength, listLength);
  const prevIsListOpen = usePrevious(isListOpen, isListOpen);

  React.useEffect(() => {
    if (prevListLength !== listLength && resetOnLengthChange) {
      const resetVal =
        hoveredOptionIndex === initialHoveredOptionIndex
          ? initialHoveredOptionIndex
          : 0;
      setHoveredOptionIndex(resetVal);
    }
  }, [
    hoveredOptionIndex,
    resetOnLengthChange,
    prevListLength,
    listLength,
    setHoveredOptionIndex,
    initialHoveredOptionIndex,
  ]);

  React.useEffect(() => {
    if (prevIsListOpen !== isListOpen && !isListOpen && resetOnListClose) {
      setHoveredOptionIndex(initialHoveredOptionIndex);
    }
  }, [
    prevIsListOpen,
    isListOpen,
    initialHoveredOptionIndex,
    setHoveredOptionIndex,
    resetOnListClose,
  ]);

  const handleToggleList = React.useCallback(
    (keyCode: number, preventDefault: () => void) => {
      if (isListOpen && closeListKeyCodes.includes(keyCode)) {
        preventDefault();
        closeListFn();
      } else if (!isListOpen && openListKeyCodes.includes(keyCode)) {
        preventDefault();
        openListFn();
      }
    },
    [closeListFn, closeListKeyCodes, isListOpen, openListFn, openListKeyCodes],
  );

  const onKeyDown = React.useCallback(
    (
      e: React.KeyboardEvent<HTMLElement>,
      additionalAction?: (
        hoveredOptionIdx: number,
        isHoveredOptionChanged: boolean,
      ) => void,
    ) => {
      const { keyCode } = e;

      const preventDefault =
        keyCodesToExcludeFromPreventDefault &&
        keyCodesToExcludeFromPreventDefault.includes(keyCode)
          ? () => {}
          : () => e.preventDefault();
      let updatedHoveredOptionIndex = hoveredOptionIndex;
      let isHoveredOptionChanged = false;

      const executeUpdateToHoveredOptionIndex = (newIndex: number) => {
        updatedHoveredOptionIndex = newIndex;
        isHoveredOptionChanged = true;
        setHoveredOptionIndex(updatedHoveredOptionIndex);
      };

      switch (keyCode) {
        case keyCodes.escape:
          if (isListOpen && closeListKeyCodes.includes(keyCodes.escape)) {
            e.stopPropagation();
          }
          break;
        case keyCodes.arrowDown:
          preventDefault();
          if (hoveredOptionIndex + 1 < listLength) {
            executeUpdateToHoveredOptionIndex(hoveredOptionIndex + 1);
          } else if (circularMode) {
            executeUpdateToHoveredOptionIndex(0);
          }
          break;
        case keyCodes.arrowUp:
          preventDefault();
          if (hoveredOptionIndex - 1 >= 0) {
            executeUpdateToHoveredOptionIndex(hoveredOptionIndex - 1);
          } else if (circularMode) {
            executeUpdateToHoveredOptionIndex(listLength - 1);
          }
          break;
        default:
          break;
      }

      handleToggleList(keyCode, preventDefault);
      additionalAction?.(updatedHoveredOptionIndex, isHoveredOptionChanged);
    },
    [
      circularMode,
      handleToggleList,
      hoveredOptionIndex,
      listLength,
      keyCodesToExcludeFromPreventDefault,
      isListOpen,
      closeListKeyCodes,
    ],
  );

  return {
    onKeyDown,
    hoveredOptionIndex,
    setHoveredOptionIndex,
  };
};
