import * as React from 'react';
import classNames from 'clsx';
import {
  customCssClasses,
  getAriaAttributes,
} from '@wix/editor-elements-common-utils';
import { INativeInputProps } from '../../ComboBoxInput.types';
import { Arrow } from '../Arrow/Arrow';
import semanticClassNames from '../../ComboBoxInput.semanticClassNames';
import nativeInputStyle from './NativeInput.scss';

const NativeInput: React.ForwardRefRenderFunction<
  HTMLInputElement,
  INativeInputProps
> = (props, ref) => {
  const {
    autocomplete,
    className,
    styles,
    id,
    placeholder,
    onFocus,
    onBlur,
    onMouseDown,
    onKeyDown,
    disabled,
    required,
    value,
    filterQuery,
    isOpen,
    setWrapperRef,
    onClick,
    ariaAttributes,
    onInput,
    isValid,
    shouldShowValidityIndication,
    options,
    deviceType,
  } = props;

  const getValue = () => {
    return filterQuery || options.find(option => option.value === value)?.text;
  };

  const isTablet = React.useMemo(() => deviceType === 'Tablet', [deviceType]);

  /**
   * Ghost input is needed in case the input is of type "button", in order to display native browser
   * warning popper on submit when the input is invalid (required + missing)
   */
  const ghostInput = React.useMemo(
    () =>
      isTablet && !autocomplete ? (
        <div className={nativeInputStyle.ghostInputWrapper}>
          <input
            value={value}
            required={required}
            className={nativeInputStyle.ghostInput}
            tabIndex={-1}
          />
        </div>
      ) : null,
    [isTablet, autocomplete, value, required],
  );

  return (
    <div ref={setWrapperRef} className={styles.selectorWrapper}>
      <input
        className={classNames(customCssClasses(semanticClassNames.input), {
          [className]: true,
          [styles.invalid]: shouldShowValidityIndication && !isValid,
        })}
        aria-invalid={shouldShowValidityIndication && !isValid}
        data-testid="input-trigger"
        onClick={onClick}
        onKeyDown={onKeyDown}
        placeholder={placeholder.text}
        value={getValue()}
        disabled={disabled}
        required={required}
        onMouseDown={onMouseDown}
        type={isTablet && !autocomplete ? 'button' : 'text'}
        role="combobox"
        {...getAriaAttributes(ariaAttributes)}
        aria-haspopup="listbox"
        aria-required={required}
        aria-disabled={disabled}
        aria-autocomplete="list"
        aria-expanded={isOpen}
        aria-controls={id}
        onInput={onInput}
        onBlur={onBlur}
        onFocus={onFocus}
        ref={ref}
      />
      {ghostInput}
      <Arrow styles={styles} isOpen={isOpen} />
    </div>
  );
};

export default React.forwardRef(NativeInput);
