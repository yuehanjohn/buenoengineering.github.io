import type { GoogleMapProps } from '../../GoogleMap.types';

type Locations = GoogleMapProps['mapData']['locations'];
type LocationProps = keyof Locations[0];
export type PinInfo = { pinColor: string; pinIcon: string };

export const shouldKeepMarkers = (
  locations: Locations,
  prevLocations: Locations,
): boolean => {
  if (locations.length !== prevLocations.length) {
    return false;
  }
  return locations.every((location, idx) => {
    const locationKeys = Object.keys(location) as Array<LocationProps>;
    return (
      locationKeys.length === Object.keys(prevLocations[idx]).length &&
      locationKeys.every(p => {
        /**
         * locationLinkAttributes is an object so we can't check it with simple equality operator.
         * So we ignore it.But its ok that its ignored, because this property is bound to
         * link property which has literal string value, so if link is the same, then
         * locationLinkAttributes will be the same as well.
         */
        if (p === 'locationLinkAttributes') {
          return true;
        }
        return location[p] === prevLocations[idx][p];
      })
    );
  });
};

// data-fixer for old URLs created without the isSEOBot option
const fixOldPinUrl = (url: string) => {
  if (url && url.endsWith('.webp')) {
    try {
      const originalExtension = url.match(/media\/[^/]+/)![0].split('.')[1];
      url = url.replace(/.webp$/, `.${originalExtension}`);
    } catch (e) {}
  }
  return url;
};

type PinColor = Locations[0]['pinColor'];
type PinIcon = Locations[0]['pinIcon'];

const getIcon = (pinIcon: PinIcon, pinColor: PinColor) => {
  if (!pinIcon && !pinColor) {
    return undefined;
  }

  if (pinColor) {
    return {
      path: pinIcon,
      fillColor: pinColor,
      strokeColor: pinColor,
      fillOpacity: 1,
      scale: 0.5,
    };
  }

  return fixOldPinUrl(pinIcon);
};

export const fillLocationsWithIcon = (
  locations: GoogleMapProps['mapData']['locations'],
  customPinFallback?: PinInfo,
) =>
  locations.map(location => ({
    ...location,
    icon:
      getIcon(location.pinIcon, location.pinColor) ||
      (customPinFallback &&
        getIcon(customPinFallback.pinIcon, customPinFallback?.pinColor)),
  }));
