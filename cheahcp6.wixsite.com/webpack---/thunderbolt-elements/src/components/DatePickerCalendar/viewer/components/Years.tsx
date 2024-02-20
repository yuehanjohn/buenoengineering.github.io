import * as React from 'react';
import classNames from 'clsx';
import { keyCodes } from '@wix/editor-elements-common-utils';
import style from '../styles/Years.scss';
import { ICalendarYearsProps } from '../../DatePickerCalendar.types';
import { YEARS_LIST } from '../../constants';

const Years: React.FC<ICalendarYearsProps> = props => {
  const { year, onYearChange, shouldFocusSelectedYear, exitYearsMode } = props;

  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const selectedItemRef = React.useRef<HTMLLIElement>(null);

  React.useEffect(() => {
    if (shouldFocusSelectedYear) {
      selectedItemRef.current?.focus();
    }
  }, [shouldFocusSelectedYear]);
  React.useLayoutEffect(() => {
    if (wrapperRef.current && selectedItemRef.current) {
      wrapperRef.current.scrollTop =
        selectedItemRef.current.offsetTop -
        wrapperRef.current.offsetHeight / 2 +
        selectedItemRef.current.offsetHeight / 2;
    }
  }, []);

  React.useEffect(() => {
    selectedItemRef.current?.focus();
  }, [year]);

  const onYearKeyDown: React.KeyboardEventHandler = e => {
    const { keyCode } = e;
    const minYear = YEARS_LIST[0];
    const maxYear = YEARS_LIST[YEARS_LIST.length - 1];
    e.stopPropagation();
    e.preventDefault();

    switch (keyCode) {
      case keyCodes.arrowDown:
        if (year < maxYear) {
          onYearChange({ selectedYear: year + 1, exitYearsMode: false });
        }
        break;
      case keyCodes.arrowUp:
        if (year > minYear) {
          onYearChange({ selectedYear: year - 1, exitYearsMode: false });
        }
        break;
      case keyCodes.pageDown:
        if (year + 10 <= maxYear) {
          onYearChange({ selectedYear: year + 10, exitYearsMode: false });
        } else {
          onYearChange({ selectedYear: maxYear, exitYearsMode: false });
        }
        break;
      case keyCodes.pageUp:
        if (year - 10 >= minYear) {
          onYearChange({ selectedYear: year - 10, exitYearsMode: false });
        } else {
          onYearChange({ selectedYear: minYear, exitYearsMode: false });
        }
        break;
      case keyCodes.home:
        onYearChange({
          selectedYear: minYear,
          exitYearsMode: false,
        });
        break;
      case keyCodes.end:
        onYearChange({
          selectedYear: maxYear,
          exitYearsMode: false,
        });
        break;
      case keyCodes.enter:
        onYearChange({ selectedYear: year, exitYearsMode: true });
        break;
      case keyCodes.escape:
        exitYearsMode();
        e.stopPropagation();
        break;
      default:
        break;
    }
  };

  const getYear = (_year: number) => {
    const isSelected = _year === year;
    return (
      <li
        key={_year}
        role="option"
        ref={isSelected ? selectedItemRef : null}
        aria-selected={isSelected}
        className={classNames({
          [style.selected]: isSelected,
        })}
        onClick={() =>
          onYearChange({ selectedYear: _year, exitYearsMode: true })
        }
        tabIndex={0}
      >
        <span>{_year}</span>
      </li>
    );
  };

  return (
    <div data-testid="years" ref={wrapperRef} className={style.years}>
      <ul onKeyDown={onYearKeyDown} role="listbox">
        {YEARS_LIST.map(getYear)}
      </ul>
    </div>
  );
};

export default Years;
