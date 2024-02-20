export const POPUP_URL = 'https://ecom.wix.com/storefront/cartwidgetPopup';
export const EMPTY_CART_GUID = '00000000-000000-000000-000000000000';
export const CART_ICON_APP_NAME = 'wixstores-cart-icon';

export const cartIconTranslationPath = (baseUrl: string, locale = 'en') =>
  `${baseUrl}assets/locale/cartIcon/cartIcon_${locale}.json`;

export const experiments = {
  USE_LIGHTBOXES: 'specs.stores.UseLightboxes',
  NoCssInOOIBundle: 'specs.stores.NoCssInOOIBundle',
  CartIconNoCssInOOIBundle: 'specs.stores.CartIconNoCssInOOIBundle',
  CartIconEditorFlowMigrate: 'specs.stores.CartIconEditorFlowMigrate',
  ShouldShowZeroUntilLoadCartIcon: 'specs.stores.ShouldShowZeroUntilLoadCartIcon',
  UseCartCache: 'specs.stores.UseCartCache',
  ShouldSetUndefinedUntilLoadCart: 'specs.stores.ShouldSetUndefinedUntilLoadCart',
  ShouldUseMemberIdAsCacheKey: 'specs.stores.ShouldUseMemberIdAsCacheKey',
};

// eslint-disable-next-line no-shadow
export enum FedopsInteraction {
  ADD_TO_CART = 'velo-add-to-cart',
  ADD_ITEMS_TO_CART = 'velo-add-items-to-cart',
  GET_CART_FROM_CACHE = 'get-cart-from-cache',
  GET_CART_FROM_SERVER = 'get-cart-from-server',
  GET_DB = 'get-db',
  GET_CART_FROM_CACHE_SUCCESS = 'get-cart-from-cache-success',
  GET_CART_FROM_CACHE_ERROR = 'get-cart-from-cache-error',
  GET_CART_FROM_CACHE_EXPIRED = 'get-cart-from-cache-expired',
  GET_CART_FROM_CACHE_EMPTY = 'get-cart-from-cache-empty',
  PARSE_JSON = 'parse-json',
  GET_CART_DATA = 'get-cart-data',
  GET_CART_WITHOUT_CACHE = 'get-cart-without-cache',
  GET_CART_FROM_CACHE_UNDEFINED = 'get-cart-from-cache-undefined',
}

export const origin = 'cart-icon';
