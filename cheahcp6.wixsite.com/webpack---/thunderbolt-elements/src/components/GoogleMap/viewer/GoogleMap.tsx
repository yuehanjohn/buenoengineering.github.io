import * as React from 'react';
import classNames from 'clsx';
import {
  customCssClasses,
  getDataAttributes,
  isBrowser,
} from '@wix/editor-elements-common-utils';
import {
  GoogleMapProps,
  IGoogleMapsImperativeActions,
} from '../GoogleMap.types';

import semanticClassNames from '../GoogleMap.semanticClassNames';
import { getComponentProps } from '../../ConsentPolicyWrapper/viewer/utils';
import { useGoogleIFrame } from './hooks';
import { SKIN_BORDERS } from './skinParts';

import style from './style/GoogleMap.scss';

import googleMapHtml from './assets/googleMap.html?resource';
import googleMapsScriptUrl from './assets/google-map.min.js?resource';

const replaceUrlForDesignMode = (url: string): string => {
  return url.replace(
    'https://static.parastorage.com/services/',
    'https://editor.wix.com/_partials/',
  );
};

const getGoogleMapUrl = (
  urlQueries: GoogleMapProps['urlQueries'],
  isDesignerMode?: boolean,
) => {
  const scriptUrl = isDesignerMode
    ? replaceUrlForDesignMode(googleMapsScriptUrl)
    : googleMapsScriptUrl;
  const additionalParams = new URLSearchParams({
    googleMapsScriptPath: new URL(scriptUrl).pathname,
  });
  if (isBrowser()) {
    additionalParams.append('origin', window.origin);
  }
  const baseUrl = isDesignerMode
    ? replaceUrlForDesignMode(googleMapHtml)
    : googleMapHtml;
  return `${baseUrl}?${urlQueries}&${additionalParams}`;
};

const GoogleMap: React.ForwardRefRenderFunction<
  IGoogleMapsImperativeActions,
  GoogleMapProps
> = (props, forwardRef) => {
  const {
    id,
    className,
    customClassNames = [],
    skin,
    urlQueries,
    mapData,
    translations,
    isConsentPolicyActive,
    onUpdateCenter,
    onUpdateZoom,
    onMarkerClicked,
    onMapClicked,
    onMouseEnter,
    onMouseLeave,
    isDesignerMode,
    isEditorMode,
    language,
  } = props;
  const SkinBorders = SKIN_BORDERS[skin];

  const url = getGoogleMapUrl(urlQueries, isDesignerMode);

  const [render, setRender] = React.useState(false);
  const [ref] = useGoogleIFrame(
    forwardRef,
    { mapData, isEditorMode, language },
    {
      onUpdateCenter,
      onUpdateZoom,
      onMarkerClicked,
      onMapClicked,
    },
  );

  React.useEffect(() => {
    setRender(true);
  }, [url]);

  const title = translations.title;

  const baseComponentProps = getComponentProps(isConsentPolicyActive, {
    id,
    className: classNames(
      style[skin],
      style.wixIframe,
      className,
      customCssClasses(semanticClassNames.root, ...customClassNames),
    ),
    ...getDataAttributes(props),
  });

  return (
    <div {...baseComponentProps} tabIndex={0}>
      {render && (
        <wix-iframe title={title} aria-label={title} data-src={url}>
          <SkinBorders />
          <div
            id={`mapContainer_${id}`}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            className={style.mapContainer}
          >
            <iframe
              ref={ref}
              title={title}
              aria-label={title}
              data-src={url}
              width="100%"
              height="100%"
              frameBorder="0"
              scrolling="no"
              allowFullScreen
            />
          </div>
        </wix-iframe>
      )}
    </div>
  );
};

export default React.forwardRef(GoogleMap);
