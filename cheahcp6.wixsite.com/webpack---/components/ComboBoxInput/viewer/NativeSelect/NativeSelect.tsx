import * as React from 'react';
import { ComboBoxInputOption } from '@wix/thunderbolt-components';
import classNames from 'clsx';
import {
  customCssClasses,
  getAriaAttributes,
} from '@wix/editor-elements-common-utils';
import { INativeSelectProps } from '../../ComboBoxInput.types';
import { isOptionWithSelectedText, noop } from '../../utils';
import { OPTIONS_INDEX_OFFSET } from '../../constants';
import { Arrow } from '../Arrow/Arrow';
import semanticClassNames from '../../ComboBoxInput.semanticClassNames';

const NativeSelect: React.ForwardRefRenderFunction<
  HTMLSelectElement,
  INativeSelectProps
> = (props, ref) => {
  const {
    className,
    styles,
    id,
    placeholder,
    onFocus,
    onSelectedOptionChange = noop,
    onBlur,
    onMouseDown,
    onKeyDown,
    disabled,
    required,
    value,
    options,
    isOpen,
    setWrapperRef,
    hoveredOptionIndex = -1,
    onClick,
    ariaAttributes,
    designableList,
    shouldShowValidityIndication,
    isValid,
  } = props;

  const [ssrReadOnly, setSsrReadOnly] = React.useState(true);
  React.useEffect(() => setSsrReadOnly(false), []);

  const [renderedOptions, setRenderedOptions] = React.useState(options);
  const DUPLICATED_VALUE = 'duplicatedValue';

  const generatePlaceholder = () => [
    <option
      value=""
      disabled
      className={classNames(styles.option, styles.placeholder)}
      key="placeholder"
    >
      {placeholder.text}
    </option>,
  ];

  const generateOptions = () => {
    const hasSelectedText = isOptionWithSelectedText(renderedOptions, value);
    return ssrReadOnly
      ? []
      : renderedOptions
          .map((option: ComboBoxInputOption) =>
            option.value === value && hasSelectedText ? (
              [
                <option hidden disabled value={option.value} key={option.key}>
                  {option.selectedText}
                </option>,
                <option
                  value={DUPLICATED_VALUE}
                  original-value={option.value}
                  key={`${option.key}-${option.value}`}
                  aria-selected={true}
                >
                  {option.text}
                </option>,
              ]
            ) : (
              <option
                value={option.value}
                className={styles.option}
                key={option.key}
                aria-selected={option.value === value}
              >
                {option.text}
              </option>
            ),
          )
          .flat();
  };

  const moveSelectedOptionToHeadOfList = React.useCallback(
    (selectedIndex: number, selectedValue: string, optionsOffset: number) => {
      if (renderedOptions[0]?.value === selectedValue) {
        return;
      }
      const unModifiedOptions = options;
      const newRenderedOptions = [...unModifiedOptions];

      const selectedIndexWithOffset = selectedIndex - optionsOffset;
      const optionIndexToRemove =
        newRenderedOptions[selectedIndexWithOffset].value === selectedValue
          ? selectedIndexWithOffset
          : selectedIndexWithOffset - 1;

      const [deletedOption] = newRenderedOptions.splice(optionIndexToRemove, 1);
      newRenderedOptions.unshift(deletedOption);

      setRenderedOptions(newRenderedOptions);
    },
    [renderedOptions, options],
  );

  React.useEffect(() => {
    setRenderedOptions(options);
  }, [options]);

  useRearrangeOptionsOnPropsChange({
    options,
    value,
    moveSelectedOptionToHeadOfList,
  });

  const _onChange: React.ChangeEventHandler<HTMLSelectElement> = event => {
    let val = event.target.value;
    const selectedIndex = event.target.selectedIndex;

    if (val === DUPLICATED_VALUE) {
      val = event.target[selectedIndex].getAttribute(
        'original-value',
      ) as string;
    }
    if (isOptionWithSelectedText(options, val)) {
      moveSelectedOptionToHeadOfList(selectedIndex, val, OPTIONS_INDEX_OFFSET);
    }

    onSelectedOptionChange(val);
  };

  return (
    <div ref={setWrapperRef} className={styles.selectorWrapper}>
      <select
        ref={ref}
        className={classNames(customCssClasses(semanticClassNames.input), {
          [className]: true,
          [styles.invalid]: shouldShowValidityIndication && !isValid,
        })}
        id={`collection_${id}`}
        data-testid="select-trigger"
        onClick={onClick}
        onFocus={onFocus}
        onChange={_onChange}
        onBlur={onBlur}
        onMouseDown={onMouseDown}
        onKeyDown={onKeyDown}
        disabled={disabled}
        required={required}
        aria-required={required}
        value={value}
        {...getAriaAttributes(ariaAttributes)}
        aria-activedescendant={
          hoveredOptionIndex >= 0 ? `menuitem-${hoveredOptionIndex}` : undefined
        }
        aria-expanded={designableList ? isOpen : undefined}
        aria-invalid={shouldShowValidityIndication && !isValid}
      >
        {generatePlaceholder().concat(generateOptions())}
      </select>
      <Arrow styles={styles} isOpen={isOpen} />
    </div>
  );
};

export default React.forwardRef(NativeSelect);

const useRearrangeOptionsOnPropsChange = ({
  value,
  options,
  moveSelectedOptionToHeadOfList,
}: {
  value: INativeSelectProps['value'];
  options: INativeSelectProps['options'];
  moveSelectedOptionToHeadOfList: (
    selectedIndex: number,
    selectedValue: string,
    optionsOffset: number,
  ) => void;
}) => {
  React.useEffect(() => {
    const unModifiedOptions = options;
    const newOptions = [...unModifiedOptions];

    if (value) {
      const matchingOptionIndex = newOptions.findIndex(
        option => option.value === value,
      );
      const matchingOption = newOptions[matchingOptionIndex];

      if (matchingOption?.selectedText) {
        moveSelectedOptionToHeadOfList(
          matchingOptionIndex,
          matchingOption.value,
          0,
        );
      }
    }
  }, [options, value, moveSelectedOptionToHeadOfList]);
};
