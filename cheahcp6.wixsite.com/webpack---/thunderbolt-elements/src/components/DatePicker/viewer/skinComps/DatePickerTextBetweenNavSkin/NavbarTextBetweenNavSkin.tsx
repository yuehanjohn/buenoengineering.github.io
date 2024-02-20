import * as React from 'react';
import { IDatePickerCalendarNavbarProps } from '../../../DatePicker.types';
import Navbar from '../../../../DatePickerCalendar/viewer/components/Navbar';
import styles from '../../../../DatePickerCalendar/viewer/styles/NavbarTextBetweenNavSkin.scss';

const NavbarTextBetweenNavSkin: React.FC<
  IDatePickerCalendarNavbarProps
> = props => {
  return <Navbar {...props} style={styles}></Navbar>;
};

export default NavbarTextBetweenNavSkin;
