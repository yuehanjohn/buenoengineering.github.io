/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable import/no-cycle */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable no-nested-ternary */
import {
  IAddProductImpression,
  ICollectionIdsFilterDTO,
  IGetCategoryProducts,
  IGetInitialData,
  IOldGetInitialData,
  IProduct,
  IProductOption,
  ISorting,
  ReducedOptionSelection,
} from '../types/galleryTypes';
import {SiteStore} from '@wix/wixstores-client-storefront-sdk/dist/es/src/viewer-script/site-store/SiteStore';
import {DataApi, GetProductsRequest, GetProductsResponse} from '../api/DataApi';
import {GetDataQuery, ProductFilters} from '../graphql/queries-schema';
import {
  FedopsInteraction,
  origin,
  TRACK_EVENT_COLLECTION,
  trackEventMetaData,
  TrackEvents,
  BATCH_MAX_SIZE,
  MAX_PRODUCTS_BATCHING,
  DEFAULT_COLLECTION_ID,
} from '../constants';
import {
  AddToCartActionOption,
  APP_DEFINITION_ID,
  BiButtonActionType,
  STORAGE_PAGINATION_KEY,
} from '@wix/wixstores-client-core/dist/es/src/constants';
import {
  INavigationProductDescriptor,
  IStoreFrontNavigationContext,
} from '@wix/wixstores-client-core/dist/es/src/types/site-map';
import {
  actualPrice,
  actualSku,
  hasSubscriptionPlans,
  isPreOrder,
} from '@wix/wixstores-client-core/dist/es/src/productOptions/productUtils';
import {ProductsOptionsService, ProductsVariantInfoMap} from './ProductsOptionsService';
import {QuickViewActions} from '@wix/wixstores-client-storefront-sdk/dist/es/src/actions/QuickViewActions/QuickViewActions';
import {IOptionSelectionVariant} from '@wix/wixstores-client-core/dist/es/src/types/product';
import {getProductVariantBySelectionIds} from '@wix/wixstores-client-core/dist/es/src/productVariantCalculator/ProductVariantCalculator';
import {ProductsPriceRangeService, ProductsPriceRangeServiceMap} from './ProductsPriceRangeService';
import _ from 'lodash';
import {CartActions} from '@wix/wixstores-client-storefront-sdk/dist/es/src/actions/CartActions/CartActions';
import {IProductItem} from '@wix/wixstores-graphql-schema/dist/es/src/graphql-schema';
import {clickAddToCartWithOptionsSf, clickedOnProductQuickViewSf} from '@wix/bi-logger-ec-sf/v2';
import type {ControllerFlowAPI} from '@wix/yoshi-flow-editor';

export class ProductsService {
  private readonly dataApi: DataApi;
  public products: IProduct[];
  private readonly productsOptionsService = new ProductsOptionsService();
  private readonly priceRangeService = new ProductsPriceRangeService();
  public totalCount: number;
  public collectionName: string;
  private filters: ProductFilters = null;
  private collectionIds: ICollectionIdsFilterDTO;
  private sorting?: ISorting;
  public hideGallery = false;
  public allProductsCategoryId: string = DEFAULT_COLLECTION_ID;
  private readonly quickViewActions: QuickViewActions;
  private readonly cartActions: CartActions;

  constructor(
    private readonly siteStore: SiteStore,
    private productsPerPage: number,
    private readonly consumerName: string,
    private withOptions: boolean,
    private readonly withPriceRange: boolean,
    private readonly fedopsLogger,
    private readonly shouldUseWarmupData: boolean,
    private readonly panoramaClient: ControllerFlowAPI['panoramaClient']
  ) {
    this.dataApi = new DataApi(this.siteStore);
    this.quickViewActions = new QuickViewActions(this.siteStore);
    this.cartActions = new CartActions({siteStore: this.siteStore, origin});
  }

  public updateSort = (sorting: ISorting) => {
    this.sorting = sorting;
  };

  public updateFilters = (filters: ProductFilters) => {
    this.filters = filters;
  };

  private setProducts(products: IProduct[]) {
    this.products = products;
    this.productsOptionsService.addProducts(this.products);
    this.priceRangeService.addProducts(this.products);
  }

  public async getProducts({
    filters,
    collectionIds,
    sorting,
    shouldSpecificCollectionQuery,
    limit,
  }: {
    filters: ProductFilters;
    collectionIds: ICollectionIdsFilterDTO;
    sorting?: ISorting;
    shouldSpecificCollectionQuery?: boolean;
    limit?: number;
  }): Promise<IProduct[]> {
    const request = {
      offset: 0,
      limit: limit || this.productsPerPage,
      collectionId: shouldSpecificCollectionQuery ? collectionIds.subCategory : collectionIds.mainCategory,
      withOptions: this.withOptions,
      withPriceRange: this.withPriceRange,
      sorting,
      filters: shouldSpecificCollectionQuery ? null : filters,
    };

    const mergeGetProductsResponses = (responseA: GetProductsResponse, responseB: GetProductsResponse) => {
      responseA.list = responseA.list.concat(responseB.list);
      return responseA;
    };

    const response = await this.fetchQueryWithBatches<GetProductsRequest, GetProductsResponse>({
      request,
      fetchingFunction: (req: GetProductsRequest) => this.dataApi.getProductsByOffset(req),
      mergingFunction: mergeGetProductsResponses,
    });

    this.totalCount = response.totalCount;
    this.setProducts(response.list);
    this.filters = filters;
    this.collectionIds = collectionIds;
    this.sorting = sorting;
    this.sendTrackEvent(0);
    return this.products;
  }

  public handleProductsOptionsChange({productId, selectionIds}: {productId: string; selectionIds: number[]}): void {
    const product = this.products.find((p) => p.id === productId);

    this.productsOptionsService.handleUserInput(product.id, selectionIds);
    this.priceRangeService.handleUserInput(product.id, selectionIds);
  }

  public getProductAndVariantById(productId: string): {
    product: IProduct;
    variant: IProductItem;
  } {
    const product = this.products.find((p) => p.id === productId);
    const optionsSelectionsIds = this.productsOptionsService.getVariantSelectionIds(productId);
    const variant = getProductVariantBySelectionIds({product, variantSelectionIds: optionsSelectionsIds});

    return {product, variant};
  }

  public async oldGetInitialData(options: Omit<IOldGetInitialData, 'withPriceRange'>): Promise<GetDataQuery> {
    const {data} = await this.dataApi.oldGetInitialData({
      ...options,
      limit: this.productsPerPage,
      withPriceRange: this.withPriceRange,
      withOptions: this.withOptions,
    });
    return this.initState(data);
  }

  private async fetchQueryWithBatches<R extends {limit?: number; offset?: number}, S>({
    request,
    fetchingFunction,
    mergingFunction,
  }: {
    request: R;
    fetchingFunction: (r: R) => Promise<S>;
    mergingFunction: (s1: S, s2: S) => S;
  }) {
    const {limit, offset} = request;

    const responsesPromises: Promise<S>[] = [];

    const totalProducts = limit - offset;
    const batches = Math.floor(totalProducts / BATCH_MAX_SIZE);
    let currentOffset = offset;

    for (let i = 0; i < batches; i++) {
      const batchOption = {
        ...request,
        limit: BATCH_MAX_SIZE,
        offset: currentOffset,
      };
      responsesPromises.push(fetchingFunction(batchOption));
      currentOffset += BATCH_MAX_SIZE;
    }

    const remainder = totalProducts % BATCH_MAX_SIZE;
    if (remainder) {
      const batchOption = {
        ...request,
        limit: remainder,
        offset: currentOffset,
      };
      responsesPromises.push(fetchingFunction(batchOption));
    }

    const response: S[] = await Promise.all(responsesPromises);

    return response.reduce(mergingFunction);
  }

  private async fetchInitialDataWithBatch(options: IGetInitialData) {
    const maxLimit = Math.min(options.limit, MAX_PRODUCTS_BATCHING);
    options.limit = maxLimit;

    const mergeGetInitialDataResponses = (responseA: {data: GetDataQuery}, responseB: {data: GetDataQuery}) => {
      /* istanbul ignore next: hypothetical case - TBD check with experiment whether can be deleted */
      if (responseB.data.catalog.category === null) {
        return responseA;
      }

      responseA.data.catalog.category.productsWithMetaData.list =
        responseA.data.catalog.category.productsWithMetaData.list.concat(
          responseB.data.catalog.category.productsWithMetaData.list
        );

      return responseA;
    };

    return this.fetchQueryWithBatches<
      IGetInitialData,
      {
        data: GetDataQuery;
      }
    >({
      request: options,
      fetchingFunction: (request: IGetInitialData) => this.dataApi.getInitialData(request),
      mergingFunction: mergeGetInitialDataResponses,
    });
  }

  public async getInitialData(options: Omit<IGetInitialData, 'withOptions' | 'withPriceRange'>): Promise<GetDataQuery> {
    let limit;
    if (options.limit) {
      limit = options.limit;
    } else {
      limit = this.productsPerPage;
    }

    const optionsWithOverrides = {
      ...options,
      limit,
      withOptions: this.withOptions,
      withPriceRange: this.withPriceRange,
    };

    let data;
    if (this.shouldUseWarmupData) {
      const optionsWithOverridesAsString = Object.keys(optionsWithOverrides)
        .filter((option) => !!optionsWithOverrides[option])
        .map((option) => `${option}=${optionsWithOverrides[option]}`)
        .join('_');
      const key = `gallery_${this.siteStore.getCurrentCurrency()}_${optionsWithOverridesAsString}`;
      const maybeWarmupData = this.siteStore.windowApis.warmupData.get(key);
      if (maybeWarmupData) {
        data = maybeWarmupData;
      } else {
        data = (await this.fetchInitialDataWithBatch(optionsWithOverrides)).data;
        this.siteStore.windowApis.warmupData.set(key, data);
      }
    } else {
      data = (await this.fetchInitialDataWithBatch(optionsWithOverrides)).data;
    }
    return this.initState(data);
  }

  public async getRelatedProductsByAlgorithm(options: {
    externalId: string;
    productIds: string[];
    algorithmId: string;
    appId: string;
  }) {
    const {data} = await this.dataApi.getRelatedProductsByAlgorithm({
      ...options,
      withOptions: this.withOptions,
      withPriceRange: this.withPriceRange,
    });
    const parsedData: Pick<GetDataQuery, 'catalog' | 'appSettings'> = {
      catalog: {
        category: {
          productsWithMetaData: {
            list: data.catalog.relatedProducts,
            totalCount: data.catalog.relatedProducts.length,
          },
          name: '',
          id: '',
          visible: true,
        },
        allProductsCategoryId: null,
      },
      appSettings: data.appSettings,
    };
    this.initState(parsedData);
    return parsedData;
  }

  private initState(data: GetDataQuery): GetDataQuery {
    if (data.catalog.category === null) {
      // slider gallery
      data.catalog.category = {productsWithMetaData: {list: [], totalCount: 0}, id: '', name: '', visible: true};
      this.hideGallery = true;
    }

    this.setProducts(data.catalog.category.productsWithMetaData.list);
    this.setMainCollection(data.catalog.category.id);
    this.collectionName = data.catalog.category.name;
    this.totalCount = data.catalog.category.productsWithMetaData.totalCount;
    if (data.catalog.allProductsCategoryId) {
      this.allProductsCategoryId = data.catalog.allProductsCategoryId;
    }
    this.sendTrackEvent(0);
    return data;
  }

  public sendTrackEvent(fromIndex: number): void {
    if (this.siteStore.isSSR()) {
      return;
    }

    const items: IAddProductImpression[] = this.products.slice(fromIndex).map((p, i) => ({
      id: p.id,
      name: p.name,
      list: this.consumerName,
      category: TRACK_EVENT_COLLECTION,
      position: i + fromIndex,
      price: p.comparePrice || p.price,
      currency: this.siteStore.currency,
      dimension3: p.isInStock ? 'in stock' : 'out of stock',
    }));

    this.siteStore.windowApis.trackEvent('AddProductImpression', {
      appDefId: APP_DEFINITION_ID,
      contents: items,
      origin: 'Stores',
    });
  }

  public hasMoreProductsToLoad(): boolean {
    return this.products.length < this.totalCount;
  }

  public setProductsPerPage(productsPerPage: number): void {
    this.productsPerPage = productsPerPage;
  }

  public getProductPerPage(): number {
    return this.productsPerPage;
  }

  public setWithOptions(withOptions: boolean): void {
    this.withOptions = withOptions;
  }

  public getProduct(id: string): IProduct {
    return this.products.find((p) => p.id === id);
  }

  public async getCategoryProducts({compId, limit, offset}: IGetCategoryProducts): Promise<void> {
    const {data} = await this.dataApi.getCategoryProducts({
      compId,
      limit,
      offset,
      withOptions: this.withOptions,
      withPriceRange: this.withPriceRange,
    });
    const retrievedProducts = data.catalog.category.productsWithMetaData.list;
    this.products.splice(offset, retrievedProducts.length, ...retrievedProducts);
    this.setProducts(this.products);
  }

  public async loadMoreProducts({
    visibleProducts,
    shouldSpecificCollectionQuery,
  }: {
    visibleProducts: number;
    shouldSpecificCollectionQuery?: boolean;
  }): Promise<IProduct[]> {
    const apiResponse = await this.dataApi.getProducts({
      fromIndex: visibleProducts,
      toIndex: visibleProducts + this.productsPerPage,
      withOptions: this.withOptions,
      withPriceRange: this.withPriceRange,
      sorting: this.sorting,
      filters: shouldSpecificCollectionQuery ? null : this.filters,
      collectionId: shouldSpecificCollectionQuery ? this.collectionIds.subCategory : this.collectionIds.mainCategory,
    });
    if (apiResponse.list.length === 0) {
      return null;
    }
    this.setProducts(this.products.concat([...apiResponse.list]));
    this.sendTrackEvent(visibleProducts);
    return this.products;
  }

  public async loadProducts({
    from,
    to,
    shouldSpecificCollectionQuery,
  }: {
    from: number;
    to: number;
    shouldSpecificCollectionQuery?: boolean;
  }): Promise<IProduct[]> {
    const apiResponse = await this.dataApi.getProducts({
      fromIndex: from,
      toIndex: to,
      withOptions: this.withOptions,
      withPriceRange: this.withPriceRange,
      sorting: this.sorting,
      filters: shouldSpecificCollectionQuery ? null : this.filters,
      collectionId: shouldSpecificCollectionQuery ? this.collectionIds.subCategory : this.collectionIds.mainCategory,
    });
    this.setProducts([...apiResponse.list]);
    this.totalCount = apiResponse.totalCount;
    return this.products;
  }

  public async sortProducts(sorting: ISorting, shouldSpecificCollectionQuery: boolean): Promise<IProduct[]> {
    await this.getProducts({
      filters: this.filters,
      collectionIds: this.collectionIds,
      sorting,
      shouldSpecificCollectionQuery,
    });
    return this.products;
  }

  public async filterProducts({
    filters,
    collectionIds,
    shouldSpecificCollectionQuery,
    limit,
  }: {
    filters: ProductFilters;
    collectionIds: ICollectionIdsFilterDTO;
    shouldSpecificCollectionQuery: boolean;
    limit?: number;
  }): Promise<IProduct[]> {
    this.setProducts(
      await this.getProducts({
        filters,
        collectionIds,
        sorting: this.sorting,
        shouldSpecificCollectionQuery,
        limit,
      })
    );
    return this.products;
  }

  public getMainCollectionId(): string {
    return this.collectionIds.mainCategory;
  }

  public storeNavigation(pageId: string): void {
    const paginationMap = this.products
      .filter((p) => (p as any).isFake !== true)
      .map((p) => ({slug: p.urlPart, id: p.id})) as INavigationProductDescriptor[];

    const history: IStoreFrontNavigationContext = {
      pageId,
      paginationMap,
      pagePath: this.siteStore.location.path,
    };

    this.siteStore.storage.local.setItem(STORAGE_PAGINATION_KEY, JSON.stringify(history));
  }

  public quickViewProduct(
    productId: string,
    index: number,
    params: {
      galleryProductsLogic?: string;
      galleryType?: string;
      compId?: string;
      externalId?: string;
      selectionIds?: number[];
      quantity?: number;
      galleryInputId?: string;
      impressionId?: string;
    }
  ): Promise<any> {
    const product = this.getProduct(productId);
    this.siteStore.webBiLogger.report(
      clickedOnProductQuickViewSf({
        productId,
        hasRibbon: !!product.ribbon,
        hasOptions: this.hasOptions(product),
        index,
        galleryProductsLogic: params.galleryProductsLogic,
        galleryType: params.galleryType,
        rank: index,
        galleryInputId: params.galleryInputId,
        impressionId: params.impressionId,
      })
    );
    this.sendClickTrackEvent(product, index);
    return this.quickViewActions.quickViewProduct({
      origin: this.consumerName.split(' ').join('-'),
      urlPart: product.urlPart,
      compId: params.compId,
      externalId: params.externalId,
      selectionIds: params.selectionIds,
      quantity: params.quantity,
      title: product.name,
    });
  }

  public sendClickTrackEvent(product: IProduct, index: number): void {
    this.siteStore.windowApis.trackEvent('ClickProduct', {
      appDefId: APP_DEFINITION_ID,
      id: product.id,
      origin: 'Stores',
      name: product.name,
      list: 'Grid Gallery',
      category: TRACK_EVENT_COLLECTION,
      position: index,
      price: product.comparePrice || product.price,
      currency: this.siteStore.currency,
      type: product.productType,
      sku: product.sku,
    });
  }

  private readonly hasOptions = (product: IProduct) => !!product.options.length;

  private readonly hasSubscriptionPlans = (product: IProduct) => {
    return hasSubscriptionPlans(product);
  };

  private readonly flatAndEnrichSelections = (productOptions: IProductOption[]): ReducedOptionSelection[] =>
    _.flatten(
      productOptions.map(({selections, key: optionKey, id: optionId}) =>
        selections.map<ReducedOptionSelection>(({key: selectionKey, id: selectionId}) => ({
          selectionKey,
          selectionId,
          optionId,
          optionKey,
        }))
      )
    );
  private readonly calculateVariantOptions = (selectionIds: number[], product: IProduct): Record<string, string> => {
    const selectionSet = selectionIds.reduce((set, id) => set.add(id), new Set());
    return this.flatAndEnrichSelections(product.options)
      .filter((enrichedSelection) => selectionSet.has(enrichedSelection.selectionId))
      .reduce((acc, enrichedSelection) => {
        acc[enrichedSelection.optionKey] = enrichedSelection.selectionKey;
        return acc;
      }, {});
  };

  private getAddToCartActionBi(addToCartAction: AddToCartActionOption, shouldNavigateToCart: boolean) {
    if (!shouldNavigateToCart && addToCartAction === AddToCartActionOption.TINY_CART) {
      return 'tiny-cart';
    } else if (!shouldNavigateToCart && addToCartAction === AddToCartActionOption.MINI_CART) {
      return 'mini-cart';
    } else if (
      addToCartAction === AddToCartActionOption.CART ||
      (shouldNavigateToCart && addToCartAction !== AddToCartActionOption.NONE)
    ) {
      return 'cart';
    } else {
      return 'none';
    }
  }

  public async addToCart({
    productId,
    index,
    quantity,
    compId,
    externalId,
    addToCartAction,
    impressionId,
    galleryProductsLogic,
    rank,
    galleryInputId,
  }: {
    productId: string;
    index: number;
    quantity: number;
    compId: string;
    externalId: string;
    addToCartAction: AddToCartActionOption;
    impressionId?: string;
    galleryProductsLogic?: string;
    rank?: number;
    galleryInputId?: string;
  }): Promise<any> {
    const product = this.getProduct(productId);
    const trackParams = this.getTrackEventParams(product);
    const optionsSelectionsIds = this.productsOptionsService.getVariantSelectionIds(productId);
    const shouldOpenQuickView =
      !this.productsOptionsService.canAddToCart(productId) || this.hasSubscriptionPlans(product);

    if (shouldOpenQuickView) {
      this.siteStore.webBiLogger.report(
        clickAddToCartWithOptionsSf({
          appName: 'galleryApp',
          origin,
          hasOptions: true,
          productId,
          productType: product.productType,
          navigationClick: this.siteStore.isMobile() ? 'product-page' : 'quick-view',
          impressionId,
          galleryProductsLogic,
          rank,
          galleryInputId,
        })
      );
      return this.quickViewProduct(productId, index, {
        compId,
        externalId,
        selectionIds: optionsSelectionsIds,
        quantity,
      });
    }

    const optionsSelectionsByNames = this.calculateVariantOptions(optionsSelectionsIds, product);
    const shouldNavigateToCart = this.cartActions.shouldNavigateToCart();
    const variant = getProductVariantBySelectionIds({product, variantSelectionIds: optionsSelectionsIds});

    this.siteStore.windowApis.trackEvent(TrackEvents.ViewContent, trackParams);
    this.fedopsLogger.interactionStarted(FedopsInteraction.AddToCart);
    this.panoramaClient.transaction(FedopsInteraction.AddToCart).start();

    const isPreOrderState = isPreOrder(product, variant);
    return this.cartActions.addToCart(
      {
        addToCartAction,
        onSuccess: () => {
          this.fedopsLogger.interactionEnded(FedopsInteraction.AddToCart);
          this.panoramaClient.transaction(FedopsInteraction.AddToCart).finish();
        },
        optionsSelectionsByNames,
        optionsSelectionsIds,
        productId,
        quantity,
        variantId: variant?.id,
        preOrderRequested: isPreOrderState,
      },
      {
        ...trackParams,
        buttonType: isPreOrderState ? BiButtonActionType.PreOrder : BiButtonActionType.AddToCart,
        appName: 'galleryApp',
        productType: product.productType as any,
        isNavigateCart: shouldNavigateToCart,
        navigationClick: this.getAddToCartActionBi(addToCartAction, shouldNavigateToCart),
        impressionId,
        galleryProductsLogic,
        rank,
        galleryInputId,
      }
    );
  }

  private getTrackEventParams(product: IProduct) {
    const variantSelectionIds = this.productsOptionsService.getVariantSelectionIds(product.id);
    const variant = getProductVariantBySelectionIds({product, variantSelectionIds}) as IOptionSelectionVariant;
    return {
      ...trackEventMetaData,
      id: product.id,
      name: product.name,
      price: actualPrice(product, variant),
      currency: this.siteStore.currency,
      sku: actualSku(product, variant),
      type: product.productType,
    };
  }

  public clearSelections() {
    this.productsOptionsService.clearSelections();
    this.priceRangeService.clearSelections();
  }

  public getVariantInfoMap(): ProductsVariantInfoMap {
    return this.productsOptionsService.getVariantInfoMap();
  }

  public get productPriceRangeMap(): ProductsPriceRangeServiceMap {
    return this.withPriceRange ? this.priceRangeService.getProductPriceRangeMap() : {};
  }

  public async getCategoryInitialData(externalId: string) {
    const data = await this.dataApi.getCategoryInitialData({externalId});
    this.allProductsCategoryId = data?.data?.catalog?.allProductsCategoryId || DEFAULT_COLLECTION_ID;
    return data;
  }

  public setMainCollection = (collectionId: string) => {
    this.collectionIds = {mainCategory: collectionId};
  };
}
