import * as React from 'react';
import classNames from 'clsx';
import {
  customCssClasses,
  useDomDirection,
} from '@wix/editor-elements-common-utils';
import { CSSProperties } from 'react';
import SingleSideArrowIcon from '../assets/singleSideArrow.svg';
import DoubleSideArrowIcon from '../assets/doubleSideArrow.svg';
import { ICalendarNavbarWithSkinProps } from '../../DatePickerCalendar.types';
import { TranslationKeys } from '../../../DatePicker/constants';
import semanticClassNames from '../../../DatePicker/WIP_DatePicker.semanticClassNames';

const Navbar: React.FC<ICalendarNavbarWithSkinProps> = props => {
  const {
    skin,
    isCompactMode,
    year,
    month,
    onYearChange,
    onMonthChange,
    onCurrentYearClick,
    style,
    yearButtonRef,
    translations,
  } = props;

  const { direction, directionRef } = useDomDirection<HTMLDivElement>();
  const cssVars = {
    '--calendarNavRotate': direction === 'rtl' ? '180deg' : '0',
  } as CSSProperties;

  const [shouldAutoFocus, setShouldAutoFocus] = React.useState(false);

  React.useEffect(() => {
    // Delaying autofocus effect to ignore initial popper 0,0 position
    const timeout = setTimeout(() => setShouldAutoFocus(true), 0);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  const monthName =
    translations.monthNames![month][isCompactMode ? 'shortName' : 'longName'];

  const yearButtonContent = (prev: boolean) => {
    switch (skin) {
      case 'DatePickerTextBetweenNavSkin':
        return <SingleSideArrowIcon></SingleSideArrowIcon>;
      case 'DatePickerTextYearNavSkin':
        return year + (prev ? -1 : 1);
      default:
        return <DoubleSideArrowIcon></DoubleSideArrowIcon>;
    }
  };

  const prevYearButton = (
    <button
      data-testid="prevYear"
      aria-label={translations.previousYearNav}
      className={classNames([style.navbtn, style.year, style.prev])}
      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
        onYearChange(year - 1);
        e.preventDefault();
      }}
      key={shouldAutoFocus ? 1 : 0}
      {...(shouldAutoFocus && { autoFocus: true })}
    >
      {yearButtonContent(true)}
    </button>
  );

  const nextYearButton = (
    <button
      data-testid="nextYear"
      aria-label={translations.nextYearNav}
      className={classNames([style.navbtn, style.year, style.next])}
      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
        onYearChange(year + 1);
        e.preventDefault();
      }}
    >
      {yearButtonContent(false)}
    </button>
  );

  const prevMonthButton = (
    <button
      data-testid="prevMonth"
      aria-label={translations.previousMonthNav}
      className={classNames([style.navbtn, style.month, style.prev])}
      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
        onMonthChange(month - 1);
        e.preventDefault();
      }}
    >
      <SingleSideArrowIcon></SingleSideArrowIcon>
    </button>
  );

  const nextMonthButton = (
    <button
      data-testid="nextMonth"
      aria-label={translations.nextMonthNav}
      className={classNames([style.navbtn, style.month, style.next])}
      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
        onMonthChange(month + 1);
        e.preventDefault();
      }}
    >
      <SingleSideArrowIcon></SingleSideArrowIcon>
    </button>
  );

  const splitNavbar = () => (
    <>
      <div className={style.monthWrapper}>
        {prevMonthButton}
        <div data-testid="currentMonth" className={style.currentMonth}>
          {monthName}
        </div>
        {nextMonthButton}
      </div>
      <div className={style.yearWrapper}>
        {prevYearButton}
        <button
          ref={yearButtonRef}
          aria-label={translations.selectedYearAriaLabel!.replace(
            TranslationKeys.datePicker_selected_year_placeholder,
            `${year}`,
          )}
          data-testid="currentYear"
          aria-haspopup="true"
          className={style.currentYear}
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            onCurrentYearClick();
            e.preventDefault();
          }}
        >
          {year}
        </button>
        {nextYearButton}
      </div>
    </>
  );

  const joinedNavbar = () => (
    <>
      {prevYearButton}
      {prevMonthButton}
      <button
        ref={yearButtonRef}
        aria-label={translations.selectedMonthAriaLabel!.replace(
          TranslationKeys.datePicker_selected_month_year_placeholder,
          `${monthName} ${year}`,
        )}
        aria-haspopup="true"
        data-testid="currentMonthYear"
        className={style.currentMonthYear}
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          onCurrentYearClick();
          e.preventDefault();
        }}
      >
        {`${monthName} ${year}`}
      </button>
      {nextMonthButton}
      {nextYearButton}
    </>
  );

  const content =
    skin === 'DatePickerTextBetweenNavSkin' ? splitNavbar() : joinedNavbar();

  return (
    <div
      data-testid="navbar"
      className={classNames(
        style.navbar,
        customCssClasses(semanticClassNames.header),
      )}
      ref={directionRef}
      style={cssVars}
    >
      {content}
    </div>
  );
};

export default Navbar;
