import {
  useMemo,
  useEffect,
  useImperativeHandle,
  ForwardRefRenderFunction,
  useState,
  useRef,
} from 'react';
import {
  useIFrame,
  ISendMessage,
  IFrameEvent,
} from '../../../../providers/useIFrame/useIFrame';
import { usePrevious } from '../../../../providers/usePrevious';
import {
  GoogleMapProps,
  IGoogleMapsImperativeActions,
  GoogleMapSDKActions,
  GoogleMapMarker,
  GoogleMapLanguage,
} from '../../GoogleMap.types';
import { usePromises } from './usePromise';
import { fillLocationsWithIcon, shouldKeepMarkers } from './utils';
import type { PinInfo } from './utils';
import constants from './constants';

type GoogleMapsRef = Parameters<
  ForwardRefRenderFunction<IGoogleMapsImperativeActions, GoogleMapProps>
>[1];

type MessageHandlersByType = Record<string, (payload: any) => void>;
type EventHandlersByType = Record<
  string,
  (args: { event: IFrameEvent; _sendMessage: ISendMessage }) => void
>;

const RTL_LANGUAGES = ['iw', 'ar', 'ur', 'fa'] as const;

export function useGoogleIFrame(
  compRef: GoogleMapsRef,
  {
    mapData,
    language,
    isEditorMode,
  }: {
    mapData: GoogleMapProps['mapData'];
    language: GoogleMapLanguage;
    isEditorMode?: boolean;
  },
  {
    onUpdateZoom,
    onUpdateCenter,
    onMarkerClicked,
    onMapClicked,
  }: Partial<GoogleMapSDKActions>,
): [(node: HTMLIFrameElement) => void] {
  const corvidPromisesToResolve = useRef<Array<() => void>>([]);
  const corvidModifiedLocations = useRef<
    GoogleMapProps['mapData']['locations'] | null
  >(null);

  const defaultLocationPin = useMemo(() => {
    return mapData.defaultLocation !== undefined
      ? {
          pinIcon: mapData.locations[mapData.defaultLocation]?.pinIcon ?? '',
          pinColor: mapData.locations[mapData.defaultLocation]?.pinColor ?? '',
        }
      : undefined;
  }, [mapData.defaultLocation, mapData.locations]);

  const [createGetMarkersPromise, resolveGetMarkersPromise] =
    usePromises<Array<GoogleMapMarker>>();

  const [createSetCenterPromise, resolveSetCenterPromises] = usePromises();
  const [createSetZoomPromise, resolveSetZoomPromises] = usePromises();
  const [createFitBoundsPromise, resolveFitBoundsPromises] = usePromises();
  const [createSetMarkersPromise, resolveSetMarkersPromise] = usePromises();
  const [createInfoWindowPromise, resolveInfoWindowPromise] = usePromises();
  const [createUpdateMarkerPromise, resolveUpdateMarkerPromise] = usePromises();

  const [iframeLoaded, setLoaded] = useState(false);

  const mergeWithCorvidLocations = (
    locations: GoogleMapProps['mapData']['locations'],
    defaultPin?: PinInfo,
  ) => {
    /**
     * If corvid modified the locations,
     * we should use locations state from corvid instead.
     */
    const corvidLocations = corvidModifiedLocations.current;
    return fillLocationsWithIcon(corvidLocations || locations, defaultPin);
  };

  const modifiedMapData = useMemo(
    () => ({
      ...mapData,
      locations: mergeWithCorvidLocations(
        mapData.locations,
        defaultLocationPin,
      ),
    }),
    [mapData, defaultLocationPin],
  );

  const prevMapData = usePrevious(modifiedMapData);

  const messageHandlersByType: MessageHandlersByType = {
    [constants.MESSAGE_CENTER_UPDATED]: payload => onUpdateCenter?.(payload),
    [constants.MESSAGE_ZOOM_UPDATED]: payload =>
      onUpdateZoom?.({ zoom: payload }),
    [constants.MESSAGE_MARKER_CLICKED]: payload =>
      onMarkerClicked?.({ type: 'markerClicked', ...payload }),
    [constants.MESSAGE_MAP_CLICKED]: ({ longitude, latitude, ...rest }) =>
      onMapClicked?.({
        type: 'mapClicked',
        location: { longitude, latitude },
        ...rest,
      }),
    [constants.MESSAGE_MARKERS]: payload => resolveGetMarkersPromise(payload),
    [constants.MESSAGE_MAP_IDLE]: () => {
      const resolve = corvidPromisesToResolve.current.shift();
      resolve?.();
    },
    [constants.MESSAGE_TILES_LOADED]: () => {
      if (!iframeLoaded) {
        setLoaded(true);
      }
    },
    [constants.MESSAGE_SET_MARKER_ICON_FINISHED]: () =>
      resolveUpdateMarkerPromise(),
  };

  const eventHandlersByType: EventHandlersByType = {
    [constants.EVENT_LOAD]: ({ _sendMessage }) => {
      _sendMessage(
        {
          type: constants.MESSAGE_SET_INITIAL_LOCATIONS,
          data: JSON.stringify({
            ...mapData,
            locations: mergeWithCorvidLocations(mapData.locations),
          }),
        },
        { forceSend: true },
      );
      _sendMessage({
        type: constants.SET_DIRECTION,
        data: JSON.stringify({
          direction: (
            RTL_LANGUAGES as Readonly<Array<GoogleMapLanguage>>
          ).includes(language)
            ? 'rtl'
            : 'ltr',
        }),
      });
    },

    [constants.EVENT_MESSAGE]: ({ event }) => {
      if (typeof event.payload === 'string') {
        const { type, data } = JSON.parse(event.payload);
        messageHandlersByType[type]?.(data);
      }
    },
  };

  const reducer = (event: IFrameEvent, _sendMessage: ISendMessage) =>
    eventHandlersByType[event.type]?.({
      event,
      _sendMessage,
    });

  const [ref, sendMessage] = useIFrame({ reducer, iframeLoaded });

  useImperativeHandle(compRef, () => ({
    setMapCenter: (longitude, latitude) => {
      const setCenterPromise = createSetCenterPromise();
      sendMessage({
        type: constants.MESSAGE_SET_CENTER,
        data: JSON.stringify({ longitude, latitude }),
      });
      corvidPromisesToResolve.current.push(resolveSetCenterPromises);
      return setCenterPromise;
    },
    fitBounds: ({ north, east, west, south }) => {
      const fitBoundsPromise = createFitBoundsPromise();
      sendMessage({
        type: constants.MESSAGE_FIT_BOUNDS,
        data: JSON.stringify({ north, east, west, south }),
      });
      corvidPromisesToResolve.current.push(resolveFitBoundsPromises);
      return fitBoundsPromise;
    },
    setMarkerIcon: ({ locations, coordinates, iconOptions }) => {
      const setMarkerIconPromise = createUpdateMarkerPromise();
      corvidModifiedLocations.current = locations;
      sendMessage({
        type: constants.MESSAGE_SET_MARKER_ICON,
        data: JSON.stringify({ ...coordinates, iconOptions }),
      });
      return setMarkerIconPromise;
    },
    setMapZoom: zoom => {
      const setZoomPromise = createSetZoomPromise();
      sendMessage({ type: constants.MESSAGE_SET_ZOOM, data: zoom });
      corvidPromisesToResolve.current.push(resolveSetZoomPromises);
      return setZoomPromise;
    },
    getVisibleMarkers: () => {
      const getMarkersPromise = createGetMarkersPromise();
      sendMessage({ type: constants.MESSAGE_GET_MARKERS });
      return getMarkersPromise;
    },
    openInfoWindow: locationIndex => {
      if (!modifiedMapData.showDirectionsLink) {
        const infoWindowPromise = createInfoWindowPromise();
        sendMessage({
          type: constants.MESSAGE_OPEN_INFO_WINDOW,
          data: JSON.stringify({ locationIndex }),
        });
        corvidPromisesToResolve.current.push(resolveInfoWindowPromise);
        return infoWindowPromise;
      }
      return new Promise(resolve => resolve());
    },
    setMarkers: (locations, options) => {
      const getUpdateMarkersPromise = createSetMarkersPromise();
      corvidModifiedLocations.current = locations;
      sendMessage(
        JSON.stringify({
          ...modifiedMapData,
          locations: fillLocationsWithIcon(locations, defaultLocationPin),
          openInfoWindow: options?.openInfoWindow,
        }),
      );
      corvidPromisesToResolve.current.push(resolveSetMarkersPromise);
      return getUpdateMarkersPromise;
    },
  }));

  useEffect(() => {
    if (!iframeLoaded || !isEditorMode) {
      return;
    }
    /**
     * In Editor settings panel we don't want to update markers/locations
     * if some knobs like zoom are being changed. This improves runtime
     * performance while playing around in the settings panel.
     */
    const shouldKeepLocations =
      !!prevMapData &&
      shouldKeepMarkers(modifiedMapData.locations, prevMapData.locations);

    sendMessage(
      JSON.stringify({
        ...modifiedMapData,
        locations: mergeWithCorvidLocations(
          modifiedMapData.locations,
          defaultLocationPin,
        ),
        shouldKeepMarkers: shouldKeepLocations,
      }),
    );
  }, [
    modifiedMapData,
    sendMessage,
    defaultLocationPin,
    iframeLoaded,
    prevMapData,
    isEditorMode,
  ]);

  return [ref];
}
