import { ComboBoxInputOption } from '@wix/thunderbolt-components';
import classNames from 'clsx';
import * as React from 'react';
import { getDataAttributes } from '@wix/editor-elements-common-utils';
import { IDesignableListProps } from '@wix/editor-elements-library/src/components/ComboBoxInput/ComboBoxInput.types';
import { noop } from '@wix/editor-elements-library/src/components/ComboBoxInput/utils';
import { testIds } from '../constants';
import { useResizeObserver } from '../../../providers/useResizeObserver/useResizeObserver';
import {
  getComboBoxInputListModalId,
  scrollDownToOption,
  scrollUpToOption,
} from '../utils';
import { usePrevious } from '../../../providers/usePrevious';
import style from './style/ComboBoxInputListModal.scss';

const ComboBoxInputListModal: React.FunctionComponent<
  IDesignableListProps
> = props => {
  const {
    id,
    value,
    options,
    hoveredOptionIndex,
    className,
    setDesignableListElem: setExternalDesignableListElem = noop,
    setHoveredOptionIndex = noop,
    onSelectedOptionChange = noop,
  } = props;
  const filteredOptions = props.filteredOptions || props.options;

  const [designableListElem, setDesignableListElem] =
    React.useState<HTMLDivElement | null>(null);
  const [isMouseHovering, setIsMouseHovering] = React.useState(false);
  const firstOptionRef = React.useRef<HTMLDivElement>(null);
  const optionTextRef = React.useRef<HTMLDivElement>(null);
  const selectedOptionRef = React.useRef<HTMLDivElement>(null);
  const hoveredOptionRef = React.useRef<HTMLDivElement>(null);
  const [designableListDynamicStyling, setDesignableListDynamicStyling] =
    React.useState({ '--optionLineHeight': '1.3em' });
  const prevHoveredOptionIndex = usePrevious(hoveredOptionIndex) || 0;
  const onResizeCallback = React.useCallback(() => {
    const optionTextElement = optionTextRef.current;
    if (optionTextElement) {
      const rect = optionTextElement.getBoundingClientRect();
      setDesignableListDynamicStyling({
        '--optionLineHeight': rect.height === 0 ? '1.3em' : `${rect.height}px`,
      });
    }
  }, [optionTextRef]);
  useResizeObserver({
    ref: optionTextRef,
    callback: onResizeCallback,
  });

  const _handleOptionMouseEnter = (index: number) => {
    setHoveredOptionIndex(index);
    setIsMouseHovering(true);
  };

  const _handleOptionMouseLeave = () => {
    setHoveredOptionIndex(-1);
    setIsMouseHovering(false);
  };

  const _handleOptionClick = (option: ComboBoxInputOption) => {
    onSelectedOptionChange(option.value);
  };

  React.useEffect(() => {
    const scrollToElem = selectedOptionRef.current || firstOptionRef.current;

    if (scrollToElem && designableListElem) {
      designableListElem.scrollTop = scrollToElem.offsetTop;
    }
  }, [designableListElem, designableListDynamicStyling]);

  const selectedOptionIndex = React.useMemo(
    () => filteredOptions.findIndex(option => option.value === value),
    [filteredOptions, value],
  );

  React.useEffect(() => {
    const scrollToElem =
      hoveredOptionRef.current ||
      selectedOptionRef.current ||
      firstOptionRef.current;

    if (!isMouseHovering && hoveredOptionIndex !== -1) {
      if (hoveredOptionIndex >= prevHoveredOptionIndex) {
        scrollDownToOption({
          optionEl: scrollToElem,
          listEl: designableListElem,
        });
      } else {
        scrollUpToOption({
          optionEl: scrollToElem,
          listEl: designableListElem,
          hoveredOptionIndex,
        });
      }
    }
  }, [
    hoveredOptionIndex,
    prevHoveredOptionIndex,
    designableListElem,
    isMouseHovering,
  ]);

  const getOptionRef = (optionIDX: number) => {
    if (optionIDX === selectedOptionIndex) {
      return selectedOptionRef;
    }

    if (optionIDX === 0) {
      return firstOptionRef;
    }

    return optionIDX === hoveredOptionIndex ? hoveredOptionRef : undefined;
  };

  const firstOptionWithTextIDX = React.useMemo(
    () => options.findIndex(option => !!option.text),
    [options],
  );
  const getOptionTextRef = (optionIDX: number) =>
    optionIDX === firstOptionWithTextIDX ? optionTextRef : undefined;

  return (
    <div
      id={getComboBoxInputListModalId(id)}
      {...getDataAttributes(props)}
      className={classNames(style.designableListWrapper, className)}
      tabIndex={-1}
    >
      <div
        ref={elem => {
          setExternalDesignableListElem(elem);
          setDesignableListElem(elem);
        }}
        data-testid={testIds.designableList}
        className={style.designableList}
        role="listbox"
        style={{ ...designableListDynamicStyling } as React.CSSProperties}
      >
        {options.map((option, idx) => (
          <div
            key={idx}
            id={`menuitem-${idx}`}
            ref={getOptionRef(idx)}
            className={classNames(style.option, {
              [style.hovered]: hoveredOptionIndex === idx,
            })}
            onClick={() => _handleOptionClick(option)}
            onMouseEnter={() => _handleOptionMouseEnter(idx)}
            onMouseLeave={() => _handleOptionMouseLeave()}
            data-testid={testIds.designableListOption}
            role="option"
            aria-selected={option.value === value}
            style={option.style}
          >
            <div ref={getOptionTextRef(idx)} className={style.optionText}>
              {option.text}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComboBoxInputListModal;
