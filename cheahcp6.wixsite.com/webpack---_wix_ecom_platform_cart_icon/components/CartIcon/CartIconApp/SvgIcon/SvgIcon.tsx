/* eslint-disable @typescript-eslint/unbound-method */
import React, {PropsWithChildren} from 'react';
import styles from './SvgIcon.scss';
// eslint-disable-next-line import/no-cycle
import {IconProps} from '../Icons/Icons';
import classNames from 'classnames';

export interface ISvgIconProps extends IconProps {
  viewBox: string;
  preserveAspectRatio: boolean;
}

export class SvgIcon extends React.PureComponent<PropsWithChildren<ISvgIconProps>> {
  public render(): React.ReactNode {
    const proportion = this.calculateProportion();
    const preserveAspectRatio = this.props.preserveAspectRatio ? {preserveAspectRatio: 'xMinYMax meet'} : {};
    const classes = classNames({
      [styles.ie11Hack]: true,
    });
    return (
      <div className={classes} style={{paddingBottom: `${proportion}%`}} data-hook="svg-icon-wrapper">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          width="100%"
          height="100%"
          viewBox={this.props.viewBox}
          {...preserveAspectRatio}
          data-hook={`svg-icon-${this.props.iconId}`}>
          {this.props.children}
        </svg>
      </div>
    );
  }

  private calculateProportion() {
    const [, , vbWidth, vbHeight] = this.props.viewBox.split(' ');

    return (parseFloat(vbHeight) / parseFloat(vbWidth)) * 100;
  }
}
