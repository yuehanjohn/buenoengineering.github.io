/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-floating-promises */
import type {IGalleryControllerConfig, IProduct, ProductsManifest, VeloInputs} from '../types/galleryTypes';
import {GridType} from '../types/galleryTypes';
import {
  AddToCartActionStatus,
  Experiments,
  FORCE_RELATED_GALLERY_RENDER_TIMEOUT,
  GALLERY_PUBLIC_DATA_PRESET_ID,
  GALLERY_TYPE,
  PAGE_NAMES_FOR_BI,
  RelatedProductsAlgorithmData,
  SLIDER_GALLERY_PRODUCTS_LOGICS_FOR_BI,
  SLIDER_GALLERY_TYPE,
  ReviewsSlotIds,
  STORES_NAMESPACE,
  translationPath,
} from '../constants';
import type {IPropsInjectedByViewerScript, ITextsMap} from '../types/sliderGalleryTypes';
import {ProductsService} from '../services/ProductsService';
import {SiteStore} from '@wix/wixstores-client-storefront-sdk/dist/es/src/viewer-script/site-store/SiteStore';
import {getTranslations} from '@wix/wixstores-client-storefront-sdk/dist/es/src/viewer-script/utils';
import {AddToCartActionOption, APP_DEFINITION_ID, PageMap} from '@wix/wixstores-client-core/dist/es/src/constants';
import {MultilingualService} from '@wix/wixstores-client-storefront-sdk/dist/es/src/services/MultilingualService/MultilingualService';
import {createSlotVeloAPIFactory} from '@wix/widget-plugins-ooi/velo';

import {AddToCartService} from '@wix/wixstores-client-storefront-sdk/dist/es/src/services/AddToCartService/AddToCartService';
import {actualPrice, isPreOrder} from '@wix/wixstores-client-core/dist/es/src/productOptions/productUtils';
import {CustomUrlApi} from '@wix/wixstores-client-storefront-sdk/dist/es/src/utils/CustomUrl/CustomUrlApi';
import {BaseGalleryStore} from './BaseGalleryStore';
import {ProductPriceRange} from '@wix/wixstores-client-storefront-sdk/dist/es/src/services/ProductPriceRange/ProductPriceRange';
import {unitsTranslations} from '../common/components/ProductItem/ProductPrice/unitsTranslations';
import {ProductPriceBreakdown} from '@wix/wixstores-client-storefront-sdk/dist/es/src/services/ProductPriceBreakdown/ProductPriceBreakdown';
import _ from 'lodash';
import {ProductFilters} from '../graphql/queries-schema';
import {clickOnProductBoxSf, exposureEventForTests, viewGallerySf} from '@wix/bi-logger-ec-sf/v2';
import {generateGuid} from '@wix/wixstores-client-core/dist/es/src/guid-generator';
import stylesParams from '../components/SliderGallery/stylesParams';
import {ControllerFlowAPI} from '@wix/yoshi-flow-editor';

export class SliderGalleryStore extends BaseGalleryStore {
  private readonly fedopsLogger;
  private mainCollectionId: string;
  private multilingualService: MultilingualService;
  private productPageSectionUrl: string;
  private translations: any = {};
  private isFedopsReport: boolean = true;
  private relatedProductIds: string[] = [];
  private addedToCartStatus: {[p: string]: AddToCartActionStatus} = {};
  private readonly customUrlApi: CustomUrlApi;
  private isUrlWithOverrides: boolean = false;
  private readonly impressionId = generateGuid();
  private isCategoryVisible: boolean = true;

  constructor(
    config: IGalleryControllerConfig,
    updateComponent: (props: Partial<IPropsInjectedByViewerScript>) => void,
    siteStore: SiteStore,
    private readonly compId: string,
    private readonly reportError: (e) => any,
    private readonly slotAPIFactory: ReturnType<typeof createSlotVeloAPIFactory>,
    type: string,
    private readonly panoramaClient: ControllerFlowAPI['panoramaClient'],
    private veloInputs?: VeloInputs
  ) {
    super(config, siteStore, updateComponent, type);
    const fedopsLoggerFactory = this.siteStore.platformServices.fedOpsLoggerFactory;
    this.fedopsLogger = fedopsLoggerFactory.getLoggerForWidget({
      appId: APP_DEFINITION_ID,
      widgetId: this.type,
    });

    const {galleryColumns, gallery_gridType} = this.styles;
    const numOfColumns = galleryColumns || 4;

    const initialProductsCount = gallery_gridType === GridType.MANUAL ? numOfColumns * 4 : 30;

    this.addToCartService = new AddToCartService(this.siteStore, this.config.publicData);
    this.productsService = new ProductsService(
      this.siteStore,
      initialProductsCount,
      'Slider Gallery',
      this.shouldShowProductOptions,
      this.shouldRenderPriceRange,
      this.fedopsLogger,
      false,
      this.panoramaClient
    );
    this.customUrlApi = new CustomUrlApi(this.siteStore.location.buildCustomizedUrl);
    this.subscribe();
  }

  private get shouldRenderPriceRange(): boolean {
    return new ProductPriceRange(this.siteStore).shouldShowPriceRange();
  }

  public setVeloInputs(veloInputs: VeloInputs) {
    this.veloInputs = {
      ...this.veloInputs,
      ...veloInputs,
    };
  }

  public async getCateogryProducts({limit, offset}: {limit: number; offset?: number}): Promise<void> {
    await this.productsService.getCategoryProducts({
      compId: this.compId,
      limit,
      offset,
    });
    this.productsManifest = this.generateProductsManifest(this.productsService.products);
    this.updateComponent({
      products: this.productsService.products,
      productsManifest: this.productsManifest,
      productsVariantInfoMap: this.productsVariantInfoMap,
    });
  }

  private padProductListWithPlaceholders() {
    if (this.productsService.products.length < this.productsService.totalCount) {
      const realLength = this.productsService.products.length;
      this.productsService.products[this.productsService.totalCount - 1] = undefined;
      this.productsService.products.fill({isFake: true} as any, realLength, this.productsService.totalCount);
    }
  }

  private setSlotProps(products) {
    try {
      const slot = this.slotAPIFactory.getSlotAPI(ReviewsSlotIds.ProductGalleryDetailsSlot1);
      slot.namespace = STORES_NAMESPACE;
      slot.resourceList = products.map((product) => ({id: product.id}));
    } catch (e) {
      /* istanbul ignore next: nothing to test  */
      this.reportError(e);
    }
  }

  public async setInitialState(forceRender: boolean = false): Promise<void> {
    if (!forceRender && !this.shouldComponentRender()) {
      return this.updateComponent({
        isLoaded: false,
      });
    }

    const numOfColumns = this.config.style.styleParams.numbers.galleryColumns || 4;
    const numOfSets = 2;

    const fetcher = this.getDataFetcher();
    const [translations, response, {url}] = await Promise.all([
      getTranslations(translationPath(this.siteStore.baseUrls.galleryBaseUrl, this.siteStore.locale)),
      fetcher(),
      this.siteStore.getSectionUrl(PageMap.PRODUCT),
    ]).catch(this.reportError);

    this.isUrlWithOverrides = await this.customUrlApi.init();
    this.isCategoryVisible = response.catalog.category.visible;

    if (
      !this.siteStore.isSSR() &&
      this.galleryType === GALLERY_TYPE.COLLECTION &&
      this.productsService.totalCount > numOfSets * numOfColumns
    ) {
      this.padProductListWithPlaceholders();
      await this.productsService.getCategoryProducts({
        compId: this.compId,
        limit: numOfColumns * numOfSets,
        offset: this.productsService.totalCount - numOfColumns * numOfSets,
      });
    }

    const {products} = this.productsService;
    this.translations = translations;

    this.productPriceBreakdown = new ProductPriceBreakdown(this.siteStore, this.translations, {
      excludedPattern: 'gallery.price.tax.excludedParam.label',
      includedKey: 'gallery.price.tax.included.label',
      includedPattern: 'gallery.price.tax.includedParam.label',
      excludedKey: 'gallery.price.tax.excluded.label',
    });

    this.productPageSectionUrl = url;
    this.mainCollectionId = this.productsService.getMainCollectionId();
    this.productsManifest = this.generateProductsManifest(products);
    this.multilingualService = new MultilingualService(
      this.siteStore,
      this.publicData.COMPONENT,
      response.appSettings.widgetSettings
    );

    if (this.siteStore.experiments.enabled(Experiments.AddRatingSummarySlotToGallery)) {
      this.setSlotProps(products);
    }

    this.updateComponent(this.getPropsToInject(products));

    if (
      !this.siteStore.experiments.enabled('specs.stores.SliderGalleryWritePaginationMapToStorageOnlyOnClick') &&
      !this.siteStore.isSSR()
    ) {
      this.productsService.storeNavigation(this.siteStore.siteApis.currentPage.id);
    }
  }

  public onAppLoaded(): void {
    /* istanbul ignore next: hard to test it */
    if (this.isFedopsReport) {
      this.isFedopsReport = false;

      /* istanbul ignore next: debug */
      if (
        this.siteStore.experiments.enabled('specs.stores.ReportBiForEmptyGallery') &&
        !this.productsService.products.length
      ) {
        this.siteStore.webBiLogger.report(exposureEventForTests({testName: `empty-gallery-slider`}));
      }

      const {gallery_showPrice, showQuickView, gallery_hoverType} = this.styles;

      this.siteStore.webBiLogger.report(
        viewGallerySf({
          isMobileFriendly: this.siteStore.isMobileFriendly,
          addToCart: this.shouldShowAddToCartButton,
          hasPrice: gallery_showPrice,
          hasOptions: this.shouldShowProductOptions,
          hasQuantity: this.shouldShowQuantity,
          hasQuickView: showQuickView,
          hoverType: gallery_hoverType.value,
          priceBreakdown: this.productPriceBreakdown.priceBreakdownBIParam,
          navigationClick: this.getNavigationClick(),
          productsLogic: this.productsLogicForBi,
          galleryInputId: this.galleryInputIdForBi,
          productsList: this.productsService.products.map((product) => product.id).join(),
          algorithmId: this.algorithmIdForBi,
          algorithmProviderId: this.algorithmAppIdForBi,
          impressionId: this.impressionId,
          pageName: this.pageNameForBi,
        })
      );
    }
  }

  private getNavigationClick(): string {
    if (!this.shouldShowAddToCartButton) {
      return '';
    } else if (this.getAddToCartAction() === AddToCartActionOption.MINI_CART) {
      return 'mini-cart';
    } else if (this.getAddToCartAction() === AddToCartActionOption.CART) {
      return 'cart';
    }
    return 'none';
  }

  private get productsLogicForBi(): string {
    switch (this.galleryType) {
      case GALLERY_TYPE.VELO_PRODUCTS:
        return SLIDER_GALLERY_PRODUCTS_LOGICS_FOR_BI.VELO;
      case GALLERY_TYPE.COLLECTION:
        return this.mainCollectionId !== this.productsService.allProductsCategoryId
          ? SLIDER_GALLERY_PRODUCTS_LOGICS_FOR_BI.COLLECTION
          : SLIDER_GALLERY_PRODUCTS_LOGICS_FOR_BI.ALL_PRODUCTS;
      case GALLERY_TYPE.RELATED_PRODUCTS:
        return (
          this.publicData.COMPONENT.relatedProductsAlgorithmName ??
          SLIDER_GALLERY_PRODUCTS_LOGICS_FOR_BI.RELATED_PRODUCTS
        );
      case GALLERY_TYPE.ALGORITHMS:
        return this.publicData.COMPONENT.dataSourceAlgorithmName ?? SLIDER_GALLERY_PRODUCTS_LOGICS_FOR_BI.ALGORITHMS;
    }
  }

  private get galleryInputIdForBi(): string {
    switch (this.galleryType) {
      case GALLERY_TYPE.COLLECTION:
        return this.mainCollectionId;
      case GALLERY_TYPE.ALGORITHMS:
        return this.relatedProductIds.join(',');
      case GALLERY_TYPE.RELATED_PRODUCTS:
        return this.relatedProductIds.join(',');
    }
  }

  private get algorithmIdForBi(): string {
    switch (this.galleryType) {
      case GALLERY_TYPE.RELATED_PRODUCTS:
        return this.publicData.COMPONENT.relatedProductsAlgorithmId;
      case GALLERY_TYPE.ALGORITHMS:
        return this.publicData.COMPONENT.dataSourceAlgorithmId;
    }
  }

  private get algorithmAppIdForBi(): string {
    switch (this.galleryType) {
      case GALLERY_TYPE.RELATED_PRODUCTS:
        return this.publicData.COMPONENT.relatedProductsAppId;
      case GALLERY_TYPE.ALGORITHMS:
        return this.publicData.COMPONENT.dataSourceAppId;
    }
  }

  private get pageNameForBi(): string {
    const currentPage = this.siteStore.siteApis.currentPage;
    if (currentPage.applicationId) {
      return currentPage.url.slice(1);
    }
    if (currentPage.isHomePage) {
      return PAGE_NAMES_FOR_BI.HOME;
    }
    return PAGE_NAMES_FOR_BI.CUSTOM_PAGE;
  }

  private getPropsToInject(products: IProduct[]): IPropsInjectedByViewerScript {
    return {
      ...this.getCommonPropsToInject(),
      fitToContentHeight: true, // thunderbolt prop that sets height: auto on the widget instead of fixed height
      allowFreeProducts: this.addToCartService.allowFreeProducts,
      addedToCartStatus: this.addedToCartStatus,
      cssBaseUrl: this.siteStore.baseUrls.galleryBaseUrl,
      getCategoryProducts: this.getCateogryProducts.bind(this),
      handleProductItemClick: this.handleProductItemClick.bind(this),
      handleProductsOptionsChange: this.handleOptionSelectionsChange.bind(this),
      isFirstPage: true,
      isInteractive: this.siteStore.isInteractive(),
      isLiveSiteMode: this.siteStore.isSiteMode(),
      isPreviewMode: this.siteStore.isPreviewMode(),
      isLoaded: true,
      isSSR: this.siteStore.isSSR(),
      showShowLightEmptyState: this.productsService.hideGallery,
      hideGallery: this.productsService.hideGallery,
      shouldShowMobile: this.siteStore.isMobile(),
      isCategoryVisible: this.isCategoryVisible,
      isEditorMode: this.siteStore.isEditorMode(),
      isRTL: this.siteStore.isRTL(),
      mainCollectionId: this.mainCollectionId,
      onAppLoaded: this.onAppLoaded.bind(this),
      openQuickView: this.openQuickView.bind(this),
      productsManifest: this.productsManifest,
      productsVariantInfoMap: this.productsVariantInfoMap,
      products,
      shouldShowProductOptions: this.shouldShowProductOptions,
      ravenUserContextOverrides: {id: this.siteStore.storeId, uuid: this.siteStore.uuid},
      textsMap: this.getTextsMap(),
      totalProducts: this.productsService.totalCount,
      shouldShowAddToCartSuccessAnimation: this.getAddToCartAction() === AddToCartActionOption.NONE,
      galleryType: this.galleryType,
      handleAddToCart: this.handleAddToCart.bind(this),
      updateAddToCartStatus: this.updateAddToCartStatus.bind(this),
      productsPriceRangeMap: this.productsService.productPriceRangeMap,
      experiments: {
        isArrowlessMobileSliderEnabled: this.siteStore.experiments.enabled(
          Experiments.ClientGalleryArrowlessMobileSlider
        ),
        isAllowGalleryProductRoundCornersInViewer: this.siteStore.experiments.enabled(
          Experiments.AllowGalleryProductRoundCornersInViewer
        ),
        sliderGalleryInEditorX: this.siteStore.experiments.enabled(Experiments.SliderGalleryInEditorXViewer),
        addRatingSummarySlotToGallery: this.siteStore.experiments.enabled(Experiments.AddRatingSummarySlotToGallery),
      },
    };
  }

  private getTextsMap(): ITextsMap {
    return {
      addToCartContactSeller: this.translations['gallery.contactSeller.button'],
      addToCartOutOfStock:
        this.multilingualService.get('gallery_oosButtonText') || this.translations['gallery.outOfStock.button'],
      addToCartSuccessSR: this.translations['gallery.sr.addToCartSuccess'],
      digitalProductBadgeAriaLabelText: this.translations['sr.digitalProduct'],
      galleryAddToCartButtonText:
        this.multilingualService.get('gallery_addToCartText') || this.translations['gallery.addToCart.button'],
      galleryAddToCartPreOrderButtonText:
        this.multilingualService.get('gallery_preOrderText') || this.translations['gallery.preOrder.button'],
      noProductsMessageText: this.translations.NO_PRODUCTS_MESSAGE_MAIN,
      productOutOfStockText:
        this.multilingualService.get('gallery_oosButtonText') || this.translations.OUT_OF_STOCK_LABEL,
      productPriceAfterDiscountSR: this.translations['sr.PRODUCT_PRICE_AFTER_DISCOUNT'],
      productPriceBeforeDiscountSR: this.translations['sr.PRODUCT_PRICE_BEFORE_DISCOUNT'],
      productPriceWhenThereIsNoDiscountSR: this.translations['sr.PRODUCT_PRICE_WHEN_THERE_IS_NO_DISCOUNT'],
      quantityAddSR: this.translations['gallery.sr.addQty'],
      quantityChooseAmountSR: this.translations['gallery.sr.chooseQty'],
      quantityInputSR: this.translations['gallery.sr.quantity'],
      quantityMaximumAmountSR: this.translations['gallery.exceedsQuantity.error'],
      quantityMinimumAmountSR: this.translations['gallery.minimumQuantity.error'],
      quantityRemoveSR: this.translations['gallery.sr.removeQty'],
      quantityTotalSR: this.translations['gallery.sr.totalQty'],
      quickViewButtonText: this.translations.QUICK_VIEW,
      sliderGalleryNextProduct: this.translations['sr.sliderGallery.nextProduct'],
      sliderGalleryNoProductsMessageText: this.translations.NO_PRODUCTS_MESSAGE_MINI_GALLERY_MAIN,
      sliderGalleryPreviousProduct: this.translations['sr.sliderGallery.previousProduct'],
      sliderGalleryTitle: this.title,
      priceRangeText: this.translations['gallery.price.from.label'],
      pricePerUnitSR: this.translations['gallery.sr.units.basePrice.label'],
      arrowPrevious: this.translations['gallery.sr.carousel.previous.label'],
      carouselContainerLabel: this.translations['gallery.sr.carousel.container.label'],
      arrowNext: this.translations['gallery.sr.carousel.next.label'],
      measurementUnits: this.getMeasurementUnitsTranslation(),
      emptyCategoryEditorTitle: this.translations['gallery.editor.emptyState.title'],
      emptyCategoryEditorSubTitle: this.translations['gallery.editor.emptyState.subtitle'],
    };
  }

  private getMeasurementUnitsTranslation() {
    return _.reduce(
      unitsTranslations,
      (result, types, unit) => {
        result[unit] = result[unit] || {};
        _.each(types, (translationKey, type) => {
          result[unit][type] = this.translations[translationKey];
        });
        return result;
      },
      {}
    );
  }

  private generateProductsManifest(products: IProduct[]): ProductsManifest {
    return products
      .filter(({urlPart}) => Boolean(urlPart))
      .reduce((acc, product) => {
        acc[product.id] = {
          url: this.getProductPageUrl(product.urlPart),
          addToCartState: this.addToCartService.getButtonState({
            price: actualPrice(product),
            inStock: product.isInStock,
            isPreOrderState: isPreOrder(product),
          }),
        };
        return acc;
      }, {});
  }

  private getProductPageUrl(slug) {
    return /* istanbul ignore next: test */ this.isUrlWithOverrides
      ? this.customUrlApi.buildProductPageUrl({slug})
      : `${this.productPageSectionUrl}/${slug}`;
  }

  private async handleAddToCart({productId, index, quantity}: {productId: string; index: number; quantity: number}) {
    this.updateAddToCartStatus(productId, AddToCartActionStatus.IN_PROGRESS);

    await this.productsService.addToCart({
      productId,
      quantity,
      index,
      compId: this.compId,
      externalId: this.config.externalId,
      addToCartAction: this.getAddToCartAction(),
      impressionId: this.impressionId,
      galleryProductsLogic: this.productsLogicForBi,
      rank: index,
      galleryInputId: this.galleryInputIdForBi,
    });

    this.updateAddToCartStatus(productId, AddToCartActionStatus.SUCCESSFUL);
  }

  private readonly getAddToCartAction = () => this.styles.gallery_addToCartAction;

  private readonly updateAddToCartStatus = (productId: string, status: AddToCartActionStatus) => {
    this.addedToCartStatus = {
      ...this.addedToCartStatus,
      [productId]: status,
    };

    this.updateComponent({addedToCartStatus: this.addedToCartStatus});
  };

  private openQuickView({productId, index}: {productId: string; index: number; selectionIds?: number[]}) {
    const params = {
      compId: this.compId,
      externalId: this.config.externalId,
      galleryType: SLIDER_GALLERY_TYPE,
      galleryProductsLogic: this.productsLogicForBi,
      galleryInputId: this.galleryInputIdForBi,
      impressionId: this.impressionId,
    };

    return this.productsService.quickViewProduct(productId, index, {
      ...params,
    });
  }

  protected reportProductItemClick({productId, index}: {productId: string; index: number}) {
    const product = this.productsService.getProduct(productId);
    this.siteStore.webBiLogger.report(
      clickOnProductBoxSf({
        productId,
        hasRibbon: !!product.ribbon,
        hasOptions: !!product.options.length,
        index,
        productType: product.productType,
        galleryType: SLIDER_GALLERY_TYPE,
        galleryProductsLogic: this.productsLogicForBi,
        galleryInputId: this.galleryInputIdForBi,
        rank: index,
        impressionId: this.impressionId,
      })
    );
    this.productsService.sendClickTrackEvent(product, index);
  }

  private handleProductItemClick({
    biData: {productId, index},
  }: {
    biData: {
      productId: string;
      index: number;
    };
  }) {
    const product = this.productsService.getProduct(productId);

    this.productsService.storeNavigation(this.siteStore.siteApis.currentPage.id);

    this.reportProductItemClick({productId, index});
    this.siteStore.navigate(
      {
        sectionId: PageMap.PRODUCT,
        state: product.urlPart,
        queryParams: undefined,
      },
      true
    );
  }

  public updateState(
    config: IGalleryControllerConfig,
    newPublicData?: IGalleryControllerConfig['publicData'] & {appSettings?: any}
  ): void {
    this.config = config;
    if (this.siteStore.experiments.enabled(Experiments.FixSliderGalleryTextSettingToChangeOnEditor)) {
      if (newPublicData) {
        this.config.publicData = {
          ...this.config.publicData,
          COMPONENT: {...this.config.publicData.COMPONENT, ...newPublicData.COMPONENT},
        };
        this.multilingualService.setPublicData(this.config.publicData.COMPONENT);
      }
    } else {
      this.config.publicData = newPublicData;
      this.multilingualService.setPublicData(newPublicData.COMPONENT);
    }

    if (newPublicData?.appSettings) {
      this.multilingualService.setWidgetSettings(newPublicData.appSettings);
    }

    this.updateStyles();

    this.updateComponent({
      ...this.getCommonPropsToUpdate(),
      textsMap: this.getTextsMap(),
      productsPriceRangeMap: this.productsService.productPriceRangeMap,
      shouldShowProductOptions: this.shouldShowProductOptions,
    });
  }

  public get galleryType() {
    if (this.veloInputs) {
      return GALLERY_TYPE.VELO_PRODUCTS;
    }

    const presetId = this.publicData.COMPONENT.presetId;

    if (presetId === GALLERY_PUBLIC_DATA_PRESET_ID.COLLECTION) {
      return GALLERY_TYPE.COLLECTION;
    }
    if (presetId === GALLERY_PUBLIC_DATA_PRESET_ID.RELATED_PRODUCTS) {
      return GALLERY_TYPE.RELATED_PRODUCTS;
    }

    return presetId !== undefined ? GALLERY_TYPE.ALGORITHMS : GALLERY_TYPE.COLLECTION;
  }

  private getDataFetcher() {
    const dataFetcher = {
      [GALLERY_TYPE.COLLECTION]: () =>
        this.productsService.oldGetInitialData({
          externalId: this.config.externalId,
          compId: this.compId,
        }),
      [GALLERY_TYPE.RELATED_PRODUCTS]: () =>
        this.productsService.getRelatedProductsByAlgorithm({
          externalId: this.config.externalId,
          productIds: this.relatedProductIds,
          algorithmId: this.publicData.COMPONENT.relatedProductsAlgorithmId ?? RelatedProductsAlgorithmData.id,
          appId: this.publicData.COMPONENT.relatedProductsAppId ?? RelatedProductsAlgorithmData.appId,
        }),
      [GALLERY_TYPE.ALGORITHMS]: () =>
        this.productsService.getRelatedProductsByAlgorithm({
          externalId: this.config.externalId,
          productIds: this.relatedProductIds,
          algorithmId: this.publicData.COMPONENT.dataSourceAlgorithmId,
          appId: this.publicData.COMPONENT.dataSourceAppId,
        }),
    };

    if (this.veloInputs) {
      dataFetcher[GALLERY_TYPE.VELO_PRODUCTS] = () => {
        return this.productsService.getInitialData({
          externalId: this.config.externalId,
          compId: this.compId,
          sort: null,
          filters: this.veloInputs?.productIds
            ? ({
                term: {
                  field: 'id',
                  op: 'IN',
                  values: this.veloInputs.productIds,
                },
              } as ProductFilters)
            : null,
          limit: null,
          offset: 0,
          mainCollectionId: this.veloInputs?.collectionId ? this.veloInputs.collectionId : this.mainCollectionId,
        });
      };
    }

    return dataFetcher[this.galleryType];
  }

  private subscribe() {
    const forceRenderWhenEmpty = () => this.relatedProductIds.length === 0 && this.renderRelatedProducts();

    if (this.galleryType === GALLERY_TYPE.RELATED_PRODUCTS || this.galleryType === GALLERY_TYPE.ALGORITHMS) {
      setTimeout(forceRenderWhenEmpty, FORCE_RELATED_GALLERY_RENDER_TIMEOUT);
    }
  }

  public renderRelatedProducts(productIds: string[] = []) {
    this.relatedProductIds = [...productIds];
    this.setInitialState(true);
  }

  private shouldComponentRender() {
    if (!this.siteStore.isInteractive()) {
      return true;
    }
    return !(
      (this.galleryType === GALLERY_TYPE.RELATED_PRODUCTS || this.galleryType === GALLERY_TYPE.ALGORITHMS) &&
      this.relatedProductIds.length === 0
    );
  }

  private get title(): string {
    if (this.galleryType === GALLERY_TYPE.COLLECTION) {
      const collectionName =
        this.productsService.getMainCollectionId() === this.productsService.allProductsCategoryId
          ? this.translations['gallery.collection.allProducts']
          : this.productsService.collectionName;

      return this.multilingualService.get('SLIDER_GALLERY_TITLE_COLLECTION') || collectionName;
    }

    if (this.galleryType === GALLERY_TYPE.ALGORITHMS) {
      return (
        this.multilingualService.get('SLIDER_GALLERY_TITLE_ALGORITHM') ||
        this.translations['gallery.bestSellers.default.title']
      );
    }

    return (
      this.multilingualService.get('SLIDER_GALLERY_TITLE_RELATED_PRODUCTS') ||
      this.translations['gallery.relatedProducts.default.title']
    );
  }

  private get shouldShowAddToCartButton() {
    return this.styles.gallery_showAddToCartButton;
  }

  private get shouldShowQuantity() {
    return this.styles.gallery_showAddToCartQuantity;
  }

  protected get shouldShowProductOptions(): boolean {
    return false;
  }

  protected get stylesParams() {
    return stylesParams;
  }
}
