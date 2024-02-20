/* eslint-disable import/no-cycle */
import {DEFAULT_MOBILE_PRODUCTS_COUNT, DEFAULT_AUTO_GRID_PRODUCTS_COUNT, MAX_ROWS, MAX_COLS} from '../constants';

export function getInitialProductsCountToFetch({
  isMobile,
  isEditor,
  isAutoGrid,
  rows,
  cols,
  autoGridProductsCount,
  isGalleryRowsAndColsWereModified,
  isFixedProductsCountModified,
}: {
  isMobile: boolean;
  isEditor: boolean;
  isAutoGrid: boolean;
  rows: number;
  cols: number;
  autoGridProductsCount: number;
  isGalleryRowsAndColsWereModified: Boolean;
  isFixedProductsCountModified: Boolean;
}) {
  if (isEditor) {
    return isAutoGrid ? DEFAULT_AUTO_GRID_PRODUCTS_COUNT : MAX_ROWS * MAX_COLS;
  }
  if (isAutoGrid) {
    return autoGridProductsCount;
  }
  if (isMobile && !isGalleryRowsAndColsWereModified && !isFixedProductsCountModified) {
    return DEFAULT_MOBILE_PRODUCTS_COUNT;
  }
  return Math.round(rows * cols);
}

export const safeDecode = (str: string) => {
  let decoded;
  try {
    decoded = decodeURIComponent(str).replace(/\+/g, ' ');
  } catch {
    //All of our filter query params can be decoded, this only happens when users add custom query params and there's no need to alert it.
  }
  return decoded;
};

export const roundStyleParams = (styleParams) => {
  if (!styleParams?.numbers || !Object.keys(styleParams?.numbers).length) {
    return;
  }

  [
    'galleryColumns',
    'galleryRows',
    'galleryMargin',
    'galleryMarginColumn',
    'galleryMarginRow',
    'gallery_gapSize',
    'gallery_gapSizeColumn',
    'gallery_gapSizeRow',
    'gallery_imageWidth',
    'gallery_imageAndInfoSpacing',
  ].forEach((key) => {
    if (styleParams.numbers?.[key] !== undefined) {
      styleParams.numbers[key] = Math.round(styleParams.numbers[key]);
    }
  });
};
