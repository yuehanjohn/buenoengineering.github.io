import * as React from 'react';
import { ComboBoxInputOption } from '@wix/thunderbolt-components';
import { getDataAttributes } from '@wix/editor-elements-common-utils';
import {
  IComboBoxInputImperativeActions,
  IComboBoxInputProps,
} from '../ComboBoxInput.types';
import ComboBoxInputBase from './ComboBoxInputBase';
import styles from './style/ComboBoxInput.scss';

const ComboBoxInputSkin: React.ForwardRefRenderFunction<
  IComboBoxInputImperativeActions,
  IComboBoxInputProps
> = (props, ref) => {
  const { options, keepInputHeightEnabled } = props;
  const [filteredOptions, setFilteredOptions] =
    React.useState<Array<ComboBoxInputOption>>(options);
  const resetFilteredOptions = () => {
    setFilteredOptions(options);
  };

  React.useEffect(() => {
    setFilteredOptions(options);
  }, [options]);

  return (
    <ComboBoxInputBase
      ref={ref}
      {...props}
      filteredOptions={filteredOptions}
      setFilteredOptions={setFilteredOptions}
      resetFilteredOptions={resetFilteredOptions}
      styles={styles}
    >
      {({
        id,
        className,
        onDblClick,
        onMouseEnter,
        onMouseLeave,
        content,
        inlineError,
      }: {
        id: string;
        className: string;
        onDblClick: React.MouseEventHandler<HTMLDivElement>;
        onMouseEnter: React.MouseEventHandler<HTMLDivElement>;
        onMouseLeave: React.MouseEventHandler<HTMLDivElement>;
        content: any;
        inlineError: any;
      }) => (
        <div
          id={id}
          {...getDataAttributes(props)}
          {...(!keepInputHeightEnabled && { className })}
          onDoubleClick={onDblClick}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          {keepInputHeightEnabled ? (
            <>
              <div className={className}>{content}</div>
              {inlineError}
            </>
          ) : (
            content
          )}
        </div>
      )}
    </ComboBoxInputBase>
  );
};

export default React.forwardRef(ComboBoxInputSkin);
