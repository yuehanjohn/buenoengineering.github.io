/* istanbul ignore file */
import {CustomCssVarsFn} from '@wix/yoshi-flow-editor';
import {baseCustomCssVars, CustomCssVarsFnParams} from '../../baseCustomCssVars';
import {createStylesParams, StyleParamType} from '@wix/tpa-settings';
import {baseStylesParams, galleryColumnsDefaultValue} from '../../styleParams/baseStylesParams';
import {IStylesParams, StylesParamKeys} from '../../styleParams/types';

export const customCssVars: CustomCssVarsFn = (params: CustomCssVarsFnParams) => {
  return {
    ...baseCustomCssVars(params),
  };
};

const stylesParams: IStylesParams = {
  ...baseStylesParams,
  galleryColumns: {
    type: StyleParamType.Number,
    inheritDesktop: false,
    getDefaultValue: ({dimensions, isMobile}) => (isMobile ? 1 : galleryColumnsDefaultValue({dimensions})),
  },
};

export default createStylesParams<StylesParamKeys>(stylesParams);
