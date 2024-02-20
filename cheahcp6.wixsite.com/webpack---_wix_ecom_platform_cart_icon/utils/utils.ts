/* eslint-disable prefer-rest-params */
/* eslint-disable prefer-spread */

import _ from 'lodash';

export const wrapTryCatch = (onCatch: any) => (fn: any) => {
  return function () {
    try {
      return fn.apply(null, arguments);
    } catch (e) {
      onCatch?.(e);
    }
  };
};

export const wrapExports = (onCatch: any) => (o: any) => {
  const wrapper = wrapTryCatch(onCatch);
  return _.reduce(
    o,
    (result, value, key) => ({
      [key]: _.isFunction(value) ? wrapper(value) : value,
      ...result,
    }),
    {}
  );
};

export const getCatalogAppId = (lineItems: any) => {
  return [...new Set([...lineItems])]
    .map(({catalogAppId}) => catalogAppId)
    .filter((catalogAppId) => !!catalogAppId)
    .toString();
};
