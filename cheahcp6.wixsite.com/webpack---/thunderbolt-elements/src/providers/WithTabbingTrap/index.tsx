import * as React from 'react';
import { WithTabbingTrapProps } from './types';
import style from './style/WithTabbingTrap.scss';

const noop = () => {};

export const WithTabbingTrap: React.FC<WithTabbingTrapProps> = props => {
  const {
    children,
    removeFromTabFlow = false,
    onTabInFromTop = noop,
    onTabInFromBottom = noop,
    onTabOutFromTop = noop,
    onTabOutFromBottom = noop,
  } = props;

  const topExitRef = React.createRef<HTMLDivElement>();
  const bottomExitRef = React.createRef<HTMLDivElement>();
  const topEntranceRef = React.createRef<HTMLDivElement>();
  const bottomEntranceRef = React.createRef<HTMLDivElement>();

  const handleTopTrapOnFocus = (trapLoc: 'Outer' | 'Inner') => {
    if (trapLoc === 'Outer') {
      if (removeFromTabFlow) {
        bottomExitRef.current?.focus();
      } else {
        topEntranceRef.current?.focus();
        onTabInFromTop();
      }
    } else {
      topExitRef.current?.focus();
      onTabOutFromTop();
    }
  };

  const handleBottomTrapOnFocus = (trapLoc: 'Outer' | 'Inner') => {
    if (trapLoc === 'Outer') {
      if (removeFromTabFlow) {
        topExitRef.current?.focus();
      } else {
        bottomEntranceRef.current?.focus();
        onTabInFromBottom();
      }
    } else {
      bottomExitRef.current?.focus();
      onTabOutFromBottom();
    }
  };

  return (
    <React.Fragment>
      <div className={style.invisibleDiv} tabIndex={-1} ref={topExitRef}></div>
      <div
        tabIndex={0}
        className={style.invisibleDiv}
        onFocus={() => handleTopTrapOnFocus('Outer')}
      ></div>
      <div
        className={style.invisibleDiv}
        tabIndex={0}
        onFocus={() => handleTopTrapOnFocus('Inner')}
      ></div>
      <div
        className={style.invisibleDiv}
        tabIndex={-1}
        ref={topEntranceRef}
      ></div>
      {children}
      <div
        className={style.invisibleDiv}
        tabIndex={-1}
        ref={bottomEntranceRef}
      ></div>
      <div
        className={style.invisibleDiv}
        tabIndex={0}
        onFocus={() => handleBottomTrapOnFocus('Inner')}
      ></div>
      <div
        tabIndex={0}
        className={style.invisibleDiv}
        onFocus={() => handleBottomTrapOnFocus('Outer')}
      ></div>
      <div
        className={style.invisibleDiv}
        tabIndex={-1}
        ref={bottomExitRef}
      ></div>
    </React.Fragment>
  );
};
