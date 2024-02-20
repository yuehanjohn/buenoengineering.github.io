/* eslint-disable @typescript-eslint/unbound-method */
import React from 'react';
import {Icon1, Icon2, Icon3, Icon4, Icon5, Icon6, Icon7, Icon8, Icon9, Icon10, Icon11, IconProps} from './Icons/Icons';
import classNames from 'classnames';
import s from './CartIconApp.scss';
import {ICartIconSantaProps, ICtrlProps} from '../../../types/app-types';
import md5 from 'md5';

export type ICartIconAppProps = ICtrlProps & ICartIconSantaProps;

const icons: {[key: string]: React.ComponentType<IconProps>} = {
  Icon1,
  Icon2,
  Icon3,
  Icon4,
  Icon5,
  Icon6,
  Icon7,
  Icon8,
  Icon9,
  Icon10,
  Icon11,
};

export class CartIconApp extends React.Component<ICartIconAppProps, {count: number}> {
  private readonly anchorRef: React.RefObject<HTMLAnchorElement>;

  constructor(props) {
    super(props);
    this.anchorRef = React.createRef();

    this.onClick = this.onClick.bind(this);
    this.reportAppLoaded = this.reportAppLoaded.bind(this);
    this.state = {
      count: props.shouldSetUndefinedUntilLoadCart ? undefined : props.count,
    };
  }

  public componentDidMount(): void {
    this.props.host.registerToComponentDidLayout(this.reportAppLoaded);
    if (this.state.count !== this.props.count) {
      this.setState({count: this.props.count});
    }
  }

  public componentDidUpdate(prevProps: ICartIconAppProps): void {
    if (this.props.triggerFocus !== prevProps.triggerFocus) {
      this.triggerFocus();
    }
    if (this.state.count !== this.props.count) {
      this.setState({count: this.props.count});
    }
  }

  private reportAppLoaded() {
    if (this.props.isInteractive) {
      this.safeRun(this.props.onAppLoaded);
    }
  }

  private renderIcon(iconId: number, count: number, text: string) {
    const IconComponent = icons[`Icon${iconId}`];
    const {
      viewMode,
      dimensions: {width, height},
    } = this.props.host;
    const aspectRatio = viewMode === 'Site' ? width / height : undefined;

    return (
      <IconComponent
        iconId={iconId}
        count={count}
        text={text}
        s={s}
        aspectRatio={aspectRatio}
        containerHeight={this.props.host.dimensions.height}
        containerWidth={this.props.host.dimensions.width}
      />
    );
  }

  private onClick(event) {
    event.preventDefault();
    if (!this.props.isNavigate) {
      event.stopPropagation();
    }
    this.safeRun(this.props.onIconClick);
  }

  private triggerFocus() {
    this.anchorRef.current && this.anchorRef.current.focus();
    this.safeRun(this.props.onFocusTriggered);
  }

  private safeRun(fn) {
    if (this.props.isInteractive && typeof fn === 'function') {
      fn();
    }
  }

  private componentKey() {
    const {
      host: {
        style: {
          styleParams: {fonts},
        },
      },
    } = this.props;
    return `cart-icon-${md5(JSON.stringify(fonts))}`;
  }

  public render(): React.ReactNode {
    if (!this.props.isLoaded) {
      return null;
    }

    const {ariaLabelLink, cartLink, displayText, isNavigate} = this.props;
    const {count} = this.state;
    const {style} = this.props.host;
    const iconId: number = (style && style.styleParams.numbers.cartWidgetIcon) || 1;
    const classes = classNames(s.cartIconDefaults, s[`cart-icon-${iconId}`], s.cartIconButtonContainer, {
      [s.dozens]: count >= 10 && count <= 99,
      [s.hundreds]: count >= 100,
    });

    return (
      <a
        key={this.componentKey()}
        aria-label={ariaLabelLink}
        className={classes}
        data-hook="cart-icon-button"
        href={cartLink}
        onClick={this.onClick}
        ref={this.anchorRef}
        role={isNavigate ? 'link' : 'button'}>
        {this.renderIcon(iconId, count, displayText)}
      </a>
    );
  }
}
