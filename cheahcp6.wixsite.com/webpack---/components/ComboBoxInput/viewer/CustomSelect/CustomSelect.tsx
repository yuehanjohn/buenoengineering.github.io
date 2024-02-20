import * as React from 'react';
import { createPortal } from 'react-dom';
import { ChangeEvent, ChangeEventHandler, Ref } from 'react';
import {
  CSS_EDITING_SCOPE_CLASS,
  CSS_EDITING_SCOPE_CONTAINER_ID,
  customCssClasses,
  keyCodes,
} from '@wix/editor-elements-common-utils';
import { useResizeObserver } from '@wix/thunderbolt-elements/src/providers/useResizeObserver';
import { usePortalPopper } from '@wix/thunderbolt-elements/src/providers/usePortalPopper';
import ComboBoxInputListModal from '@wix/thunderbolt-elements/src/components/ComboBoxInputListModal/viewer/ComboBoxInputListModal';
import { useClickOutside } from '@wix/thunderbolt-elements/src/providers/useClickOutside/useClickOutside';
import { CustomPopperProps } from '@wix/thunderbolt-elements/src/providers/usePopper/usePopper';
import { useExpandableListKeyDown } from '@wix/thunderbolt-elements/src/providers/useExpandableListKeyDown/useExpandableListKeyDown';
import { calculateElemWidth, filterOptionsByQuery, noop } from '../../utils';
import NativeSelect from '../NativeSelect/NativeSelect';
import { ICustomSelectProps } from '../../ComboBoxInput.types';
import semanticClassNames from '../../ComboBoxInput.semanticClassNames';
import NativeInput from '../NativeInput/NativeInput';

const popperConfig: CustomPopperProps = {
  placement: 'bottom-start',
  modifiers: [
    {
      name: 'flip',
      options: {
        boundary: 'clippingParents',
        fallbackPlacements: ['top-start', 'bottom-start'],
        allowedAutoPlacements: ['top-start', 'bottom-start'],
      },
    },
    {
      name: 'computeStyles',
      options: {
        roundOffsets: false,
      },
    },
  ],
};

const CustomSelect: React.ForwardRefRenderFunction<
  HTMLSelectElement | HTMLInputElement,
  ICustomSelectProps
> = (props, ref) => {
  const {
    className,
    styles,
    id,
    placeholder,
    onFocus,
    onSelectedOptionChange = noop,
    onBlur,
    disabled,
    required,
    value,
    options,
    setDesignableListElem,
    forceOpenDesignableList,
    onClick,
    ariaAttributes,
    isPopupPage,
    autocomplete,
    filteredOptions = [],
    setFilteredOptions,
    resetFilteredOptions,
    onFilterQueryChange = noop,
    onOpenedChange = noop,
    opened = false,
    filterQuery,
    isValid,
    shouldShowValidityIndication,
    portalClassName,
    scopedClassName,
    deviceType,
  } = props;

  const [designableListWidth, setDesignableListWidth] = React.useState(200);
  const closeListKeyCodes = autocomplete
    ? [keyCodes.enter, keyCodes.escape, keyCodes.tab]
    : [keyCodes.enter, keyCodes.escape, keyCodes.space, keyCodes.tab];
  const { hoveredOptionIndex, setHoveredOptionIndex, onKeyDown } =
    useExpandableListKeyDown({
      isListOpen: opened,
      openListFn: () => onOpenedChange(true),
      closeListFn: () => {
        onOpenedChange(false);
        resetFilteredOptions();
      },
      initialHoveredOptionIndex: placeholder ? -1 : 0,
      openListKeyCodes: [keyCodes.space, keyCodes.enter],
      closeListKeyCodes,
      listLength: filteredOptions.length,
    });

  const {
    ref: designableListSourceElem,
    setRef: setDesignableListSourceElem,
    popper: designableListTargetElem,
    setPopper: setDesignableListTargetElem,
    styles: popperStyles,
    attributes: popperAttributes,
    poppersWrapper: portalPoppersWrapper,
    mountPortalPoppersWrapper,
    unMountPortalPoppersWrapper,
  } = usePortalPopper<HTMLDivElement>({
    id,
    popperOptions: popperConfig,
    className: `${scopedClassName} ${CSS_EDITING_SCOPE_CLASS}`,
    containerId: CSS_EDITING_SCOPE_CONTAINER_ID,
  });

  const shouldOpenDesignableList = React.useMemo(
    () => opened || forceOpenDesignableList,
    [opened, forceOpenDesignableList],
  );
  React.useEffect(() => {
    if (shouldOpenDesignableList) {
      mountPortalPoppersWrapper();
    } else {
      unMountPortalPoppersWrapper();
    }
  }, [
    shouldOpenDesignableList,
    mountPortalPoppersWrapper,
    unMountPortalPoppersWrapper,
  ]);

  useClickOutside([designableListSourceElem, designableListTargetElem], () =>
    onOpenedChange(false),
  );

  const updateDesignableListWidth = React.useCallback(() => {
    if (designableListSourceElem) {
      const currentListWidth = calculateElemWidth(designableListSourceElem);

      if (currentListWidth !== designableListWidth) {
        setDesignableListWidth(currentListWidth);
      }
    }
  }, [designableListSourceElem, designableListWidth]);

  const toggleDesignableList = () => {
    updateDesignableListWidth();

    const selectRef =
      ref as React.MutableRefObject<HTMLSelectElement | null> | null;

    if (!opened) {
      selectRef?.current?.focus();
    }

    onOpenedChange(!opened);
  };

  const handleNativeSelectOnMouseDown: React.MouseEventHandler<
    HTMLSelectElement
  > = e => {
    e.preventDefault();
    toggleDesignableList();
  };

  const handleSearchNavigationWithKey = (
    key: string,
    hoveredOptionIdx: number,
    keyCode: any,
  ) => {
    const searchNavigationBlacklist = [
      keyCodes.enter,
      keyCodes.arrowDown,
      keyCodes.arrowUp,
      keyCodes.arrowLeft,
      keyCodes.arrowRight,
      keyCodes.space,
      keyCodes.escape,
    ];

    if (searchNavigationBlacklist.includes(keyCode)) {
      return;
    }

    const isSearchingOptionWithNewKey =
      key.toLowerCase() !== options[hoveredOptionIndex]?.text[0].toLowerCase();

    const matchingOptionIndex = options.findIndex(
      (option, index) =>
        option.text[0].toLowerCase() === key.toLowerCase() &&
        (index > hoveredOptionIdx || isSearchingOptionWithNewKey),
    );

    if (matchingOptionIndex > -1) {
      handleOnSelectedOptionChange({
        optionValue: options[matchingOptionIndex].value,
        toggleList: false,
      });
      setHoveredOptionIndex(matchingOptionIndex);
    }
  };

  const handleNativeSelectOnKeyDown: React.KeyboardEventHandler<
    HTMLSelectElement
  > = e => {
    const callOnChangeKeyCodes: Array<number> = [
      keyCodes.enter,
      keyCodes.arrowDown,
      keyCodes.arrowUp,
    ];
    const { keyCode, key } = e;
    const handleTabKeyDown = () => {
      if (opened) {
        const selectRef = ref as React.MutableRefObject<HTMLSelectElement>;
        selectRef?.current.focus();
      }
    };
    const additionalActionFn = (
      hoveredOptionIdx: number,
      isHoveredOptionChanged: boolean,
    ) => {
      if (keyCode === keyCodes.tab) {
        handleTabKeyDown();
      }
      if (callOnChangeKeyCodes.includes(keyCode) && isHoveredOptionChanged) {
        handleOnSelectedOptionChange({
          optionValue: options[hoveredOptionIdx].value,
          toggleList: false,
        });
      }

      handleSearchNavigationWithKey(key, hoveredOptionIdx, keyCode);
    };

    onKeyDown(e, additionalActionFn);
  };

  const handleNativeInputOnKeyDown: React.KeyboardEventHandler<
    HTMLInputElement
  > = e => {
    const { keyCode } = e;
    const additionalActionFn = (hoveredOptionIdx: number) => {
      if (keyCode === keyCodes.enter && filteredOptions[hoveredOptionIdx]) {
        handleOnSelectedOptionChange({
          optionValue: filteredOptions[hoveredOptionIdx].value,
          toggleList: false,
        });
        const i = options.findIndex(
          o => o.value === filteredOptions[hoveredOptionIdx].value,
        );
        setHoveredOptionIndex(i);
      }
    };

    onKeyDown(e, additionalActionFn);
  };

  const onInput: ChangeEventHandler<HTMLInputElement> = (
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    handleOnSelectedOptionChange({ optionValue: '', toggleList: false });
    onFilterQueryChange(e.target.value);
    setFilteredOptions(
      e.target.value ? filterOptionsByQuery(e.target.value, options) : options,
    );
    setHoveredOptionIndex(-1);
    if (!opened) {
      onOpenedChange(true);
    }
  };

  const handleOnSelectedOptionChange = ({
    optionValue,
    toggleList = true,
  }: {
    optionValue: string;
    toggleList?: boolean;
  }) => {
    onFilterQueryChange('');
    resetFilteredOptions();
    onSelectedOptionChange(optionValue);

    if (toggleList) {
      toggleDesignableList();
    }
  };

  const onResizeCallback = React.useCallback(() => {
    if (designableListSourceElem) {
      setDesignableListWidth(calculateElemWidth(designableListSourceElem));
    }
  }, [designableListSourceElem]);
  useResizeObserver({
    elem: designableListSourceElem,
    callback: onResizeCallback,
  });

  const commonProps: Pick<
    ICustomSelectProps,
    | 'className'
    | 'styles'
    | 'id'
    | 'onFocus'
    | 'onBlur'
    | 'disabled'
    | 'required'
    | 'value'
    | 'options'
    | 'filteredOptions'
    | 'placeholder'
    | 'onClick'
    | 'ariaAttributes'
    | 'designableList'
    | 'autocomplete'
    | 'deviceType'
    | 'isValid'
    | 'shouldShowValidityIndication'
  > & { isOpen: boolean; hoveredOptionIndex: number } = {
    className,
    styles,
    id,
    onFocus,
    onBlur,
    disabled,
    required,
    value,
    options,
    placeholder,
    isOpen: shouldOpenDesignableList,
    hoveredOptionIndex,
    onClick,
    ariaAttributes,
    filteredOptions,
    autocomplete,
    deviceType,
    isValid,
    shouldShowValidityIndication,
  };

  return (
    <React.Fragment>
      {autocomplete || deviceType === 'Tablet' ? (
        <NativeInput
          {...commonProps}
          setWrapperRef={
            setDesignableListSourceElem as React.LegacyRef<HTMLDivElement>
          }
          ref={ref as Ref<HTMLInputElement>}
          onMouseDown={toggleDesignableList}
          onKeyDown={handleNativeInputOnKeyDown}
          filterQuery={filterQuery}
          onInput={onInput}
        />
      ) : (
        <NativeSelect
          {...commonProps}
          setWrapperRef={
            setDesignableListSourceElem as React.LegacyRef<HTMLDivElement>
          }
          designableList={true}
          ref={ref as Ref<HTMLSelectElement>}
          onMouseDown={handleNativeSelectOnMouseDown}
          onKeyDown={handleNativeSelectOnKeyDown}
        />
      )}
      {portalPoppersWrapper &&
        shouldOpenDesignableList &&
        createPortal(
          <div
            ref={setDesignableListTargetElem}
            className={portalClassName}
            style={{
              ...popperStyles.popper,
              ...{
                width: `${designableListWidth}px`,
                zIndex: isPopupPage
                  ? ('var(--portals-z-index)' as any)
                  : ('var(--above-all-z-index)' as any),
              },
            }}
            {...popperAttributes.popper}
          >
            <ComboBoxInputListModal
              id={id}
              value={value}
              setDesignableListElem={setDesignableListElem}
              onSelectedOptionChange={optionValue =>
                handleOnSelectedOptionChange({ optionValue })
              }
              options={filteredOptions}
              hoveredOptionIndex={hoveredOptionIndex}
              setHoveredOptionIndex={setHoveredOptionIndex}
              filteredOptions={filteredOptions}
              className={customCssClasses(semanticClassNames.list)}
            />
          </div>,
          portalPoppersWrapper,
        )}
    </React.Fragment>
  );
};

export default React.forwardRef(CustomSelect);
