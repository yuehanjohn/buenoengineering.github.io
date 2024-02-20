import * as React from 'react';
import {
  IDatePickerProps,
  IDatePickerImperativeActions,
} from '../../../DatePicker.types';
import DatePickerBase from '../../DatePickerBase';
import NavbarTextBetweenNavSkin from './NavbarTextBetweenNavSkin';

const DatePickerTextBetweenNavSkin: React.ForwardRefRenderFunction<
  IDatePickerImperativeActions,
  IDatePickerProps
> = (props, ref) => (
  <DatePickerBase
    ref={ref}
    {...props}
    NavbarComponent={NavbarTextBetweenNavSkin}
  ></DatePickerBase>
);

export default React.forwardRef(DatePickerTextBetweenNavSkin);
