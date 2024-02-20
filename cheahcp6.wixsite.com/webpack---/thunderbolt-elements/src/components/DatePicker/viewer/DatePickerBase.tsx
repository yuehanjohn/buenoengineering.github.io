import * as React from 'react';
import classNames from 'clsx';
import { createPortal } from 'react-dom';
import {
  DatePickerDate,
  areDatesEqual,
} from '@wix/editor-elements-corvid-utils';
import {
  customCssClasses,
  HAS_CUSTOM_FOCUS_CLASSNAME,
  keyCodes,
  getAriaAttributes,
  getDataAttributes,
} from '@wix/editor-elements-common-utils';
import {
  IDatePickerImperativeActions,
  IDatePickerCalendarProps,
  IDatePickerBaseProps,
} from '../DatePicker.types';
import { getFormattedDate, translateHtmlValidationMessage } from '../utils';
import DatePickerCalendar from '../../DatePickerCalendar/viewer/DatePickerCalendar';
import { usePrevious } from '../../../providers/usePrevious';
import { usePortalWrapper } from '../../../providers/usePortalWrapper';
import { WithTabbingTrap } from '../../../providers/WithTabbingTrap';
import { usePortalPopper } from '../../../providers/usePortalPopper';
import semanticClassNames from '../WIP_DatePicker.semanticClassNames';
import style from './styles/DatePicker.scss';
import CalendarIcon from './assets/calendar.svg';

const noop = () => {};

const DatePickerBase: React.ForwardRefRenderFunction<
  IDatePickerImperativeActions,
  IDatePickerBaseProps
> = (props, ref) => {
  const {
    translations,
    id,
    skin,
    label,
    placeholder,
    dateFormat = 'YYYY/MM/DD',
    readOnly,
    required,
    isDisabled,
    useTodayAsDefaultValue,
    className,
    customClassNames = [],

    minDate,
    maxDate,
    allowPastDates,
    allowFutureDates,
    disabledDates = [],
    enabledDateRanges = null,
    disabledDateRanges = [],
    disabledDaysOfWeek = [],
    weekStartDay = 0,

    isValid,
    shouldShowValidityIndication,
    validateValue = noop,
    validateValueAndShowIndication = noop,
    onBlur = noop,
    onFocus = noop,
    onClick = noop,
    onDblClick = noop,
    onMouseEnter = noop,
    onMouseLeave = noop,
    onChange = noop,

    NavbarComponent,
    isCompactMode,
    isResponsive,
    value: valueFromProps,
    onValueChange = noop,
    isOpen = false,
    isToggle = noop,
    timeZone,

    externallyOpenCalendar,
    externallyCloseCalendar,
    shouldOpenCloseCalendar,
    selectedDateInCalendar,
    withCalendarPortal,
    templateId,
    setUseTodayAsDefaultValue,
    onViewChange = noop,
    calendarLoading,
    calendarError,

    ariaAttributes,
    scopedClassName,
  } = props;
  const withCalendarPopper = withCalendarPortal && !isCompactMode;

  const {
    setRef: setPopperSourceEl,
    setPopper: setPopperTargetElem,
    styles,
    attributes,
  } = usePortalPopper<HTMLInputElement>({
    id: `${id}-calendar`,
    containerId: 'SITE_CONTAINER',
    shouldMountWrapper: isOpen,
    className: scopedClassName,
    popperOptions: {
      placement: 'bottom',
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: [0, isCompactMode ? 0 : 22],
          },
        },
        {
          name: 'flip',
          options: {
            fallbackPlacements: ['top'],
          },
        },
      ],
    },
  });

  const { wrapperEl: calendarPortalWrapper } = usePortalWrapper({
    compId: `${id}-calendar`,
    containerId: 'SITE_CONTAINER',
    shouldMount: isOpen,
    className: scopedClassName,
  });
  const value = React.useMemo(
    () =>
      typeof valueFromProps === 'string'
        ? new Date(valueFromProps)
        : valueFromProps,
    [valueFromProps],
  );

  const [isFocused, setIsFocused] = React.useState<boolean>(false);
  const prevIsFocused = usePrevious(isFocused);
  const [shouldDiscardFocusEvent, setShouldDiscardFocusEvent] =
    React.useState<boolean>(false);
  const isBlurred = !isFocused && !isOpen;
  const prevIsBlurred = usePrevious(isBlurred);

  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (useTodayAsDefaultValue && !value) {
      timeout = setTimeout(() => {
        const date = new DatePickerDate({
          type: 'Now',
          timeZone: timeZone || 'Local',
        }).getAsDate('Local');
        onValueChange(date);
        validateValue();
        setUseTodayAsDefaultValue(false);
      }, 0);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [
    onValueChange,
    validateValue,
    setUseTodayAsDefaultValue,
    useTodayAsDefaultValue,
    value,
    timeZone,
  ]);

  React.useImperativeHandle(ref, () => {
    return {
      focus: () => {
        inputRef.current?.focus();
        setIsFocused(true);
      },
      blur: () => {
        closeCancelCalendar({ focusInput: false });
        inputRef.current?.blur();
        setIsFocused(false);
      },
      setCustomValidity: message => {
        if (message.type === 'message') {
          inputRef.current?.setCustomValidity(message.message);
        } else {
          inputRef.current?.setCustomValidity(
            translateHtmlValidationMessage(message, props.translations),
          );
        }
      },
      getValidationMessage: () => {
        return inputRef.current?.validationMessage;
      },
    };
  });

  const _onClick: React.MouseEventHandler<HTMLElement> = event => {
    if (isDisabled) {
      return;
    }
    onClick(event);
    _onFocus({
      ...event,
      type: 'focus',
    } as any as React.FocusEvent<HTMLInputElement>);

    if (isOpen) {
      closeCancelCalendar();
    } else {
      openCalendar();
    }
  };

  const _onDblClick: React.MouseEventHandler<HTMLElement> = event => {
    if (!isDisabled) {
      onDblClick(event);
    }
  };

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

  const _onFocus: React.FocusEventHandler<HTMLInputElement> = () => {
    if (isDisabled || readOnly) {
      return;
    }
    setIsFocused(true);

    if (shouldDiscardFocusEvent) {
      setShouldDiscardFocusEvent(false);
    }
  };

  React.useEffect(() => {
    if (isBlurred && prevIsBlurred === false) {
      onBlur({
        type: 'blur',
        compId: id,
      } as any);
    }
  }, [isBlurred, prevIsBlurred, onBlur, id]);

  React.useEffect(() => {
    if (isFocused && prevIsFocused === false) {
      onFocus({
        type: 'focus',
        compId: id,
      } as any);
    }
  }, [isFocused, prevIsFocused, onFocus, id]);

  const _onBlur: React.FocusEventHandler<HTMLInputElement> = () => {
    setIsFocused(false);
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = event => {
    if (event.keyCode === keyCodes.enter || event.keyCode === keyCodes.space) {
      if (!isOpen) {
        openCalendar();
      }
      event.preventDefault();
    }
    if (event.keyCode === keyCodes.escape && isOpen) {
      closeCancelCalendar();
      event.stopPropagation();
    }
  };

  const getCalendarId = () => {
    return `portal-${templateId}`;
  };

  const popperPropsForCalendar = withCalendarPopper
    ? {
        popperRef: setPopperTargetElem,
        popperStyles: styles.popper,
        popperAttributes: attributes.popper,
      }
    : {};

  const getPropsForCalendar = (): IDatePickerCalendarProps => ({
    translations,
    id: getCalendarId(),
    skin,
    value: selectedDateInCalendar || value,
    minDate,
    maxDate,
    allowPastDates,
    allowFutureDates,
    disabledDates,
    enabledDateRanges,
    disabledDateRanges,
    disabledDaysOfWeek,
    weekStartDay,
    isCompactMode,
    inputWrapperRef: wrapperRef,
    onApply: closeApplyCalendar,
    onCancel: closeCancelCalendar,
    onClick,
    onDblClick,
    NavbarComponent,
    onMouseEnter,
    onMouseLeave,
    isResponsive,
    timeZone,
    ...popperPropsForCalendar,
    onViewChange,
    calendarLoading,
    calendarError,
  });

  const openCalendar = (forceOpen = false) => {
    if ((isDisabled || readOnly) && !forceOpen) {
      return;
    }
    isToggle(true);
    setIsFocused(true);

    externallyOpenCalendar?.();
  };

  const closeApplyCalendar = (newValue: Date) => {
    if (!value || !areDatesEqual(newValue, value)) {
      onValueChange(newValue);
      validateValueAndShowIndication();
      onChange({
        type: 'change',
        compId: id,
      } as any);
    }
    closeCancelCalendar();
  };

  const closeCancelCalendar = ({ focusInput } = { focusInput: true }) => {
    let timeout: NodeJS.Timeout;
    isToggle(false);
    if (focusInput) {
      // setTimeout because of bug in iOS ECL-674
      timeout = setTimeout(() => {
        setShouldDiscardFocusEvent(true);
        inputRef.current?.focus();
      }, 0);
    } else {
      setIsFocused(false);
    }
    externallyCloseCalendar?.();

    // @ts-expect-error
    return timeout;
  };

  React.useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (shouldOpenCloseCalendar === 'open') {
      openCalendar(true);
    } else if (shouldOpenCloseCalendar === 'close') {
      timeout = closeCancelCalendar({ focusInput: false });
    }

    return () => {
      clearTimeout(timeout);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldOpenCloseCalendar]);

  const containerClasses = classNames(
    style[skin],
    className,
    customCssClasses(semanticClassNames.root, ...customClassNames),
    {
      [style.requiredIndication]: required,
      [style.invalid]: !!shouldShowValidityIndication && !isValid,
      [style.disabled]: isDisabled,
      [style.readonly]: readOnly,
      [style.focused]: isFocused || isOpen,
      [style.responsive]: isResponsive,
    },
  );

  const stringValue = value ? getFormattedDate(value, dateFormat) : '';

  const getCalendarComp = () =>
    withCalendarPortal ? (
      calendarPortalWrapper &&
      createPortal(
        <WithTabbingTrap
          removeFromTabFlow
          onTabOutFromBottom={closeCancelCalendar}
        >
          <DatePickerCalendar {...getPropsForCalendar()} />
        </WithTabbingTrap>,
        calendarPortalWrapper,
      )
    ) : (
      <DatePickerCalendar {...getPropsForCalendar()} />
    );

  return (
    <div id={id} className={containerClasses} {...getDataAttributes(props)}>
      <div
        data-testid="wrapper"
        ref={wrapperRef}
        className={style.labelWrapper}
        onClick={_onClick}
        onDoubleClick={_onDblClick}
        onMouseEnter={_onMouseEnter}
        onMouseLeave={_onMouseLeave}
      >
        <label
          id={`date-picker-label-${id}`}
          onClick={e => e.preventDefault()}
          style={
            {
              '--labelDisplay': !label ? 'none' : 'inline-block',
            } as React.CSSProperties
          }
          htmlFor={`input_${id}`}
          className={classNames(
            style.label,
            customCssClasses(semanticClassNames.label),
          )}
        >
          {label}
        </label>
        <div
          className={style.inputWrapper}
          {...(withCalendarPopper && {
            ref: setPopperSourceEl as React.Dispatch<
              React.SetStateAction<HTMLDivElement | null>
            >,
          })}
        >
          <input
            ref={inputRef}
            id={`input_${id}`}
            type="text"
            className={classNames(
              style.input,
              HAS_CUSTOM_FOCUS_CLASSNAME,
              customCssClasses(semanticClassNames.input),
            )}
            value={stringValue}
            onChange={() => {}}
            onBlur={_onBlur}
            onFocus={_onFocus}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            readOnly={readOnly}
            required={required}
            disabled={isDisabled}
            aria-labelledby={`date-picker-label-${id}`}
            {...getAriaAttributes(ariaAttributes)}
          />
          <button
            aria-label={translations.titleContent}
            className={style['icon-button']}
            aria-haspopup="true"
          >
            <CalendarIcon
              className={customCssClasses(semanticClassNames.icon)}
            />
          </button>
        </div>
      </div>
      {isOpen && getCalendarComp()}
    </div>
  );
};

export default React.forwardRef(DatePickerBase);
