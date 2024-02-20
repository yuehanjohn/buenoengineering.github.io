import * as React from 'react';
import { ICalendarErrorProps } from '../../DatePickerCalendar.types';
import InfoIcon from '../assets/infoIcon.svg';
import style from '../styles/CalendarError.scss';

const CalendarError: React.FunctionComponent<ICalendarErrorProps> = ({
  calendarError,
  translations,
}) => {
  return (
    <div>
      {calendarError && (
        <div className={style.calendarError}>
          <InfoIcon className={style.calendarErrorIcon} />
          <div className={style.calendarErrorText}>
            {translations.calendarError}
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarError;
