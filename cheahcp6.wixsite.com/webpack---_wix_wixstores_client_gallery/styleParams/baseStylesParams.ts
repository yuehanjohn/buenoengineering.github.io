/* istanbul ignore file */

import {createStylesParam, StyleParamType, wixColorParam, wixFontParam} from '@wix/tpa-settings';
import {AddToCartActionOption} from '@wix/wixstores-client-core/dist/es/src/constants';
import {
  AutoGridTemplateRepeatOptions,
  CategoryHeaderLayout,
  CategoryHeaderPosition,
  CategoryListStrategy,
  DEFAULT_AUTO_GRID_PRODUCTS_COUNT,
  DEFAULT_COLS,
  DEFAULT_MANUAL_GRID_PRODUCTS_COUNT,
  DEFAULT_PRODUCT_IMAGE_SIZE,
  FilterAndSortButtonStyle,
  MAX_ROWS,
} from '../constants';
import {
  Alignments,
  ButtonWidthType,
  ContentJustification,
  GridType,
  HoverType,
  ImageCarouselArrowSize,
  ImageModeId,
  ImagePlacements,
  ImagePositions,
  ImageRatioId,
  LoadMoreType,
  PaginationType,
  RibbonPlacementId,
  RibbonType,
  VerticalAlignments,
} from '../types/galleryTypes';
import {GalleryViewMode} from '../wishlist/constants';
import {IStylesParams} from './types';

const responsive = createStylesParam('responsive', {
  type: StyleParamType.Boolean,
  getDefaultValue: ({isEditorX}) => isEditorX,
});

const showAlternativeImage = createStylesParam('showAlternativeImage', {
  type: StyleParamType.Boolean,
  getDefaultValue: () => true,
});

const gallery_showProductOptionsButton = createStylesParam('gallery_showProductOptionsButton', {
  type: StyleParamType.Boolean,
  getDefaultValue: () => false,
});

export const galleryColumnsDefaultValue = ({dimensions}) => {
  if (!dimensions) {
    return;
  }

  if (typeof dimensions.width !== 'number') {
    return DEFAULT_COLS;
  }
  const componentWidth: number = dimensions.width;
  const PRODUCT_ITEM_MIN_WIDTH: number = 250;
  const defaultColumns = Math.round(componentWidth / PRODUCT_ITEM_MIN_WIDTH);
  return Math.min(defaultColumns, DEFAULT_COLS);
};

const galleryColumns = createStylesParam('galleryColumns', {
  type: StyleParamType.Number,
  getDefaultValue: galleryColumnsDefaultValue,
});

export const galleryRowsDefaultValue = ({getStyleParamValue}) => {
  const columnsNumber = getStyleParamValue(galleryColumns);
  if (!columnsNumber) {
    return;
  }
  const LEGACY_MAX_ITEM_PER_PAGE = 20;
  return Math.min(Math.floor(LEGACY_MAX_ITEM_PER_PAGE / columnsNumber), MAX_ROWS / 2);
};

const galleryMargin = createStylesParam('galleryMargin', {
  type: StyleParamType.Number,
  getDefaultValue: () => 10,
});

const gallery_productMargin = createStylesParam('gallery_productMargin', {
  type: StyleParamType.Number,
  getDefaultValue: () => 0,
});

const gallery_gapSize = createStylesParam('gallery_gapSize', {
  type: StyleParamType.Number,
  getDefaultValue: () => 20,
});

const gallery_fixedGridProductsCount = createStylesParam('gallery_fixedGridProductsCount', {
  type: StyleParamType.Number,
  getDefaultValue: () => DEFAULT_MANUAL_GRID_PRODUCTS_COUNT,
});

const gallery_imageMode = createStylesParam('gallery_imageMode', {
  type: StyleParamType.Number,
  getDefaultValue: () => ImageModeId.Crop,
});

const galleryImageRatio = createStylesParam('galleryImageRatio', {
  type: StyleParamType.Number,
  getDefaultValue: () => ImageRatioId._1x1,
});

const gallery_imageWidth = createStylesParam('gallery_imageWidth', {
  type: StyleParamType.Number,
  getDefaultValue: () => 50,
});

const gallery_imageAndInfoSpacing = createStylesParam('gallery_imageAndInfoSpacing', {
  type: StyleParamType.Number,
  getDefaultValue: () => 0,
});

const gallery_alternateImagePosition = createStylesParam('gallery_alternateImagePosition', {
  type: StyleParamType.Boolean,
  getDefaultValue: () => false,
});

const gallery_showAddToCartQuantity = createStylesParam('gallery_showAddToCartQuantity', {
  type: StyleParamType.Boolean,
  getDefaultValue: () => false,
});

const gallery_showAddToCartButton = createStylesParam('gallery_showAddToCartButton', {
  type: StyleParamType.Boolean,
  getDefaultValue: () => false,
});

const gallery_titleFontStyle = createStylesParam('gallery_titleFontStyle', {
  type: StyleParamType.Font,
  getDefaultValue: wixFontParam('Body-M', {
    size: 16,
  }),
});

const gallery_priceFontStyle = createStylesParam('gallery_priceFontStyle', {
  type: StyleParamType.Font,
  getDefaultValue: wixFontParam('Body-M', {
    size: 16,
  }),
});

const gallery_discountNameFont = createStylesParam('gallery_discountNameFont', {
  type: StyleParamType.Font,
  getDefaultValue: wixFontParam('Body-M', {
    size: 14,
  }),
});

const gallery_addToCartButtonTextFont = createStylesParam('gallery_addToCartButtonTextFont', {
  type: StyleParamType.Font,
  getDefaultValue: wixFontParam('Body-M', {
    size: 15,
  }),
});

const gallery_ribbonTextFont = createStylesParam('gallery_ribbonTextFont', {
  type: StyleParamType.Font,
  getDefaultValue: wixFontParam('Body-M', {
    size: 14,
  }),
});

const gallery_hoverType = createStylesParam('gallery_hoverType', {
  type: StyleParamType.Font,
  getDefaultValue: ({getStyleParamValue}) => ({
    fontStyleParam: false,
    value: getStyleParamValue(showAlternativeImage) ? HoverType.Alternate : HoverType.None,
  }),
});

const gallery_categoryHeaderLayout = createStylesParam('gallery_categoryHeaderLayout', {
  type: StyleParamType.Number,
  getDefaultValue: () => CategoryHeaderLayout.TextBelow,
});

const gallery_imagePosition = createStylesParam('gallery_imagePosition', {
  type: StyleParamType.Font,
  getDefaultValue: () => ({
    fontStyleParam: false,
    value: ImagePositions.LEFT,
  }),
});

const gallery_imagePlacement = createStylesParam('gallery_imagePlacement', {
  type: StyleParamType.Font,
  getDefaultValue: () => ({
    fontStyleParam: false,
    value: ImagePlacements.VERTICAL,
  }),
});

const gallery_categoriesBreadcrumbsFont = createStylesParam('gallery_categoriesBreadcrumbsFont', {
  type: StyleParamType.Font,
  getDefaultValue: wixFontParam('Body-M', {
    size: 16,
  }),
});

const gallery_categoryNameFont = createStylesParam('gallery_categoryNameFont', {
  type: StyleParamType.Font,
  getDefaultValue: wixFontParam('Heading-M', {
    size: 28,
  }),
});

const gallery_categoryDescriptionFont = createStylesParam('gallery_categoryDescriptionFont', {
  type: StyleParamType.Font,
  getDefaultValue: wixFontParam('Body-M', {
    size: 16,
  }),
});

const gallery_categoryDescriptionReadMoreLinkFont = createStylesParam('gallery_categoryDescriptionReadMoreLinkFont', {
  type: StyleParamType.Font,
  getDefaultValue: wixFontParam('Body-M', {
    size: 16,
  }),
});

const gallery_filterOptionsFont = createStylesParam('gallery_filterOptionsFont', {
  type: StyleParamType.Font,
  getDefaultValue: wixFontParam('Body-M', {
    size: 14,
  }),
});

export const baseStylesParams: IStylesParams = {
  gallery_addToCartButtonTextFont,
  gallery_ribbonTextFont,
  gallery_priceFontStyle,
  full_width: {
    type: StyleParamType.Boolean,
    getDefaultValue: () => false,
  },
  showAlternativeImage,
  galleryFiltersCategories: {
    type: StyleParamType.Boolean,
    getDefaultValue: () => true,
  },
  galleryFiltersPrice: {
    type: StyleParamType.Boolean,
    getDefaultValue: () => true,
  },
  galleryFiltersProductOptions: {
    type: StyleParamType.Boolean,
    getDefaultValue: () => true,
  },
  galleryShowFilters: {
    type: StyleParamType.Boolean,
    getDefaultValue: () => false,
  },
  galleryShowSort: {
    type: StyleParamType.Boolean,
    getDefaultValue: () => false,
  },
  gallerySortNameAsc: {
    type: StyleParamType.Boolean,
    getDefaultValue: () => true,
  },
  gallerySortNameDes: {
    type: StyleParamType.Boolean,
    getDefaultValue: () => true,
  },
  gallerySortNewest: {
    type: StyleParamType.Boolean,
    getDefaultValue: () => true,
  },
  gallerySortPriceAsc: {
    type: StyleParamType.Boolean,
    getDefaultValue: () => true,
  },
  gallerySortPriceDes: {
    type: StyleParamType.Boolean,
    getDefaultValue: () => true,
  },
  gallerySortRecommended: {
    type: StyleParamType.Boolean,
    getDefaultValue: () => true,
  },
  gallery_showAddToCartButton,
  'mobile:gallery_showAddToCartButton': {
    type: StyleParamType.Boolean,
    getDefaultValue: ({getStyleParamValue}) => getStyleParamValue(gallery_showAddToCartButton),
  },
  gallery_addToCartButtonShowOnHover: {
    type: StyleParamType.Boolean,
    getDefaultValue: () => false,
  },
  gallery_alternateImagePosition,
  'mobile:gallery_alternateImagePosition': {
    type: StyleParamType.Boolean,
    getDefaultValue: ({getStyleParamValue}) => getStyleParamValue(gallery_alternateImagePosition),
  },
  gallery_showAddToCartQuantity,
  'mobile:gallery_showQuantity': {
    type: StyleParamType.Boolean,
    getDefaultValue: ({getStyleParamValue}) => getStyleParamValue(gallery_showAddToCartQuantity),
  },
  gallery_showDividers: {
    type: StyleParamType.Boolean,
    getDefaultValue: () => false,
  },
  gallery_showPrice: {
    type: StyleParamType.Boolean,
    getDefaultValue: () => true,
  },
  gallery_showDiscountName: {
    type: StyleParamType.Boolean,
    getDefaultValue: () => true,
  },
  gallery_showRibbon: {
    type: StyleParamType.Boolean,
    getDefaultValue: () => true,
  },
  gallery_ribbonSidePadding: {
    type: StyleParamType.Number,
    getDefaultValue: () => 0,
  },
  gallery_ribbonTopPadding: {
    type: StyleParamType.Number,
    getDefaultValue: () => 0,
  },
  gallery_ribbonCornerRadius: {
    type: StyleParamType.Number,
    getDefaultValue: () => 0,
  },
  gallery_ribbonBorderWidth: {
    type: StyleParamType.Number,
    getDefaultValue: () => 0,
  },
  gallery_showProductName: {
    type: StyleParamType.Boolean,
    getDefaultValue: () => true,
  },
  gallery_showTitle: {
    type: StyleParamType.Boolean,
    getDefaultValue: () => undefined,
  },
  gallery_showCategoryHeaderSection: {
    type: StyleParamType.Boolean,
    getDefaultValue: () => true,
  },
  gallery_showCategoryHeaderImage: {
    type: StyleParamType.Boolean,
    getDefaultValue: ({isMobile}) => !isMobile,
  },
  gallery_showCategoryHeaderReadMoreLink: {
    type: StyleParamType.Boolean,
    getDefaultValue: () => true,
  },
  gallery_showCategoryHeaderName: {
    type: StyleParamType.Boolean,
    getDefaultValue: () => true,
  },
  gallery_showCategoryHeaderDescription: {
    type: StyleParamType.Boolean,
    getDefaultValue: ({isMobile}) => !isMobile,
  },
  gallery_paginationFirstLastArrows: {
    type: StyleParamType.Boolean,
    getDefaultValue: () => false,
  },
  gallery_showProductOptionsButton,
  'mobile:gallery_showProductOptions': {
    type: StyleParamType.Boolean,
    getDefaultValue: ({getStyleParamValue}) => getStyleParamValue(gallery_showProductOptionsButton),
  },
  showQuickView: {
    type: StyleParamType.Boolean,
    getDefaultValue: () => true,
  },
  responsive,
  galleryColumns,
  galleryRows: {
    type: StyleParamType.Number,
    getDefaultValue: galleryRowsDefaultValue,
  },
  galleryMargin,
  galleryMarginRow: {
    type: StyleParamType.Number,
    getDefaultValue: ({getStyleParamValue}) => getStyleParamValue(galleryMargin),
  },
  galleryMarginColumn: {
    type: StyleParamType.Number,
    getDefaultValue: ({getStyleParamValue}) => getStyleParamValue(galleryMargin),
  },
  'mobile:galleryMarginRow': {
    type: StyleParamType.Number,
    getDefaultValue: () => 20,
  },
  'mobile:galleryMarginColumn': {
    type: StyleParamType.Number,
    getDefaultValue: () => 20,
  },
  gallery_productMargin,
  'mobile:gallery_productMargin': {
    type: StyleParamType.Number,
    getDefaultValue: ({getStyleParamValue}) => getStyleParamValue(gallery_productMargin) ?? 0,
  },
  gallery_imageMode,
  'mobile:gallery_imageMode': {
    type: StyleParamType.Number,
    getDefaultValue: ({getStyleParamValue}) => getStyleParamValue(gallery_imageMode),
  },
  gallery_ribbonPlacement: {
    type: StyleParamType.Number,
    getDefaultValue: () => RibbonPlacementId.OnImage,
  },
  gallery_ribbonType: {
    type: StyleParamType.Number,
    getDefaultValue: () => RibbonType.RECTANGLE,
  },
  galleryImageRatio,
  'mobile:galleryImageRatio': {
    type: StyleParamType.Number,
    getDefaultValue: ({getStyleParamValue}) => getStyleParamValue(galleryImageRatio),
  },
  'mobile:galleryMargin': {
    type: StyleParamType.Number,
    getDefaultValue: () => 10,
  },
  'mobile:galleryColumns': {
    type: StyleParamType.Number,
    getDefaultValue: () => 1,
  },
  gallery_addToCartAction: {
    type: StyleParamType.Number,
    getDefaultValue: () => AddToCartActionOption.MINI_CART,
  },
  gallery_productSize: {
    type: StyleParamType.Number,
    getDefaultValue: () => DEFAULT_PRODUCT_IMAGE_SIZE,
  },
  gallery_productsCount: {
    type: StyleParamType.Number,
    getDefaultValue: () => DEFAULT_AUTO_GRID_PRODUCTS_COUNT,
  },
  gallery_fixedGridProductsCount,
  gallery_gapSize,
  gallery_gapSizeColumn: {
    type: StyleParamType.Number,
    getDefaultValue: ({getStyleParamValue}) => getStyleParamValue(gallery_gapSize),
  },
  gallery_gapSizeRow: {
    type: StyleParamType.Number,
    getDefaultValue: ({getStyleParamValue}) => getStyleParamValue(gallery_gapSize),
  },
  gallery_gridType: {
    type: StyleParamType.Number,
    getDefaultValue: ({getStyleParamValue}) => (getStyleParamValue(responsive) ? GridType.AUTO : GridType.MANUAL),
  },
  gallery_loadMoreProductsType: {
    type: StyleParamType.Number,
    getDefaultValue: () => LoadMoreType.BUTTON,
  },
  gallery_paginationFormat: {
    type: StyleParamType.Number,
    getDefaultValue: () => PaginationType.PAGES,
  },
  'mobile:gallery_productNameFontSize': {
    type: StyleParamType.Number,
    getDefaultValue: ({getStyleParamValue}) => getStyleParamValue(gallery_titleFontStyle)?.size ?? 16,
  },
  'mobile:gallery_productPriceFontSize': {
    type: StyleParamType.Number,
    getDefaultValue: ({getStyleParamValue}) => getStyleParamValue(gallery_priceFontStyle)?.size ?? 16,
  },
  'mobile:gallery_discountNameFontSize': {
    type: StyleParamType.Number,
    getDefaultValue: ({getStyleParamValue}) => getStyleParamValue(gallery_discountNameFont)?.size ?? 14,
  },
  'mobile:gallery_buttonTextFontSize': {
    type: StyleParamType.Number,
    getDefaultValue: ({getStyleParamValue}) => getStyleParamValue(gallery_addToCartButtonTextFont)?.size ?? 15,
  },
  'mobile:gallery_ribbonTextFontSize': {
    type: StyleParamType.Number,
    getDefaultValue: ({getStyleParamValue}) => getStyleParamValue(gallery_ribbonTextFont)?.size ?? 14,
  },
  gallery_imageWidth,
  'mobile:gallery_imageWidth': {
    type: StyleParamType.Number,
    getDefaultValue: ({getStyleParamValue}) => getStyleParamValue(gallery_imageWidth),
  },
  gallery_imageAndInfoSpacing,
  'mobile:gallery_imageAndInfoSpacing': {
    type: StyleParamType.Number,
    getDefaultValue: ({getStyleParamValue}) => getStyleParamValue(gallery_imageAndInfoSpacing),
  },
  gallery_productOptionsShowOptions: {
    type: StyleParamType.Number,
  },
  gallery_itemLinkVerticalCustomizePadding: {
    type: StyleParamType.Number,
    getDefaultValue: () => 0,
  },
  gallery_itemLinkHorizontalCustomizePadding: {
    type: StyleParamType.Number,
    getDefaultValue: () => 0,
  },
  'mobile:gallery_itemLinkVerticalCustomizePadding': {
    type: StyleParamType.Number,
    getDefaultValue: () => 0,
  },
  'mobile:gallery_itemLinkHorizontalCustomizePadding': {
    type: StyleParamType.Number,
    getDefaultValue: () => 0,
  },
  gallery_categoryHeaderSpaceBetweenTitleDescription: {
    type: StyleParamType.Number,
    getDefaultValue: ({isMobile}) => (isMobile ? 0 : 4),
  },
  gallery_categoryHeaderImageCornerRadius: {
    type: StyleParamType.Number,
    getDefaultValue: () => 0,
  },
  gallery_categoryDescriptionContainerCornerRadius: {
    type: StyleParamType.Number,
    getDefaultValue: () => 0,
  },
  gallery_categoryHeaderPosition: {
    type: StyleParamType.Number,
    getDefaultValue: () => CategoryHeaderPosition.MinimizedAboveGallery,
  },
  gallery_categoryHeaderLayout,
  gallery_categoryHeaderImageMinHeight: {
    type: StyleParamType.Number,
    inheritDesktop: false,
    getDefaultValue: ({isMobile, getStyleParamValue}) => {
      if (isMobile) {
        return getStyleParamValue(gallery_categoryHeaderLayout) === CategoryHeaderLayout.TextInside ? 304 : 140;
      }
      return 280;
    },
  },
  gallery_categoryDescriptionContainerBorderWidth: {
    type: StyleParamType.Number,
    getDefaultValue: () => 0,
  },
  gallery_hoverType,
  'mobile:gallery_imageEffect': {
    type: StyleParamType.Font,
    getDefaultValue: ({getStyleParamValue}) => getStyleParamValue(gallery_hoverType),
  },
  gallery_imageCarouselArrowSize: {
    type: StyleParamType.Font,
    getDefaultValue: () => ({
      fontStyleParam: false,
      value: ImageCarouselArrowSize.SMALL,
    }),
  },
  gallery_paginationAlignment: {
    type: StyleParamType.Font,
    getDefaultValue: () => ({
      fontStyleParam: false,
      value: ContentJustification.CENTER,
    }),
  },
  gallery_verticalAlignment: {
    type: StyleParamType.Font,
    getDefaultValue: () => ({
      fontStyleParam: false,
      value: VerticalAlignments.CENTER,
    }),
  },
  gallery_imagePlacement,
  'mobile:gallery_imagePlacement': {
    type: StyleParamType.Font,
    getDefaultValue: ({getStyleParamValue}) => getStyleParamValue(gallery_imagePlacement),
  },
  gallery_imagePosition,
  'mobile:gallery_imagePosition': {
    type: StyleParamType.Font,
    getDefaultValue: ({getStyleParamValue}) => getStyleParamValue(gallery_imagePosition),
  },
  gallery_autoGridTemplateRepeatOption: {
    type: StyleParamType.Font,
    getDefaultValue: () => ({
      fontStyleParam: false,
      value: AutoGridTemplateRepeatOptions.AUTO_FIT,
    }),
  },
  gallery_alignment: {
    type: StyleParamType.Font,
    getDefaultValue: () => ({
      fontStyleParam: false,
      value: Alignments.LEFT,
    }),
  },
  gallery_categoryInfoAlignment: {
    type: StyleParamType.Font,
    getDefaultValue: ({isRTL}) => ({
      fontStyleParam: false,
      value: isRTL ? Alignments.RIGHT : Alignments.LEFT,
    }),
  },
  gallery_categoryInfoVerticalAlignment: {
    type: StyleParamType.Font,
    getDefaultValue: () => ({
      fontStyleParam: false,
      value: VerticalAlignments.BOTTOM,
    }),
  },
  gallery_categoriesBreadcrumbsAlignment: {
    type: StyleParamType.Font,
    getDefaultValue: ({isRTL}) => ({
      fontStyleParam: false,
      value: isRTL ? Alignments.RIGHT : Alignments.LEFT,
    }),
  },
  gallery_categoriesBreadcrumbsFont,
  gallery_showCategoriesBreadcrumbs: {
    type: StyleParamType.Boolean,
    getDefaultValue: () => true,
  },
  gallery_showCategoriesProductsCounter: {
    type: StyleParamType.Boolean,
    getDefaultValue: () => true,
  },
  gallery_showAppliedFilters: {
    type: StyleParamType.Boolean,
    getDefaultValue: () => true,
  },
  gallery_appliedFiltersTextFont: {
    type: StyleParamType.Font,
    getDefaultValue: ({isMobile}) =>
      wixFontParam('Body-M', {
        size: isMobile ? 12 : 14,
      }) as any,
  },
  gallery_addToCartButtonWidth: {
    type: StyleParamType.Font,
    getDefaultValue: () => ({
      fontStyleParam: false,
      value: ButtonWidthType.STRETCH,
    }),
  },
  gallery_categoryProductCounterFont: {
    type: StyleParamType.Font,
    getDefaultValue: wixFontParam('Body-M', {
      size: 14,
    }),
  },
  gallery_categoryNameFont,
  gallery_categoryDescriptionFont,
  gallery_categoryDescriptionReadMoreLinkFont: {
    type: StyleParamType.Font,
    getDefaultValue: wixFontParam('Body-M', {
      size: 16,
    }),
  },
  gallery_categoryProductCounterColor: {
    type: StyleParamType.Color,
  },
  gallery_categoriesBreadcrumbsColor: {
    type: StyleParamType.Color,
  },
  gallery_categoryNameColor: {
    type: StyleParamType.Color,
  },
  gallery_categoryDescriptionColor: {
    type: StyleParamType.Color,
  },
  gallery_categoryDescriptionReadMoreLinkColor: {
    type: StyleParamType.Color,
  },
  gallery_categoryDescriptionContainerColor: {
    type: StyleParamType.Color,
    getDefaultValue: wixColorParam('color-1'),
  },
  gallery_categoryDescriptionContainerBorderColor: {
    type: StyleParamType.Color,
    getDefaultValue: wixColorParam('color-5'),
  },
  'mobile:gallery_categoriesBreadcrumbsFontSize': {
    type: StyleParamType.Number,
    getDefaultValue: ({getStyleParamValue}) => getStyleParamValue(gallery_categoriesBreadcrumbsFont)?.size ?? 16,
  },
  'mobile:gallery_categoryDescriptionFontSize': {
    type: StyleParamType.Number,
    getDefaultValue: ({getStyleParamValue}) => getStyleParamValue(gallery_categoryDescriptionFont)?.size ?? 16,
  },
  'mobile:gallery_categoryReadMoreFontSize': {
    type: StyleParamType.Number,
    getDefaultValue: ({getStyleParamValue}) =>
      getStyleParamValue(gallery_categoryDescriptionReadMoreLinkFont)?.size ?? 16,
  },
  'mobile:gallery_categoryFilterAndSortButtonFontSize': {
    type: StyleParamType.Number,
    getDefaultValue: ({getStyleParamValue}) => getStyleParamValue(gallery_filterOptionsFont)?.size ?? 16,
  },
  'mobile:gallery_categoryTitleFontSize': {
    type: StyleParamType.Number,
    getDefaultValue: ({getStyleParamValue}) => getStyleParamValue(gallery_categoryNameFont)?.size ?? 28,
  },
  gallery_categoryTreeTitleFont: {
    type: StyleParamType.Font,
    getDefaultValue: wixFontParam('Heading-M', {
      size: 20,
    }),
  },
  gallery_categoryTreeTitleColor: {type: StyleParamType.Color},
  gallery_categoryAndFilterNamesFont: {
    type: StyleParamType.Font,
    getDefaultValue: wixFontParam('Body-M', {
      size: 16,
    }),
  },
  gallery_categoryAndFilterNamesColor: {type: StyleParamType.Color},
  gallery_filterOptionsFont: {
    type: StyleParamType.Font,
    getDefaultValue: wixFontParam('Body-M', {
      size: 14,
    }),
  },
  gallery_filterOptionsColor: {type: StyleParamType.Color},
  gallery_selectedCategoryFont: {
    type: StyleParamType.Font,
    getDefaultValue: wixFontParam('Body-M', {
      size: 16,
      style: {
        bold: false,
        italic: false,
        underline: true,
      },
    }),
  },
  gallery_selectedCategoryColor: {type: StyleParamType.Color},
  gallery_categoryHoverFont: {
    type: StyleParamType.Font,
    getDefaultValue: wixFontParam('Body-M', {
      size: 16,
      style: {
        bold: false,
        italic: false,
        underline: true,
      },
    }),
  },
  gallery_categoryHoverColor: {type: StyleParamType.Color},
  gallery_clearFiltersButtonFont: {
    type: StyleParamType.Font,
    getDefaultValue: wixFontParam('Body-M', {
      size: 14,
    }),
  },
  gallery_clearFiltersButtonColor: {type: StyleParamType.Color},
  gallery_sortingLabelFont: {
    type: StyleParamType.Font,
    getDefaultValue: wixFontParam('Body-M', {
      size: 16,
    }),
  },
  gallery_sortingLabelColor: {type: StyleParamType.Color},

  gallery_sortingDefaultOption: {
    type: StyleParamType.Font,
    getDefaultValue: () => ({
      fontStyleParam: false,
      value: 'gallerySortRecommended',
    }),
  },
  gallery_categoryMobileFilterAndSortButtonStyle: {
    type: StyleParamType.Number,
    getDefaultValue: () => FilterAndSortButtonStyle.TEXT,
  },
  gallery_sortingAndFiltersFillColor: {
    type: StyleParamType.Color,
  },
  gallery_sortingAndFiltersButtonBorderWidth: {
    type: StyleParamType.Number,
    getDefaultValue: () => 1,
  },
  gallery_sortingAndFiltersButtonBorderColor: {
    type: StyleParamType.Color,
  },
  gallery_sortingAndFiltersButtonRadius: {
    type: StyleParamType.Number,
    getDefaultValue: () => 0,
  },
  gallery_quantityAndOptionsTextFont: {
    type: StyleParamType.Font,
    getDefaultValue: wixFontParam('Body-M', {
      size: 16,
    }),
  },
  gallery_priceBreakdownFont: {
    type: StyleParamType.Font,
    getDefaultValue: wixFontParam('Body-M', {
      size: 12,
    }),
  },
  gallery_headerTextFont: {
    type: StyleParamType.Font,
    getDefaultValue: wixFontParam('Heading-M', {
      size: 25,
    }),
  },
  gallery_titleFont: {
    type: StyleParamType.Font,
    getDefaultValue: wixFontParam('Heading-M', {
      size: 26,
    }),
  },
  gallery_subtitleFont: {
    type: StyleParamType.Font,
    getDefaultValue: wixFontParam('Body-M', {
      size: 15,
    }),
  },
  gallery_sortingFiltersTextFont: {
    type: StyleParamType.Font,
    getDefaultValue: wixFontParam('Body-M'),
  },
  gallery_sortingFiltersTextColor: {
    type: StyleParamType.Color,
    getDefaultValue: wixColorParam('color-5'),
  },
  gallery_outOfStockFontStyle: {
    type: StyleParamType.Font,
    getDefaultValue: wixFontParam('Body-M', {
      size: 16,
    }),
  },
  gallery_categoriesFilterAndSortButtonTextFont: {
    type: StyleParamType.Font,
    getDefaultValue: wixFontParam('Body-M', {
      size: 16,
    }),
  },
  gallery_categoriesFilterAndSortButtonTextColor: {
    type: StyleParamType.Color,
  },
  gallery_showCategories: {type: StyleParamType.Boolean, getDefaultValue: () => true},
  gallery_showCategoriesTitle: {type: StyleParamType.Boolean, getDefaultValue: () => true},
  gallery_showFiltersTitle: {type: StyleParamType.Boolean, getDefaultValue: () => true},
  gallery_categoryListStrategy: {
    type: StyleParamType.Number,
    getDefaultValue: () => CategoryListStrategy.AUTOMATICALLY,
  },
  gallery_editorViewMode: {
    type: StyleParamType.Number,
    getDefaultValue: () => GalleryViewMode.EDITOR_EMPTY_STATE,
  },
  gallery_noProductsMessageFont: {
    type: StyleParamType.Font,
    getDefaultValue: wixFontParam('Body-M', {
      size: 20,
    }),
  },
  gallery_quickViewTextFontStyle: {
    type: StyleParamType.Font,
    getDefaultValue: wixFontParam('Body-M', {
      size: 14,
    }),
  },
  gallery_ribbonBackground: {
    type: StyleParamType.Color,
    getDefaultValue: wixColorParam('color-8'),
  },
  gallery_ribbonBorderColor: {
    type: StyleParamType.Color,
    getDefaultValue: wixColorParam('color-8'),
  },
};
