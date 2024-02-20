import { withCompController } from '@wix/editor-elements-integrations';
import { getValidationControllerProps } from '@wix/editor-elements-common-utils';
import type {
  IComboBoxInputControllerProps,
  IComboBoxInputMapperProps,
  IComboBoxInputProps,
  IComboBoxInputStateValues,
} from '../ComboBoxInput.types';

export default withCompController<
  IComboBoxInputMapperProps,
  IComboBoxInputControllerProps,
  IComboBoxInputProps,
  IComboBoxInputStateValues
>(({ mapperProps, controllerUtils, stateValues }) => {
  const { updateProps } = controllerUtils;
  const { scopedClassName } = stateValues;

  const { setValidityIndication, onValueChange } =
    getValidationControllerProps(updateProps);

  return {
    ...mapperProps,
    onSelectedOptionChange: onValueChange,
    setValidityIndication,
    onFilterQueryChange: filterQuery => {
      updateProps({ filterQuery });
    },
    onOpenedChange: opened => {
      updateProps({ opened });
    },
    scopedClassName,
  };
});
