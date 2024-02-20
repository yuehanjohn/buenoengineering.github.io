/* eslint-disable import/no-cycle */
import type {IWixStyleFont, IWixStyleParams} from '@wix/wixstores-client-core/dist/es/src/types/wix-sdk';
import type {IControllerConfig, IStyle} from '@wix/native-components-infra/dist/es/src/types/types';
import type {ISantaProps} from '@wix/wixstores-client-storefront-sdk/dist/es/src/types/native-types';
import {GalleryStore} from '../viewerScript/GalleryStore';
import {GetDataQuery, ProductFilters, ProductSort} from '../graphql/queries-schema';
import type {IFilterValue} from '@wix/wixstores-graphql-schema';
import {CollectionFilterModel} from '../models/CollectionFilterModel';
import {MultiCollectionFilterModel} from '../models/MultiCollectionFilterModel';
import {ListFilterModel} from '../models/ListFilterModel';
import {ColorFilterModel} from '../models/ColorFilterModel';
import {PriceFilterModel} from '../models/PriceFilterModel';
import {AddToCartActionOption} from '@wix/wixstores-client-core/dist/es/src/constants';
import {AddToCartState} from '@wix/wixstores-client-storefront-sdk/dist/es/src/services/AddToCartService/constants';
import {ProductsVariantInfoMap} from '../services/ProductsOptionsService';
import type {ISentryErrorBoundaryPropsInjectedByViewerScript} from '@wix/native-components-infra/dist/es/src/HOC/sentryErrorBoundary/sentryErrorBoundary';
import {HeadingTags} from '@wix/wixstores-client-core/dist/es/src/types/heading-tags';
import {ProductsPriceRangeServiceMap} from '../services/ProductsPriceRangeService';
import type {ICategory} from './category';
import {BreadcrumbsItem} from 'wix-ui-tpa';
import {AddToCartActionStatus} from '../constants';
import type {ReactComponentElement} from 'react';

export interface IGalleryStyleParams extends IWixStyleParams {
  booleans: Partial<{
    is_gallery_rows_and_cols_were_modified: boolean;
    responsive: boolean;
    full_width: boolean;
    galleryFiltersCategories: boolean;
    galleryFiltersPrice: boolean;
    galleryFiltersProductOptions: boolean;
    galleryShowFilters: boolean;
    galleryShowSort: boolean;
    gallerySortNameAsc: boolean;
    gallerySortNameDes: boolean;
    gallerySortNewest: boolean;
    gallerySortPriceAsc: boolean;
    gallerySortPriceDes: boolean;
    gallery_addToCartButtonShowOnHover: boolean;
    gallery_alternateImagePosition: boolean;
    'mobile:gallery_alternateImagePosition': boolean;
    gallery_showAddToCartButton: boolean;
    gallery_showAddToCartQuantity: boolean;
    gallery_showDividers: boolean;
    gallery_showPrice: boolean;
    gallery_showRibbon: boolean;
    gallery_showProductName: boolean;
    gallery_showDiscountName: boolean;
    gallery_showTitle: boolean;
    gallery_paginationFirstLastArrows: boolean;
    gallery_showProductOptionsButton: boolean;
    showAlternativeImage: boolean;
    showQuickView: boolean;
    ['mobile:gallery_showAddToCartButton']: boolean;
    ['mobile:gallery_showProductOptions']: boolean;
    gallery_showBreadcrumbs: boolean;
    gallery_showAppliedFilters: boolean;
  }>;
  numbers: Partial<{
    galleryColumns: number;
    galleryRows: number;
    galleryMargin: number;
    galleryMarginRow: number;
    galleryMarginColumn: number;
    'mobile:galleryMarginRow': number;
    'mobile:galleryMarginColumn': number;
    gallery_imageMode: ImageModeId;
    'mobile:gallery_imageMode': ImageModeId;
    gallery_ribbonPlacement: RibbonPlacementId;
    gallery_ribbonType: RibbonType;
    gallery_productMargin: number;
    gallery_addToCartAction: AddToCartActionOption;
    galleryImageRatio: ImageRatioId;
    'mobile:gallery_productMargin': number;
    'mobile:galleryImageRatio': ImageRatioId;
    gallery_productsCount: number;
    gallery_productSize: number;
    gallery_gapSize: number;
    gallery_gapSizeColumn: number;
    gallery_gapSizeRow: number;
    ['mobile:galleryColumns']: number;
    ['mobile:galleryMargin']: number;
    gallery_gridType: GridType;
    gallery_loadMoreProductsType: LoadMoreType;
    gallery_paginationFormat: PaginationType;
    gallery_productOptionsShowOptions: ProductOptionsShowOptionsOption;
    'mobile:gallery_productNameFontSize': number;
    'mobile:gallery_productPriceFontSize': number;
    'mobile:gallery_discountNameFontSize': number;
    'mobile:gallery_buttonTextFontSize': number;
    'mobile:gallery_ribbonTextFontSize': number;
    gallery_imageWidth: number;
    'mobile:gallery_imageWidth': number;
    gallery_imageAndInfoSpacing: number;
    'mobile:gallery_imageAndInfoSpacing': number;
    gallery_itemLinkVerticalCustomizePadding: number;
    gallery_itemLinkHorizontalCustomizePadding: number;
    'mobile:gallery_itemLinkVerticalCustomizePadding': number;
    'mobile:gallery_itemLinkHorizontalCustomizePadding': number;
  }>;
  fonts?: Partial<{
    gallery_hoverType: {fontStyleParam: boolean; value: HoverType};
    'mobile:gallery_imageEffect': {fontStyleParam: boolean; value: HoverType};
    gallery_imageCarouselArrowSize: {fontStyleParam: boolean; value: ImageCarouselArrowSize};
    gallery_paginationAlignment: {fontStyleParam: boolean; value: ContentJustification};
    gallery_verticalAlignment: {fontStyleParam: boolean; value: VerticalAlignments};
    gallery_imagePlacement: {fontStyleParam: boolean; value: ImagePlacements};
    'mobile:gallery_imagePlacement': {fontStyleParam: boolean; value: ImagePlacements};
    gallery_imagePosition: {fontStyleParam: boolean; value: ImagePositions};
    'mobile:gallery_imagePosition': {fontStyleParam: boolean; value: ImagePositions};
    gallery_titleFontStyle: IWixStyleFont;
    gallery_priceFontStyle: IWixStyleFont;
    gallery_addToCartButtonTextFont: IWixStyleFont;
    gallery_ribbonTextFont: IWixStyleFont;
    gallery_alignment: {fontStyleParam: boolean; value: Alignments};
    gallery_addToCartButtonWidth: {fontStyleParam: boolean; value: ButtonWidthType};
    gallery_sortingDefaultOption: IWixStyleFont;
  }>;
}

export interface IGalleryControllerConfig extends IControllerConfig {
  style: {
    styleParams: IGalleryStyleParams;
  };
}

export interface IGalleryStyle extends IStyle {
  styleParams: IGalleryStyleParams;
}

export interface IGallerySantaProps extends ISantaProps {
  style: IGalleryStyle;
}

export interface IPriceRangeValue {
  min: string;
  max: string;
}

export interface IRangeValue {
  min: number;
  max: number;
}

export interface ITextsMap extends IMandatoryTextMap {
  allCollectionsFilterButtonText: string;
  clearFiltersButtonText: string;
  filtersSubmitButtonText?: string;
  filtersTitleText: string;
  filtersAriaLabel: string;
  galleryRegionSR: string;
  loadMoreButtonText: string;
  loadPreviousButtonText: string;
  mobileFiltersButtonText?: string;
  mobileFiltersAndSortingText?: string;
  sortByText: string;
  noProductsFilteredMessageText: string;
  noProductsMessageText: string;
  sortOptionHighPriceText: string;
  sortOptionLowPriceText: string;
  sortOptionNameAZText: string;
  sortOptionNameZAText: string;
  sortOptionNewestText: string;
  sortTitleText: string;
  sortRecommendedText: string;
  announceFiltersUpdate: string;
  pricePerUnitSR: string;
  measurementUnits: {[key: string]: {[key: string]: string}};
  priceRangeMaxSR: string;
  priceRangeMinSR: string;
  productsCounterPlural: string;
  productsCounterSingular: string;
  productsCounterZero: string;
  sortLabel: string;
  categoryTreeTitle: string;
  categoryHeaderReadMoreLink: string;
  categoryHeaderReadLessLink: string;
  emptyCategoryTitle: string;
  emptyCategoryBody: string;
  noFilterResultsTitle: string;
  noFilterResultsBody: string;
  noFilterResultsButton: string;
  emptyCategoryEditorTitle: string;
  emptyCategoryEditorSubTitle: string;
  emptyCategoryPageEditorTitle: string;
  emptyCategoryPageEditorSubtitle: string;
  allProducts: string;
  appliedFiltersClearAllButton: string;
  appliedFiltersPriceTag: string;
  appliedFiltersContainerSR: string;
  appliedFilterClearSR: string;
}

export interface IMandatoryTextMap {
  galleryAddToCartButtonText: string;
  galleryAddToCartPreOrderButtonText: string;
  addToCartContactSeller: string;
  addToCartOutOfStock: string;
  addToCartSuccessSR: string;
  digitalProductBadgeAriaLabelText: string;
  productOutOfStockText: string;
  productPriceAfterDiscountSR: string;
  productPriceBeforeDiscountSR: string;
  productPriceWhenThereIsNoDiscountSR: string;
  quickViewButtonText: string;
  quantityAddSR: string;
  quantityChooseAmountSR: string;
  quantityInputSR: string;
  quantityRemoveSR: string;
  quantityMaximumAmountSR: string;
  quantityTotalSR: string;
  quantityMinimumAmountSR: string;
  arrowPrevious: string;
  arrowNext: string;
  carouselContainerLabel: string;
  priceRangeText: string;
}

export interface IPropsInjectedByViewerScript extends ISentryErrorBoundaryPropsInjectedByViewerScript {
  allowFreeProducts: boolean;
  clearFilters: Function;
  currentPage: number;
  scrollToProduct: string;
  linkForAllPages: string[];
  nextPrevLinks: string[];
  totalPages: number;
  maxProductsPerPage: number;
  cssBaseUrl: string;
  filterModels: FilterModel[];

  clearScrollToProduct(): void;
  filterProducts(filterId: number, value: IFilterSelectionValue): void;

  applyFilteredProductsOnMobile: Function;
  focusedProductIndex?: number;

  getCategoryProducts?(params: {limit: number; offset?: number; total?: number}): void;

  handleProductItemClick: GalleryStore['handleProductItemClick'];
  reportProductItemClick: GalleryStore['reportProductItemClick'];

  handleCategoryClick({
    destinationLink,
    destinationCategoryId,
  }: {
    destinationLink: string;
    destinationCategoryId: string;
  }): void;
  handleCategoryBreadcrumbsClick({item, originCategoryId}: {item: BreadcrumbsItem; originCategoryId: string}): void;
  sendSortClickBiEvent: Function;

  sendClickShippingInfoLinkSf(productId: string): void;

  handleAddToCart(params: {productId: string; index: number; quantity: number}): void;

  handleCategoryClampClick: Function;

  handleProductsOptionsChange: GalleryStore['handleOptionSelectionsChange'];

  handlePagination(page: number): void;

  updateAddToCartStatus(productId: string, status: AddToCartActionStatus): void;

  hasMoreProductsToLoad: boolean;
  hasSelectedFilters: boolean;
  htmlTags: {
    productNameHtmlTag: HeadingTags;
  };
  imagePosition: ImagePositions;
  imageMode: ImageModeId;
  imageRatio: ImageRatioId;
  isFirstPage: boolean;
  isHorizontalLayout: boolean;
  isInteractive: boolean;
  isLiveSiteMode: boolean;
  isPreviewMode: boolean;
  isLoaded: boolean;
  shouldShowMobile: boolean;
  isRTL: boolean;
  isSEO: boolean;
  isSSR: boolean;
  isGalleryRowsAndColsWereModified: boolean;
  isAutoGrid: boolean;
  isCategoryPage: boolean;
  loadMoreProducts: Function;
  loadMoreType: LoadMoreType;
  mainCollectionId: string;
  onAppLoaded: Function;
  openQuickView: GalleryStore['openQuickView'];
  paginationMode: PaginationTypeName;
  priceBreakdown: GalleryStore['priceBreakdown'];
  productsManifest: ProductsManifest;
  products: IProduct[];
  productsVariantInfoMap: ProductsVariantInfoMap;
  productsPriceRangeMap: ProductsPriceRangeServiceMap;
  shouldAlternateImagePosition: boolean;
  shouldShowClearFilters: boolean;
  shouldShowMobileFiltersModal: boolean;
  shouldShowSort: boolean;
  showShowLightEmptyState: boolean;
  shouldShowImageCarousel: boolean;
  shouldShowProductOptions: boolean;
  shouldUseAutoGridProductsCount: boolean;
  setSelectedSort: Function;
  sortProducts: Function;
  textsMap: ITextsMap;
  toggleFiltersModalVisibility: Function;
  totalProducts: number;
  experiments: {
    isAllowGalleryProductRoundCornersInViewer: boolean;
    shouldRenderGalleryProductItemCarouselHover: boolean;
    shouldScrollToProductPositionWhenReturningFromProductPageFixEnabled: boolean;
    editableGridTemplateRepeatOption: boolean;
    addRatingSummarySlotToGallery: boolean;
    fixGalleryRenderingWhenUrlChanges: boolean;
    shouldUseCommonDiscountPricingMethods: boolean;
    disableInfiniteScrollInEditor: boolean;
    shouldUseVariantLevelPreOrderAvailable: boolean;
    shouldResetQuantityUponSelectionChange: boolean;
    shouldRenderSlotsInGallery: boolean;
  };
  slots?: Record<string, ReactComponentElement<any>>;
  numberOfSelectedFilterTypes: number;
  sortingOptions: ISortingOption[];
  sortingOptionsWithoutDefault: ISortingOption[];
  mobileFiltersPanelState: MobileFiltersPanelState;
  selectedSort: ISortingOption;
  shouldShowAddToCartSuccessAnimation: boolean;
  addedToCartStatus: {[productId: string]: AddToCartActionStatus};
  productsRequestInProgress: boolean;
  isOptionsRevealEnabled: boolean;
  fitToContentHeight: boolean;
  currentCategory: ICategory;
  breadcrumbsHistory: any[];
  isCategoryVisible: boolean;
  isEditorMode: boolean;
  categories: ICategory[];
  allProductsCategoryId: string;
}

export interface ProductsManifest {
  [productId: string]: {
    url: string;
    addToCartState: AddToCartState;
  };
}

export interface ISortingOption {
  field: SortingOptionField;
  direction?: SortingDirection;
  id: SortingOptionId;
  titleKey: SortingOptionTitleKey;
  settingsShouldDisplayKey?: SortingOptionBooleanKey;
}

export type SortingOptionField = 'creationDate' | 'comparePrice' | 'name' | '';

export type SortingOptionId =
  | 'default'
  | 'newest'
  | 'recommended'
  | 'price_ascending'
  | 'price_descending'
  | 'name_ascending'
  | 'name_descending';

export type SortingOptionTitleKey =
  | 'sortOptionNameZAText'
  | 'sortOptionNameAZText'
  | 'sortOptionHighPriceText'
  | 'sortOptionLowPriceText'
  | 'sortOptionNewestText'
  | 'sortTitleText'
  | 'sortRecommendedText';

export type SortingOptionBooleanKey =
  | 'gallerySortNameDes'
  | 'gallerySortNameAsc'
  | 'gallerySortPriceDes'
  | 'gallerySortPriceAsc'
  | 'gallerySortNewest'
  | 'sortTitleText'
  | 'gallerySortRecommended';

export type IProduct = GetDataQuery['catalog']['category']['productsWithMetaData']['list'][0];
export type IProductOption = IProduct['options'][0];
export type IProductOptionSelection = IProductOption['selections'][0];
export type ReducedOptionSelection = {
  selectionKey: IProductOptionSelection['key'];
  selectionId: IProductOptionSelection['id'];
  optionId: IProductOption['id'];
  optionKey: IProductOption['key'];
};

export interface IProductItemData {
  id: string;
  name: string;
  urlPart: string;
  price: number;
  comparePrice: number;
  formattedPrice: string;
  formattedComparePrice: string;
  ribbon: string;
  isOptionMandatory: boolean;
  media: IMediaData[];
  inventoryStatus: any;
  isInStock?: boolean;
  productType: ProductType;
  digitalProductFilesTypes: MediaFrameMediaType[];
}

export interface IMediaData extends IImageDimension {
  url: string;
  mediaType: string;
  index: number;
  title: string;
  altText: string;
}

export interface IImageDimension {
  width: number;
  height: number;
}

export type IFilterSelectionValue = string | IPriceRangeValue;

export interface IFilterModel {
  activeOptions: any;
  filterId: number;
  filterType: FilterType;
  title: string;
  toDTO?: Function;
  options: IFilterOption[];

  updateActiveOptions(value: IFilterSelectionValue): void;

  hasActiveOptions?(): boolean;

  resetActiveOptions(): void;
}

export type IFilterOption = IFilterValue;

export interface IFilterConfig {
  filterTitle: string;
  filterType: FilterConfigType;
  show: boolean;
  custom?: boolean;
  selected?: {[id: string]: string}[];
  id?: string;
}

export type FilterModel =
  | CollectionFilterModel
  | MultiCollectionFilterModel
  | ListFilterModel
  | ColorFilterModel
  | PriceFilterModel;

export interface IFilterDTO {
  field: string;
  op: FilterEqOperation;
  values: any[];
}

export interface ICollectionIdsFilterDTO {
  mainCategory: string;
  subCategory?: string;
  customCategories?: string[][];
}

export interface IDeprecatedFilterConfigDTO {
  filterTitle: string;
  filterType: FilterConfigType;
  show: boolean;
  custom?: boolean;
  selected?: {[id: string]: string}[];
}

export interface IFilterConfigDTO {
  filterType: FilterConfigType;
  id: string;
  show: boolean;
  custom?: boolean;
  selected?: {[id: string]: string}[];
}

export interface IFilteredCategoryProductsViewResponse {
  data: {
    products: IProductItemData[];
    totalCount: number;
  };
  errors?: any[];
}

export type nonCollectionFilterModel = ListFilterModel | ColorFilterModel | PriceFilterModel;

export interface IColorOption {
  rgbValue: string;
  name: string;
}

export interface ISorting extends ISortingParam {
  id: string;
  titleKey: string;
}

export interface IAmountLimit {
  from: number;
  to: number;
}

export interface ISortingParam {
  field: string;
  direction?: SortingDirection;
}

export interface IFilteredProductsRequestParams {
  filters: IFilterDTO[];
  limit: IAmountLimit;
  sort?: ISortingParam;
  offset?: number;
  categories?: ICollectionIdsFilterDTO;
  withOptions?: boolean;
  withPriceRange: boolean;
}

export interface IFilteredProductsRequest {
  viewName: string;
  params: IFilteredProductsRequestParams;
}

export interface IOldGetInitialData {
  externalId: string;
  compId: string;
  limit?: number;
  withPriceRange: boolean;
  withOptions?: boolean;
}

export interface IGetInitialData {
  externalId: string;
  compId: string;
  limit?: number;
  sort?: ProductSort;
  filters?: ProductFilters;
  offset?: number;
  withOptions?: boolean;
  withPriceRange: boolean;
  mainCollectionId?: string;
}

export interface IGetCategoryProducts {
  compId: string;
  limit: number;
  offset: number | null;
}

export interface IQueryParamsFilter {
  key: string;
  value: string;
  filterId: number;
}

export type PaginationTypeName = 'compact' | 'pages';

export interface IAddProductImpression {
  id: string;
  name: string;
  list: string;
  category: string;
  position: number;
  price: number;
  currency: string;
  dimension3: 'in stock' | 'out of stock';
}

export type VeloInputs = {
  productIds?: string[];
  collectionId?: string;
  onItemSelected?: VeloInputsOnItemSelected;
};

export type VeloInputsOnItemSelected = {
  callBack: Function;
  options: {
    preventNavigation: boolean;
  };
};

export enum ProductOptionsShowOptionsOption {
  REVEAL = 1,
  EXPOSED = 2,
}

export enum LoadMoreType {
  BUTTON = 1,
  PAGINATION = 2,
  INFINITE = 3,
}

export enum VerticalAlignments {
  TOP = 'top',
  BOTTOM = 'bottom',
  CENTER = 'center',
  STRETCH = 'stretch',
}

export enum ContentJustification {
  START = 'start',
  CENTER = 'center',
  END = 'end',
}
export enum Alignments {
  LEFT = 'left',
  RIGHT = 'right',
  CENTER = 'center',
}

export enum ButtonWidthType {
  STRETCH = 'stretch',
  FIT = 'fit',
}

export enum ImagePlacements {
  VERTICAL = 'vertical',
  HORIZONTAL = 'horizontal',
}

export enum GridType {
  MANUAL = 1,
  AUTO = 2,
}

export enum PaginationType {
  PAGES = 1,
  COMPACT = 2,
}

export enum FilterEqOperation {
  EQUALS = 'EQUALS',
  GTE = 'GTE', // Greater than or equal to
  LTE = 'LTE', // Less than or equal to
  BETWEEN = 'BETWEEN',
  IN = 'IN',
  IN_ALL = 'IN_ALL',
}

export enum MobileFiltersPanelState {
  FILTERS_ONLY = 'FILTERS_ONLY',
  SORT_ONLY = 'SORT_ONLY',
  FILTERS_AND_SORT = 'FILTERS_AND_SORT',
  NONE = 'NONE',
}

export enum SortingDirection {
  Ascending = 'ASC',
  Descending = 'DESC',
}

export enum ProductType {
  DIGITAL = 'digital',
  PHYSICAL = 'physical',
}

export enum MediaFrameMediaType {
  SECURE_PICTURE = 'secure_picture',
  SECURE_VIDEO = 'secure_video',
  SECURE_DOCUMENT = 'secure_document',
  SECURE_MUSIC = 'secure_music',
  SECURE_ARCHIVE = 'secure_archive',
}

export enum FilterType {
  COLLECTION = 'COLLECTION',
  CUSTOM_COLLECTION = 'CUSTOM_COLLECTION',
  PRICE = 'PRICE ',
  COLOR_OPTION = 'COLOR_OPTION',
  LIST_OPTION = 'LIST_OPTION',
}

export enum FilterConfigType {
  CATEGORY = 'CATEGORY',
  PRICE = 'PRICE',
  OPTIONS = 'OPTIONS',
  OPTION_LIST = 'OPTION_LIST',
}

export enum ImageModeId {
  Crop = 1,
  Fit = 2,
}

export enum RibbonPlacementId {
  OnImage = 1,
  ProductInfo = 2,
}

export enum RibbonType {
  RECTANGLE = 1,
  TEXT = 2,
}

export enum HoverType {
  None = 'none',
  Zoom = 'zoom',
  Border = 'border',
  Alternate = 'alternate',
  Carousel = 'carousel',
}

export enum ImageCarouselArrowSize {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
}

export enum ImagePositions {
  LEFT = 'left',
  RIGHT = 'right',
}
export enum ImageRatioId {
  _3x2 = 0,
  _4x3 = 1,
  _1x1 = 2,
  _3x4 = 3,
  _2x3 = 4,
  _16x9 = 5,
  _9x16 = 6,
}
