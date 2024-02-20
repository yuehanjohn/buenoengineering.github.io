import * as React from 'react';
import classNames from 'clsx';
import { Ref } from 'react';
import { ComboBoxInputOption } from '@wix/thunderbolt-components';
import {
  customCssClasses,
  HAS_CUSTOM_FOCUS_CLASSNAME,
  getDataAttributes,
} from '@wix/editor-elements-common-utils';
import { InlineErrorMessage } from '@wix/thunderbolt-elements/src/core/inlineErrorMessage';
import {
  IBaseSelectProps,
  IComboBoxInputImperativeActions,
  IComboBoxInputProps,
} from '../ComboBoxInput.types';

import semanticClassNames from '../ComboBoxInput.semanticClassNames';
import CustomSelect from './CustomSelect/CustomSelect';
import NativeSelect from './NativeSelect/NativeSelect';

const noop = () => {};
const skinWithoutLabel = 'ComboBoxInputVerticalMenuSkin';

type IComboBoxInputBaseRenderProp = Pick<
  IComboBoxInputProps,
  'id' | 'onClick' | 'onDblClick' | 'onMouseEnter' | 'onMouseLeave'
> & {
  content: React.ReactNode;
  className: string;
  ariaLabel?: string;
  inlineError?: React.ReactNode;
};

type IComboBoxInputBaseProps = IComboBoxInputProps & {
  styles: { [key: string]: string };
  children(props: IComboBoxInputBaseRenderProp): React.ReactElement;
  filteredOptions?: Array<ComboBoxInputOption>;
  setFilteredOptions?: (options: Array<ComboBoxInputOption>) => void;
  resetFilteredOptions?: () => void;
  className?: string;
  portalClassName?: string;
};

const ComboBoxInputBase: React.ForwardRefRenderFunction<
  IComboBoxInputImperativeActions,
  IComboBoxInputBaseProps
> = (props, ref) => {
  const {
    id,
    className,
    customClassNames = [],
    skin,
    label,
    styles,
    value,
    children,
    required,
    isDisabled,
    placeholder,
    shouldShowValidityIndication,
    errorMessageType,
    validateValueAndShowIndication = noop,
    onBlur = noop,
    onFocus = noop,
    onChange = noop,
    onSelectedOptionChange = noop,
    onClick = noop,
    onDblClick = noop,
    onMouseEnter = noop,
    onMouseLeave = noop,
    designableList = false,
    options,
    setDesignableListElem,
    forceOpenDesignableList = false,
    ariaAttributes,
    isPopupPage,
    autocomplete,
    setFilteredOptions = noop,
    resetFilteredOptions = noop,
    onFilterQueryChange = noop,
    onOpenedChange = noop,
    opened = false,
    filterQuery,
    isValid,
    componentViewMode,
    portalClassName,
    scopedClassName,
    translations,
    deviceType,
    keepInputHeightEnabled,
  } = props;
  const filteredOptions = props.filteredOptions || props.options;

  const inputRef = React.useRef<HTMLInputElement | HTMLSelectElement>(null);

  React.useImperativeHandle(ref, () => {
    return {
      focus: () => {
        inputRef.current?.focus();
      },
      blur: () => {
        inputRef.current?.blur();
        validateValueAndShowIndication();
      },
      setCustomValidity: message => {
        if (message.type === 'message') {
          inputRef.current?.setCustomValidity(message.message);
        }
      },
    };
  });

  const _onMouseEnter: React.MouseEventHandler<HTMLDivElement> = event => {
    if (!isDisabled) {
      onMouseEnter(event);
    }
  };

  const _onMouseLeave: React.MouseEventHandler<HTMLDivElement> = event => {
    if (!isDisabled) {
      onMouseLeave(event);
    }
  };

  const hideLabel = skinWithoutLabel === skin;
  const placeholderValue = placeholder && placeholder.value;
  const isLegacyPlaceholderSelected = value === placeholderValue;
  const isPlaceholderSelected =
    isLegacyPlaceholderSelected || (placeholderValue && value === '');

  const rootClassName = classNames(
    styles[skin],
    styles.root,
    className,
    customCssClasses(semanticClassNames.root, ...customClassNames),
    {
      [styles.hasLabel]: !!label,
      [styles.withRequiredIndication]: required,
      [styles.withValidationIndication]: shouldShowValidityIndication,
    },
    keepInputHeightEnabled ? styles.keepInputHeight : null,
  );

  const selectClassName = classNames(
    styles.select,
    HAS_CUSTOM_FOCUS_CLASSNAME,
    {
      [styles.extendedPlaceholderStyle]: isPlaceholderSelected,
    },
  );

  const _handleOnSelectedOptionChange = (optionValue: string) => {
    onSelectedOptionChange(optionValue);
    validateValueAndShowIndication();

    // onChange expects to get a full React event, but we rely on viewer platform the add target & context.
    onChange({ type: 'change', compId: id } as any);
  };

  const _onBlur = (e: React.FocusEvent) => {
    onBlur(e);
    if (autocomplete) {
      validateValueAndShowIndication();
    }
  };

  const selectProps: IBaseSelectProps = {
    ref: inputRef,
    className: selectClassName,
    styles,
    id,
    onClick,
    onFocus,
    onSelectedOptionChange: _handleOnSelectedOptionChange,
    onBlur: _onBlur,
    disabled: isDisabled,
    required,
    value,
    options,
    placeholder,
    ariaAttributes,
    isPopupPage,
    autocomplete,
    setFilteredOptions,
    resetFilteredOptions,
    filteredOptions,
    onFilterQueryChange,
    onOpenedChange,
    opened,
    filterQuery,
    shouldShowValidityIndication,
    isValid,
    designableList,
    portalClassName,
    scopedClassName,
    deviceType,
  };

  const inlineError = (
    <InlineErrorMessage
      errorMessageType={errorMessageType}
      errorMessage={inputRef.current?.validationMessage}
      shouldShowValidityIndication={shouldShowValidityIndication}
      translations={translations}
      componentViewMode={componentViewMode}
    />
  );

  const content = (
    <>
      {hideLabel ? null : (
        <label
          className={classNames(
            styles.label,
            customCssClasses(semanticClassNames.label),
          )}
          htmlFor={`collection_${id}`}
        >
          {label}
        </label>
      )}
      {designableList ? (
        <CustomSelect
          {...selectProps}
          setDesignableListElem={setDesignableListElem}
          forceOpenDesignableList={forceOpenDesignableList}
        />
      ) : (
        <NativeSelect
          {...selectProps}
          ref={inputRef as Ref<HTMLSelectElement>}
        />
      )}
      {!keepInputHeightEnabled && inlineError}
    </>
  );

  return children({
    id,
    ...getDataAttributes(props),
    className: rootClassName,
    onDblClick,
    onMouseEnter: _onMouseEnter,
    onMouseLeave: _onMouseLeave,
    content,
    ariaLabel: label,
    ...(keepInputHeightEnabled && { inlineError }),
  });
};

export default React.forwardRef(ComboBoxInputBase);
