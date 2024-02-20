import classNames from 'clsx';
import * as React from 'react';
import { customCssClasses } from '@wix/editor-elements-common-utils';
import { IArrow } from '../../ComboBoxInput.types';
import semanticClassNames from '../../ComboBoxInput.semanticClassNames';

export const Arrow: React.FunctionComponent<IArrow> = props => {
  const { styles, isOpen } = props;

  return (
    <div className={styles.arrow}>
      <div
        className={classNames(styles.svgContainer, {
          [styles.arrowOpen]: isOpen,
        })}
      >
        <svg
          className={classNames(
            styles.icon,
            customCssClasses(semanticClassNames.icon),
          )}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 9.2828 4.89817"
          aria-hidden="true"
        >
          <path d="M4.64116,4.89817a.5001.5001,0,0,1-.34277-.13574L.15727.86448A.50018.50018,0,0,1,.84282.136L4.64116,3.71165,8.44.136a.50018.50018,0,0,1,.68555.72852L4.98393,4.76243A.5001.5001,0,0,1,4.64116,4.89817Z" />
        </svg>
      </div>
    </div>
  );
};
