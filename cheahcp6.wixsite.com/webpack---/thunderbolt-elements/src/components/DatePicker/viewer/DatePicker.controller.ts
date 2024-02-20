import {
  IPlatformData,
  withCompController,
} from '@wix/editor-elements-integrations';
import { getValidationControllerProps } from '@wix/editor-elements-common-utils';
import type {
  IDatePickerMapperProps,
  IDatePickerControllerProps,
  IDatePickerProps,
  IDatePickerStateValues,
} from '../DatePicker.types';

const useComponentProps = ({
  mapperProps,
  stateValues,
  controllerUtils,
}: IPlatformData<
  IDatePickerMapperProps,
  IDatePickerProps,
  IDatePickerStateValues
>): IDatePickerControllerProps => {
  const { isCompactMode, compId, ...restMapperProps } = mapperProps;
  const { updateProps } = controllerUtils;
  const {
    setSiteScrollingBlocked,
    enableCyclicTabbing,
    disableCyclicTabbing,
    scopedClassName,
  } = stateValues;

  let externalHandlers: Pick<
    IDatePickerControllerProps,
    'externallyOpenCalendar' | 'externallyCloseCalendar'
  > = {};

  if (isCompactMode) {
    externalHandlers = {
      externallyOpenCalendar: () => {
        enableCyclicTabbing(compId);
        setSiteScrollingBlocked(true, compId);
      },
      externallyCloseCalendar: () => {
        setSiteScrollingBlocked(false, compId);
        disableCyclicTabbing(compId);
      },
    };
  }

  return {
    ...restMapperProps,
    ...externalHandlers,
    ...getValidationControllerProps(updateProps),
    isCompactMode,
    isToggle: isOpen => {
      updateProps({ isOpen });
    },
    setUseTodayAsDefaultValue: useTodayAsDefaultValue => {
      updateProps({ useTodayAsDefaultValue });
    },
    scopedClassName,
  };
};

export default withCompController(useComponentProps);
