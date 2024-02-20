import * as React from 'react';
import classnames from 'clsx';
import style from './style/GoogleMap.scss';

// Skins extra markup
const LiftedShadowSkin: React.FC = () => (
  <>
    <div className={classnames(style.left, style.shd)} />
    <div className={classnames(style.right, style.shd)} />
  </>
);
const SloppyBordersSkin: React.FC = () => (
  <>
    <div className={classnames(style.brd, style.one)} />
    <div className={classnames(style.brd, style.two)} />
  </>
);

export const SKIN_BORDERS = {
  GoogleMapLiftedShadow: LiftedShadowSkin,
  GoogleMapSloppy: SloppyBordersSkin,
  GoogleMapSkin: () => <></>,
  GoogleMapDefault: () => <></>,
};
