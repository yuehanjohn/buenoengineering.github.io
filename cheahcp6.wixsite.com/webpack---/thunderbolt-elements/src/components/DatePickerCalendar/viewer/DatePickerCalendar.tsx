import * as React from 'react';
import classNames from 'clsx';
import {
  DatePickerDate,
  getMonthBoundaries,
} from '@wix/editor-elements-corvid-utils';
import { Spinner } from 'wix-ui-tpa/cssVars';
import {
  customCssClasses,
  keyCodes,
  getDataAttributes,
} from '@wix/editor-elements-common-utils';
import { IDatePickerCalendarProps } from '../DatePickerCalendar.types';
import { useClickOutside } from '../../../providers/useClickOutside/useClickOutside';
import semanticClassNames from '../../DatePicker/WIP_DatePicker.semanticClassNames';
import style from './styles/DatePickerCalendar.scss';
import Month from './components/Month';
import Years from './components/Years';
import CalendarError from './components/CalendarError';

const noop = () => {};

const Calendar: React.FC<IDatePickerCalendarProps> = props => {
  const {
    id,
    skin,
    value,
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
    inputWrapperRef,
    className,
    onApply = noop,
    onCancel = noop,
    onClick = noop,
    onDblClick = noop,
    NavbarComponent,
    onMouseEnter = noop,
    onMouseLeave = noop,
    isResponsive,
    timeZone,
    translations,
    popperRef,
    popperAttributes,
    popperStyles,
    onViewChange,
    calendarLoading,
    calendarError,
  } = props;
  const calendarRef = React.useRef<HTMLDivElement>(null);
  const yearButtonRef = React.useRef<HTMLButtonElement>(null);

  const onClickOutside = React.useCallback(() => {
    onCancel({ focusInput: false });
  }, [onCancel]);

  useClickOutside([calendarRef, inputWrapperRef], onClickOutside, true);

  const [isYearsMode, setYearsMode] = React.useState<boolean>(false);
  const [shouldFocusSelectedYear, setShouldFocusSelectedYear] =
    React.useState<boolean>(false);
  const onCurrentYearClick = () => {
    setYearsMode(!isYearsMode);

    if (!isYearsMode) {
      setShouldFocusSelectedYear(true);
    }
  };

  const [year, setYear] = React.useState<number>(2000);
  const [month, setMonth] = React.useState<number>(0);

  React.useEffect(() => {
    const dateForMonthAndYear =
      value ||
      new DatePickerDate({
        type: 'Now',
        timeZone: timeZone || 'Local',
      }).getAsDate('Local');
    setYear(dateForMonthAndYear.getFullYear());
    setMonth(dateForMonthAndYear.getMonth());
  }, [value, timeZone]);

  const onMonthChange = (_month: number) => {
    if (_month < 0) {
      setYear(year - 1);
      setMonth(11);
    } else if (_month > 11) {
      setYear(year + 1);
      setMonth(0);
    } else {
      setMonth(_month);
    }
  };

  const onDayChange = (_day: number) => {
    onApply(new Date(year, month, _day));
  };

  const onYearChange = ({
    selectedYear,
    exitYearsMode,
  }: {
    selectedYear: number;
    exitYearsMode: boolean;
  }) => {
    const updatedValue = value ? new Date(value) : new Date();
    updatedValue.setFullYear(selectedYear);

    if (exitYearsMode) {
      yearButtonRef.current?.focus();
      changeYearFromYearsMode(selectedYear);
    } else {
      setYear(selectedYear);
    }
  };

  const changeYearFromYearsMode = (_year: number) => {
    setYear(_year);
    setYearsMode(false);
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = event => {
    if (event.keyCode === keyCodes.escape) {
      onCancel({ focusInput: true });
      event.stopPropagation();
    }
  };

  const containerClasses = classNames(style.calendarWrapper, className, {
    [style.responsive]: isResponsive,
  });

  const calendarHeight = React.useMemo(
    () => (isCompactMode ? '100%' : 'auto'),
    [isCompactMode],
  );

  const styles: React.CSSProperties = React.useMemo(() => {
    const calendarHeightKey: string = '--calendarHeight';

    const cssStyles = {
      [calendarHeightKey]: calendarHeight,
    };

    return cssStyles;
  }, [calendarHeight]);

  // Using layout effect since we want to call
  // onViewChange as soon as possible, its not a
  // heavy operation so its ok
  React.useLayoutEffect(() => {
    const { startDate, endDate } = getMonthBoundaries({
      year,
      month: month + 1,
      timeZone: timeZone || 'Local',
    });

    onViewChange({
      type: 'onViewChange',
      compId: id,
      options: { startDate, endDate },
    });
  }, [onViewChange, year, month, timeZone, id]);
  return (
    <div
      id={id}
      {...getDataAttributes(props)}
      data-testid="calendar"
      className={containerClasses}
      onClick={onClick}
      onDoubleClick={onDblClick}
      onKeyDown={onKeyDown}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{ ...styles, ...popperStyles }}
      {...popperAttributes}
      ref={popperRef}
    >
      <div className={style.beforeCalendar} />
      <div
        ref={calendarRef}
        className={classNames(
          style.calendar,
          customCssClasses(semanticClassNames.calendar),
        )}
      >
        {calendarLoading && (
          <Spinner className={style.calendarSpinner} isCentered />
        )}
        <NavbarComponent
          skin={skin}
          isCompactMode={isCompactMode}
          year={year}
          month={month}
          onYearChange={_year =>
            onYearChange({ selectedYear: _year, exitYearsMode: false })
          }
          onMonthChange={onMonthChange}
          onCurrentYearClick={onCurrentYearClick}
          yearButtonRef={yearButtonRef}
          translations={translations}
        />
        <div
          className={classNames(style.belowNavBarContent, {
            [style.loadingMode]: calendarLoading,
          })}
        >
          {calendarError && !isYearsMode ? (
            <CalendarError
              calendarError={calendarError}
              translations={translations}
            />
          ) : (
            <>
              {isYearsMode || (
                <Month
                  translations={translations}
                  value={value}
                  minDate={minDate}
                  maxDate={maxDate}
                  allowPastDates={allowPastDates}
                  allowFutureDates={allowFutureDates}
                  disabledDates={disabledDates}
                  enabledDateRanges={enabledDateRanges}
                  disabledDateRanges={disabledDateRanges}
                  disabledDaysOfWeek={disabledDaysOfWeek}
                  weekStartDay={weekStartDay}
                  year={year}
                  month={month}
                  onDayChange={onDayChange}
                  timeZone={timeZone}
                  isLoadingMode={calendarLoading}
                />
              )}
              {isYearsMode && (
                <Years
                  year={year}
                  onYearChange={onYearChange}
                  shouldFocusSelectedYear={shouldFocusSelectedYear}
                  exitYearsMode={() => {
                    yearButtonRef.current?.focus();
                    setYearsMode(false);
                  }}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
