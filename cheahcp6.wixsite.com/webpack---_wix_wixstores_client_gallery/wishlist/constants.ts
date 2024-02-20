import {ADD_FREE_PRODUCTS_PUBLIC_DATA_KEYS} from '@wix/wixstores-client-storefront-sdk/dist/es/src/services/AddToCartService/constants';

export const translationPath = (baseUrl: string, locale: string) =>
  `${baseUrl}assets/locale/gallery/gallery_${locale}.json`;

export const PublicDataKeys = {
  ADD_TO_CART: 'gallery_addToCartText',
  ALLOW_FREE_PRODUCTS: ADD_FREE_PRODUCTS_PUBLIC_DATA_KEYS.ALLOW_FREE_PRODUCTS,
  EMPTY_STATE_LINK: 'gallery_emptyStateLink',
  LOAD_MORE_BUTTON: 'LOAD_MORE_BUTTON',
  NO_PRODUCTS_MESSAGE: 'gallery_noProductsMessage',
  OUT_OF_STOCK: 'gallery_oosButtonText',
  PRODUCT_NAME_HTML_TAG: 'gallery_productNameHtmlTag',
  SUBTITLE_TEXT: 'gallery_subtitleText',
  TITLE_TEXT: 'gallery_titleText',
} as const;

export enum GQLOperations {
  GetWishlist = 'getWishlist',
  GetAppSettings = 'getAppSettings',
}

export const ORIGIN = 'wishlist';

export const WISHLIST_FEDOPS_APP_NAME = 'wishlist';

export const WISHLIST_BI_APP_NAME = 'wishlistGalleryApp';

export enum GalleryViewMode {
  LIVE_SITE = 0,
  EDITOR_EMPTY_STATE = 1,
  EDITOR_DEMO_STATE = 2,
}

export enum WishlistFedopsEvent {
  RemoveFromWishlist = 'remove-from-wishlist',
  AddToCart = 'add-to-cart-wishlist',
}
