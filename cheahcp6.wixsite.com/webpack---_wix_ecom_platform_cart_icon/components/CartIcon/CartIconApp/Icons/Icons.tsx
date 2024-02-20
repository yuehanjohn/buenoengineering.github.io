import React from 'react';
import classNames from 'classnames';
// eslint-disable-next-line import/no-cycle
import {IconRebuilder} from '../IconRebuilder/IconRebuilder';
// eslint-disable-next-line import/no-cycle
import {SvgIcon} from '../SvgIcon/SvgIcon';

export interface IconProps {
  count: number;
  s: {[key: string]: string};
  iconId: number;
  text?: string;
  containerHeight: number;
  containerWidth: number;
  aspectRatio?: number;
}

export const Icon1 = (props: IconProps) => (
  <SvgIcon viewBox="5.7 0 105.5 126.1" preserveAspectRatio={true} {...props}>
    <path d="M99.8 28.4c0-1.2-0.9-2-2.1-2h-15c0 3.2 0 7.6 0 8.2 0 1.5-1.2 2.6-2.6 2.9 -1.5 0.3-2.9-0.9-3.2-2.3 0-0.3 0-0.3 0-0.6 0-0.9 0-4.7 0-8.2H40.1c0 3.2 0 7.3 0 8.2 0 1.5-1.2 2.9-2.6 2.9 -1.5 0-2.9-0.9-3.2-2.3 0-0.3 0-0.3 0-0.6 0-0.6 0-5 0-8.2h-15c-1.2 0-2 0.9-2 2L8.3 124c0 1.2 0.9 2.1 2.1 2.1h96.3c1.2 0 2.1-0.9 2.1-2.1L99.8 28.4z" />
    <path d="M59.1 5.9c-2.9 0-2 0-2.9 0 -2 0-4.4 0.6-6.4 1.5 -3.2 1.5-5.9 4.1-7.6 7.3 -0.9 1.8-1.5 3.5-1.8 5.6 0 0.9-0.3 1.5-0.3 2.3 0 1.2 0 2.1 0 3.2 0 1.5-1.2 2.9-2.6 2.9 -1.5 0-2.9-0.9-3.2-2.3 0-0.3 0-0.3 0-0.6 0-1.2 0-2.3 0-3.5 0-3.2 0.9-6.4 2-9.4 1.2-2.3 2.6-4.7 4.7-6.4 3.2-2.9 6.7-5 11.1-5.9C53.5 0.3 55 0 56.7 0c1.5 0 2.9 0 4.4 0 2.9 0 5.6 0.6 7.9 1.8 2.6 1.2 5 2.6 6.7 4.4 3.2 3.2 5.3 6.7 6.4 11.1 0.3 1.5 0.6 3.2 0.6 4.7 0 1.2 0 2.3 0 3.2 0 1.5-1.2 2.6-2.6 2.9s-2.9-0.9-3.2-2.3c0-0.3 0-0.3 0-0.6 0-1.2 0-2.6 0-3.8 0-2.3-0.6-4.4-1.8-6.4 -1.5-3.2-4.1-5.9-7.3-7.3 -1.8-0.9-3.5-1.8-5.9-1.8C61.1 5.9 59.1 5.9 59.1 5.9L59.1 5.9z" />
    {props.count !== undefined && (
      <text x="58.5" y="77" dy=".35em" textAnchor="middle" className={props.s.quantity} data-hook="items-count">
        {props.count}
      </text>
    )}
  </SvgIcon>
);

export const Icon2 = (props: IconProps) => (
  <SvgIcon viewBox="0 0 197.7 166" preserveAspectRatio={true} {...props}>
    <path d="M197.9 55.9L169.9 127.4 64.5 127.4 27.6 29.8 0 29.8 0.2 16.7 36.5 16.7 73.4 114.3 160.9 114.3 183 55.9"></path>
    <circle cx="143.8" cy="153" r="13"></circle>
    <circle cx="90.8" cy="153" r="13"></circle>
    {props.count !== undefined && (
      <text
        data-hook="items-count"
        className={classNames(props.s.quantity, props.s.withoutBackground)}
        textAnchor="middle"
        x="116"
        y="35"
        dy=".48em">
        {props.count}
      </text>
    )}
  </SvgIcon>
);

export const Icon3 = (props: IconProps) => (
  <IconRebuilder
    initialViewBoxWidth={120}
    initialViewBoxHeight={105}
    text={props.text}
    aspectRatio={props.aspectRatio!}>
    {({width, height, textRef, textLength}) => (
      <SvgIcon viewBox={`0 0 ${width} ${height}`} preserveAspectRatio={true} {...props}>
        <g data-hook="movable" transform={`translate(${textLength})`}>
          <circle className={props.s.bubble} cx="70" cy="50" r="50" />
          {props.count !== undefined && (
            <text x="70" y="50%" dy=".32em" textAnchor="middle" className={props.s.quantity} data-hook="items-count">
              {props.count}
            </text>
          )}
        </g>
        <text x="0" y="50%" dy=".35em" ref={textRef} data-hook="free-text">
          {props.text}
        </text>
      </SvgIcon>
    )}
  </IconRebuilder>
);

export const Icon4 = (props: IconProps) => (
  <IconRebuilder initialViewBoxWidth={0} initialViewBoxHeight={105} text={props.text} aspectRatio={props.aspectRatio!}>
    {({width, height, textRef}) => (
      <SvgIcon viewBox={`0 0 ${width} ${height}`} preserveAspectRatio={true} {...props}>
        <text x="0" y="83" ref={textRef} data-hook="free-text">
          {`${props.text!} `}
          {props.count !== undefined && (
            <tspan className={classNames(props.s.quantity, props.s.withoutBackground)} data-hook="items-count">
              ({props.count})&rlm;
            </tspan>
          )}
        </text>
      </SvgIcon>
    )}
  </IconRebuilder>
);

export const Icon5 = (props: IconProps) => (
  <IconRebuilder
    initialViewBoxWidth={315}
    initialViewBoxHeight={129}
    aspectRatio={props.aspectRatio!}
    text={props.text}>
    {({width, height, textRef, textLength}) => (
      <SvgIcon viewBox={`0 0 ${width} ${height}`} preserveAspectRatio={true} {...props}>
        <path d="M70.9 128.6c-8.3 0-15.5-7.1-15.5-15.5s7.1-15.5 15.5-15.5 15.5 7.1 15.5 15.5-7.1 15.5-15.5 15.5zm0-20.8c-3 0-5.4 2.4-5.4 5.4s2.4 5.4 5.4 5.4 5.4-2.4 5.4-5.4-2.4-5.4-5.4-5.4zM115.3 128.7c-8.3 0-15.5-7.1-15.5-15.5s7.1-15.5 15.5-15.5 15.5 7.1 15.5 15.5-7.1 15.5-15.5 15.5zm0-20.8c-3 0-5.4 2.4-5.4 5.4s2.4 5.4 5.4 5.4 5.4-2.4 5.4-5.4-2.4-5.4-5.4-5.4z"></path>
        <path d="M135.1 88.1L51.2 88.1 22 10.1 0 10.1 0 0 29.1 0 58.6 78.1 127.7 78.1 145.8 29.1 36.9 29.1 33.3 19 160.7 19z"></path>
        <text x="184" y="95" ref={textRef} data-hook="free-text">
          {props.text}
        </text>
        <g data-hook="movable" transform={`translate(${textLength})`}>
          {props.count !== undefined && (
            <text
              x="212"
              y="95"
              textAnchor="start"
              className={classNames(props.s.quantity, props.s.withoutBackground)}
              data-hook="items-count">
              {props.count}
            </text>
          )}
        </g>
      </SvgIcon>
    )}
  </IconRebuilder>
);

export const Icon6 = (props: IconProps) => (
  <SvgIcon viewBox="0 0 329.7 134.5" preserveAspectRatio={false} {...props}>
    <path
      className={props.s.bubble}
      d="M281.6 3c35.7 10.7 56 47.6 45.2 83.3s-47.6 56-83.3 45.2c-35.7-10.7-56-47.6-45.2-83.3C209 13.1 245.9-7.2 281.6 3z"></path>
    {props.count !== undefined && (
      <text x="265" y="69" dy=".35em" textAnchor="middle" className={props.s.quantity} data-hook="items-count">
        {props.count}
      </text>
    )}
    <path d="M74.1 134.4c-8.7 0-16.2-7.4-16.2-16.2S65.3 102 74.1 102s16.2 7.4 16.2 16.2-7.4 16.2-16.2 16.2zm0-21.7c-3.1 0-5.6 2.5-5.6 5.6s2.5 5.6 5.6 5.6 5.6-2.5 5.6-5.6-2.5-5.6-5.6-5.6zM120.5 134.5c-8.7 0-16.2-7.4-16.2-16.2s7.4-16.2 16.2-16.2 16.2 7.4 16.2 16.2-7.4 16.2-16.2 16.2zm0-21.7c-3.1 0-5.6 2.5-5.6 5.6s2.5 5.6 5.6 5.6c3.1 0 5.6-2.5 5.6-5.6s-2.5-5.6-5.6-5.6z"></path>
    <path d="M141.2 92.1L53.5 92.1 23 10.6 0 10.6 0 0 30.4 0 61.2 81.6 133.5 81.6 152.4 30.4 38.5 30.4 34.8 19.9 167.9 19.9z"></path>
  </SvgIcon>
);

export const Icon7 = (props: IconProps) => (
  <IconRebuilder
    initialViewBoxWidth={140}
    initialViewBoxHeight={200}
    text={props.text}
    aspectRatio={props.aspectRatio!}>
    {({width, height, textLength, textRef}) => (
      <SvgIcon viewBox={`0 0 ${width} ${height}`} preserveAspectRatio={false} {...props}>
        <g data-hook="movable" transform={`translate(${textLength})`}>
          <path
            className={props.s.bubble}
            d="M88.7 4.121c-35.7-10.7-73.2 10.1-83.3 45.2 -5.4 17.9-2.4 36.9 6 51.8l-7.7 26.2 25-6c6.5 5.4 14.3 8.9 22.6 11.3 35.7 10.7 73.2-10.1 83.3-45.2C144.6 51.721 124.4 14.221 88.7 4.121z"
          />
          {props.count !== undefined && (
            <text x="70" y="70" dy=".35em" textAnchor="middle" className={props.s.quantity} data-hook="items-count">
              {props.count}
            </text>
          )}
        </g>
        <text x="0" y="178" data-hook="free-text" ref={textRef}>
          {props.text}
        </text>
      </SvgIcon>
    )}
  </IconRebuilder>
);

export const Icon8 = (props: IconProps) => (
  <SvgIcon viewBox="221.4 359.3 267 123" preserveAspectRatio={false} {...props}>
    <rect x="221.4" y="403.7" width="152.4" height="6" />
    <path d="M345.9 482.3h-96.4c-1.2 0-2.4-1.2-3-2.4l-19.6-70.8 6-1.8 19.1 68.5h92.3l19-68.5 6 1.8 -19.6 70.8C348.2 481.1 347 482.3 345.9 482.3z" />
    <rect
      x="259"
      y="380.1"
      transform="matrix(-0.527 -0.8498 0.8498 -0.527 109.9867 827.3946)"
      width="52.4"
      height="6"
    />
    <rect x="292.3" y="424.5" width="10.7" height="10.7" />
    <rect x="315.5" y="424.5" width="10.7" height="10.7" />
    <rect x="269.1" y="424.5" width="10.7" height="10.7" />
    <rect x="292.3" y="447.7" width="10.7" height="10.7" />
    <rect x="315.5" y="447.7" width="10.7" height="10.7" />
    <rect x="269.1" y="447.7" width="10.7" height="10.7" />
    {props.count !== undefined && (
      <text
        x="390"
        y="474"
        textAnchor="start"
        className={classNames(props.s.quantity, props.s.withoutBackground)}
        data-hook="items-count">
        {props.count}
      </text>
    )}
  </SvgIcon>
);

export const Icon9 = (props: IconProps) => (
  <SvgIcon viewBox="0 0 164.9 196.4" preserveAspectRatio={true} {...props}>
    {props.count !== undefined && (
      <text
        x="84"
        y="131"
        dy=".35em"
        textAnchor="middle"
        className={classNames(props.s.quantity, props.s.withoutBackground)}
        data-hook="items-count">
        {props.count}
      </text>
    )}
    <path d="M81.9 11.5c-18.8 0-34.1 16-34.1 35.7v18.1h7.8V47.2c0-15.4 11.8-27.9 26.4-27.9 14.5 0 26.4 12.5 26.4 27.9v18.1h6.6V64h1.1V47.2c-.1-19.7-15.4-35.7-34.2-35.7z"></path>
    <path d="M156.9 70.5v118H8v-118h148.9m8-8H0v134h164.9v-134z"></path>
  </SvgIcon>
);

export const Icon10 = (props: IconProps) => (
  <SvgIcon viewBox="163.7 331.4 267.8 178.8" preserveAspectRatio={true} {...props}>
    <path d="M243.4 425.1l-29.7-47.9 -9.1 5.6 26.2 42.2h-67.1v10.7h3l19.1 70.2c0.6 2.4 3 4.2 5.4 4.2h97c2.4 0 4.2-1.8 4.2-3.6l19.6-70.8h4.2v-10.7H243.4zM221.4 473.3v10.7h-10.7V473.3H221.4zM210.7 461.4v-10.7h10.7v10.7H210.7zM244.7 473.3v10.7h-10.7V473.3H244.7zM233.9 461.4v-10.7h10.7v10.7H233.9zM257.8 484V473.3h10.7v10.7H257.8zM268.5 461.4h-10.7v-10.7h10.7V461.4z" />
    <path
      className={props.s.bubble}
      d="M383.4 334c35.7 10.7 56 47.6 45.2 83.3 -10.7 35.7-47.6 56-83.3 45.2 -35.7-10.7-56-47.6-45.2-83.3C310.7 344.2 348.2 323.9 383.4 334z"
    />
    {props.count !== undefined && (
      <text x="365" y="400" dy=".35em" textAnchor="middle" className={props.s.quantity} data-hook="items-count">
        {props.count}
      </text>
    )}
  </SvgIcon>
);

export const Icon11 = (props: IconProps) => (
  <SvgIcon viewBox="0 0 136 134.5" preserveAspectRatio={true} {...props}>
    <path
      d="M87.1 3c35.7 10.7 56 47.6 45.2 83.3s-47.6 56-83.3 45.2C13.3 120.8-7 83.9 3.8 48.2 14.5 13.1 51.4-7.2 87.1 3z"
      className={props.s.bubble}></path>
    {props.count !== undefined && (
      <text x="70" y="70" dy=".35em" className={props.s.quantity} data-hook="items-count" textAnchor="middle">
        {props.count}
      </text>
    )}
  </SvgIcon>
);
