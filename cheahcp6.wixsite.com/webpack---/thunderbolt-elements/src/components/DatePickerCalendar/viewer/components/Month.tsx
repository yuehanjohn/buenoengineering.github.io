import * as React from 'react';
import classNames from 'clsx';
import {
  DatePickerDate,
  getGridOfDaysInMonth,
  areDatesEqual,
  isDateDisabled,
  convertDateRangesArray,
  convertDateStringToDate,
} from '@wix/editor-elements-corvid-utils';
import style from '../styles/Month.scss';
import { ICalendarMonthProps, DayName } from '../../DatePickerCalendar.types';

const useIsDisabled = ({
  date,
  enabledDateRanges,
  disabledDateRanges,
  allowFutureDates,
  allowPastDates,
  minDate,
  maxDate,
  disabledDates,
  disabledDaysOfWeek,
  todayDate,
  dayOfWeek,
}: {
  date: Date;
  dayOfWeek: number;
} & Pick<
  IDayCellProps,
  | 'enabledDateRanges'
  | 'disabledDateRanges'
  | 'allowFutureDates'
  | 'allowPastDates'
  | 'minDate'
  | 'maxDate'
  | 'disabledDates'
  | 'disabledDaysOfWeek'
  | 'todayDate'
>) => {
  const isDisabledByEnabledDateRanges = React.useMemo(
    () => isDateDisabled(date, { enabledDateRanges }),
    [date, enabledDateRanges],
  );

  const isDisabledByDisabledDateRanges = React.useMemo(
    () => isDateDisabled(date, { disabledDateRanges }),
    [date, disabledDateRanges],
  );

  const isDisabledByDisabledDates = React.useMemo(
    () => isDateDisabled(date, { disabledDates }),
    [date, disabledDates],
  );

  const isDisabledByDisabledDaysOfWeek = React.useMemo(
    () => isDateDisabled(date, { dayOfWeek, disabledDaysOfWeek }),
    [date, dayOfWeek, disabledDaysOfWeek],
  );

  const isDisabledByAllowPastDates = React.useMemo(
    () => isDateDisabled(date, { allowPastDates, todayDate }),
    [allowPastDates, date, todayDate],
  );

  const isDisabledByAllowFutureDates = React.useMemo(
    () => isDateDisabled(date, { allowFutureDates, todayDate }),
    [allowFutureDates, date, todayDate],
  );

  const isDisabledByMinDate = React.useMemo(
    () => isDateDisabled(date, { minDate }),
    [date, minDate],
  );

  const isDisabledByMaxDate = React.useMemo(
    () => isDateDisabled(date, { maxDate }),
    [date, maxDate],
  );

  return (
    isDisabledByEnabledDateRanges ||
    isDisabledByDisabledDateRanges ||
    isDisabledByDisabledDates ||
    isDisabledByDisabledDaysOfWeek ||
    isDisabledByAllowPastDates ||
    isDisabledByAllowFutureDates ||
    isDisabledByMinDate ||
    isDisabledByMaxDate
  );
};
const DayHeaderCell: React.FC<{ dayName: DayName }> = ({ dayName }) => {
  return (
    <th key={dayName.shortName} role="columnheader">
      <span aria-hidden="true">{dayName.shortName}</span>
      <span data-testid="sr-only" className={style.srOnly}>
        {dayName.longName}
      </span>
    </th>
  );
};

export type DayCellDateRange = {
  startDate: Date;
  endDate: Date;
};

type IDayCellProps = Pick<
  ICalendarMonthProps,
  | 'value'
  | 'allowPastDates'
  | 'allowFutureDates'
  | 'disabledDaysOfWeek'
  | 'year'
  | 'month'
  | 'onDayChange'
> & {
  day: number | undefined;
  minDate?: Date;
  maxDate?: Date;
  todayDate: Date;
  disabledDates: Array<Date>;
  enabledDateRanges: Array<DayCellDateRange> | null;
  disabledDateRanges: Array<DayCellDateRange>;
  isLoadingMode?: boolean;
};

const DayCell: React.FC<IDayCellProps> = props => {
  const {
    value,
    minDate,
    maxDate,
    todayDate,
    allowPastDates,
    allowFutureDates,
    disabledDaysOfWeek,
    disabledDates,
    enabledDateRanges,
    disabledDateRanges,
    year,
    month,
    onDayChange,
    day,
    isLoadingMode,
  } = props;

  const date = React.useMemo(
    () => new Date(year, month, day),
    [year, month, day],
  );

  const dayOfWeek = React.useMemo(() => date.getDay(), [date]);

  const isDisabled = useIsDisabled({
    date,
    dayOfWeek,
    todayDate,
    minDate,
    maxDate,
    allowPastDates,
    allowFutureDates,
    disabledDaysOfWeek,
    disabledDates,
    enabledDateRanges,
    disabledDateRanges,
  });

  if (!day) {
    return <td></td>;
  }

  const isSelected = value && areDatesEqual(value, date);
  const isToday = areDatesEqual(date, todayDate);

  const tdClassNames = classNames({
    [style.disabled]: isDisabled,
    [style.loadingMode]: isLoadingMode,
    [style.selected]: isSelected,
    [style.today]: isToday,
  });

  return (
    <td
      data-testid={isToday ? 'today' : undefined}
      className={tdClassNames}
      aria-selected={isSelected}
    >
      <button
        onClick={() => onDayChange(day)}
        disabled={isDisabled || isLoadingMode}
      >
        <span className={style.text}>{day}</span>
      </button>
    </td>
  );
};

const Month: React.FC<ICalendarMonthProps> = props => {
  const {
    translations,
    value: valueFromProps,
    minDate,
    maxDate,
    allowPastDates,
    allowFutureDates,
    disabledDates,
    enabledDateRanges,
    disabledDateRanges,
    disabledDaysOfWeek,
    weekStartDay,
    year,
    month,
    onDayChange,
    timeZone,
    isLoadingMode,
  } = props;

  const value = React.useMemo(
    () =>
      typeof valueFromProps === 'string'
        ? new Date(valueFromProps)
        : valueFromProps,
    [valueFromProps],
  );

  const shiftedDayNames = [
    ...translations.dayNames!.slice(weekStartDay),
    ...translations.dayNames!.slice(0, weekStartDay),
  ];

  const dayHeaders = shiftedDayNames.map((dayName, index) => (
    <DayHeaderCell key={index} dayName={dayName}></DayHeaderCell>
  ));

  const memoizedDisabledDates = React.useMemo(
    () => disabledDates.map(date => new Date(date)),
    [disabledDates],
  );

  const todayDate = React.useMemo(
    () =>
      new DatePickerDate({
        type: 'Now',
        timeZone: timeZone || 'Local',
      }).getAsDate('Local'),
    [timeZone],
  );

  const memoizedEnabledDateRanges = React.useMemo(
    () =>
      enabledDateRanges !== null
        ? convertDateRangesArray(enabledDateRanges, convertDateStringToDate)
        : null,
    [enabledDateRanges],
  );

  const memoizedDisabledDateRanges = React.useMemo(
    () => convertDateRangesArray(disabledDateRanges, convertDateStringToDate),
    [disabledDateRanges],
  );

  const minDateAsDate = minDate ? new Date(minDate) : undefined;
  const maxDateAsDate = maxDate ? new Date(maxDate) : undefined;

  const daysGrid = React.useMemo(
    () => getGridOfDaysInMonth(year, month, weekStartDay),
    [year, month, weekStartDay],
  );

  const days = daysGrid.map((week, weekIndex) => (
    <tr key={weekIndex} role="row">
      {week.map((_day, index) => (
        <DayCell
          key={index}
          year={year}
          month={month}
          day={_day}
          value={value}
          allowPastDates={allowPastDates}
          allowFutureDates={allowFutureDates}
          disabledDaysOfWeek={disabledDaysOfWeek}
          onDayChange={onDayChange}
          minDate={minDateAsDate}
          maxDate={maxDateAsDate}
          todayDate={todayDate}
          disabledDates={memoizedDisabledDates}
          enabledDateRanges={memoizedEnabledDateRanges}
          disabledDateRanges={memoizedDisabledDateRanges}
          isLoadingMode={isLoadingMode}
        ></DayCell>
      ))}
    </tr>
  ));

  return (
    <table data-testid="month" role="table" className={style.month}>
      <thead>
        <tr>{dayHeaders}</tr>
      </thead>
      <tbody>{days}</tbody>
    </table>
  );
};

export default Month;
