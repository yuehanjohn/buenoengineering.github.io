import _ from 'lodash';
import {
  ProductType,
  CartType,
  newCartToOldCartStructure,
  APP_DEFINITION_ID,
  Topology,
  PageMap,
  BiButtonActionType,
  getLocaleNamespace,
} from '@wix/wixstores-client-core';
import {ICartItem, IDataResponse} from '../../types/cart';
import {SiteStore, CartActions} from '@wix/wixstores-client-storefront-sdk';
import {isWorker} from '@wix/wixstores-client-storefront-sdk/dist/es/src/viewer-script/utils';
import {ICartIconStyleParams, ICtrlProps} from '../../types/app-types';
import {ICart} from '@wix/wixstores-graphql-schema';
import {query as queryNode} from '../../graphql/getDataNode.graphql';
import {query as queryNodeForSitesWithHiddenMiniCart} from '../../graphql/getDataNodeForSitesWithHiddenMiniCart.graphql';
import {query as getAppSettingsData} from '../../graphql/getAppSettingsData.graphql';
import {ITrackEventParams} from '@wix/native-components-infra/dist/es/src/types/wix-sdk';
import {IControllerConfig} from '@wix/native-components-infra/dist/es/src/types/types';
import {PubSubManager} from '@wix/wixstores-client-storefront-sdk/dist/es/src/services/PubSubManager/PubSubManager';
import {getCatalogAppId} from '../../utils/utils';
import {clickOnAddToCartSf} from '@wix/bi-logger-ec-sf/v2';
import {cartCartIconLoaded, cartClickOnCartIconToOpenMiniCart, clickToViewCartPage} from '@wix/bi-logger-ec-site/v2';
import {EMPTY_CART_GUID, experiments, FedopsInteraction} from '../../constants';
import {ControllerParams} from '@wix/yoshi-flow-editor';
import {CartCacheService} from '../services/CartCacheService';

export class CartIconStore {
  private appSettingsPromise?: Promise<any>;
  private cart?: any;
  private cartPromise?: Promise<any>;
  private readonly cartActions: CartActions;
  private readonly isStartReported: boolean = false;
  private readonly pubSubManager: PubSubManager;
  private appSettings?: {[key: string]: any};
  private styleParams: ICartIconStyleParams;

  constructor(
    private readonly siteStore: SiteStore,
    private readonly config: IControllerConfig,
    private readonly setProps: (props: any) => void,
    private readonly reportError: (e: any) => any,
    private readonly translations: ControllerParams['flowAPI']['translations'],
    private readonly fedops: ControllerParams['flowAPI']['fedops'],
    private readonly cartCacheService: CartCacheService
  ) {
    this.cartCacheService = cartCacheService;
    this.isStartReported = true;
    this.pubSubManager = new PubSubManager(this.siteStore.pubSub);
    this.cartActions = new CartActions({
      siteStore: this.siteStore,
      origin: 'cart-icon',
    });
    this.styleParams = this.config.style.styleParams;

    if (this.siteStore.isSiteMode() || this.siteStore.isPreviewMode()) {
      this.registerEvents();
    }

    this.handleCurrencyChange();

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    this.siteStore.siteApis.onInstanceChanged(() => this.refreshData(), APP_DEFINITION_ID);
  }

  private handleCurrencyChange() {
    let currency = this.siteStore.location.query.currency;

    this.siteStore.location.onChange(() => {
      if (currency !== this.siteStore.location.query.currency) {
        currency = this.siteStore.location.query.currency;

        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.refreshData();
      }
    });
  }

  public async refreshData(): Promise<void> {
    this.cartPromise = this.loadCartFromServer();
    const cart = await this.cartPromise;
    this.pubSubManager.publish('Minicart.OnInitialData', cart.cartSummary);
    this.updateCart(cart.cartSummary);
  }

  public updateCart(cart: ICart): void {
    this.cart = cart;

    const count = this.getTotalQuantity(this.cart.items);
    this.setProps({
      ...this.getCountRelatedProps(count),
    });
    void this.cartPromise?.then(({widgetSettings}) => {
      const shouldUseMemberIdAsCacheKey = this.siteStore.experiments.enabled(experiments.ShouldUseMemberIdAsCacheKey);
      const cartData: IDataResponse = {cartSummary: cart, widgetSettings};
      if (this.siteStore.experiments.enabled(experiments.UseCartCache)) {
        void this.cartCacheService.set(this.getCachedMemberId(), cartData, shouldUseMemberIdAsCacheKey);
      }
    });
  }

  public registerEvents(): void {
    this.pubSubManager.subscribe('Cart.Cleared', (res) => {
      if (res.data.cartId === this.cart.cartId) {
        this.updateCart({items: []});
      }
    });

    this.pubSubManager.subscribe('Cart.Changed', (res) => {
      this.updateCart(res.data);
    });

    if (!this.siteStore.isMobile()) {
      setTimeout(this.initPopup, 0);
    }
  }

  public async setInitialStateAsync(): Promise<void> {
    const cartPromise = this.siteStore.isSSR() ? undefined : this.getData();
    return Promise.all([this.getAppSettingsData(), this.siteStore.getSectionUrl(PageMap.CART)])
      .then(([serverResponse, cartLink]) => {
        this.cart = serverResponse.cartSummary || {};
        const count = this.cart.items ? this.getTotalQuantity(this.cart.items) : undefined;

        const props = {
          ...this.getCountRelatedProps(count),
          cartLink: _.get(cartLink, 'url', ''),
          fitToContentHeight: true,
          isInteractive: this.siteStore.isInteractive(),
          isLoaded: true,
          displayText: this.getDisplayText(serverResponse.widgetSettings),
          triggerFocus: false,
          onFocusTriggered: this.onFocusTriggered,
          isNavigate: !this.isOpenPopup(),
          onIconClick: this.onIconClick,
          onAppLoaded: this.onAppLoaded,
          ravenUserContextOverrides: {
            id: this.siteStore.storeId,
            uuid: this.siteStore.uuid,
          },
          shouldSetUndefinedUntilLoadCart: this.siteStore.experiments.enabled(
            experiments.ShouldSetUndefinedUntilLoadCart
          ),
        } as ICtrlProps;
        this.setProps(props);

        cartPromise
          ?.then(({cartSummary}) => {
            this.cart = cartSummary;
            const count = this.cart.items ? this.getTotalQuantity(this.cart.items) : 0;
            this.setProps({
              ...this.getCountRelatedProps(count),
            });
          })
          .catch((e) => this.reportError(e));
      })
      .catch((e) => this.reportError(e));
  }

  public async setInitialState(): Promise<void> {
    return Promise.all([
      this.siteStore.isSSR() ? this.getAppSettingsData() : this.getData(),
      this.siteStore.getSectionUrl(PageMap.CART),
    ])
      .then(([serverResponse, cartLink]) => {
        this.cart = serverResponse.cartSummary || {};
        const count = this.cart.items ? this.getTotalQuantity(this.cart.items) : 0;

        const props = {
          ...this.getCountRelatedProps(count),
          cartLink: _.get(cartLink, 'url', ''),
          fitToContentHeight: true,
          isInteractive: this.siteStore.isInteractive(),
          isLoaded: true,
          displayText: this.getDisplayText(serverResponse.widgetSettings),
          triggerFocus: false,
          onFocusTriggered: this.onFocusTriggered,
          isNavigate: !this.isOpenPopup(),
          onIconClick: this.onIconClick,
          onAppLoaded: this.onAppLoaded,
          ravenUserContextOverrides: {
            id: this.siteStore.storeId,
            uuid: this.siteStore.uuid,
          },
          shouldSetUndefinedUntilLoadCart: this.siteStore.experiments.enabled(
            experiments.ShouldSetUndefinedUntilLoadCart
          ),
        } as ICtrlProps;
        this.setProps(props);
      })
      .catch((e) => this.reportError(e));
  }

  public onFocusTriggered = (): void => {
    this.setProps({
      triggerFocus: false,
    });
  };

  public onAppLoaded = (): void => {
    if (!isWorker() || this.siteStore.isInteractive()) {
      const shouldReport = this.siteStore.storage.memory.getItem('cartIconLoaded');
      if (!shouldReport) {
        this.siteStore.storage.memory.setItem('cartIconLoaded', 'true');
        this.reportCartIconLoaded();
      }
    }
  };

  private readonly reportCartIconLoaded = (): void => {
    const baseBiParams = {
      isMobileFriendly: this.siteStore.isMobileFriendly,
      navigationClick: this.shouldOpenMinicartFromSettings() ? 'mini cart' : 'cart',
    };

    void this.siteStore.webBiLogger.report(
      cartCartIconLoaded({
        ...baseBiParams,
        catalogAppId: getCatalogAppId(this.cart?.items || []),
      })
    );
  };

  public getDisplayText(widgetSettings?: {[key: string]: string}): string {
    const defaultValue = this.translations.t(`CART_ICON_${this.styleParams.numbers.cartWidgetIcon || 1}`);
    let widgetSettingsForLocale = {};
    const multiLangFields = this.siteStore.getMultiLangFields();
    if (multiLangFields && !multiLangFields.isPrimaryLanguage) {
      if (widgetSettings) {
        widgetSettingsForLocale = widgetSettings[getLocaleNamespace(multiLangFields.lang)];
        return _.get(widgetSettingsForLocale, 'CART_ICON_TEXT', '') || defaultValue;
      } else if (this.appSettings) {
        widgetSettingsForLocale = this.appSettings[getLocaleNamespace(multiLangFields.lang)];
        return _.get(widgetSettingsForLocale, 'CART_ICON_TEXT', '') || defaultValue;
      }
    }
    return (
      _.get(this.appSettings, 'main.CART_ICON_TEXT', '') ||
      _.get(this.config, 'publicData.APP.CART_ICON_TEXT', '') ||
      defaultValue
    );
  }

  public updateStyleParams(newStyleParams: ICartIconStyleParams) {
    this.styleParams = newStyleParams;
    this.setProps({
      displayText: this.getDisplayText(),
    });
  }

  public updateAppSettings(appSettings: {[key: string]: any}) {
    this.appSettings = appSettings;
    this.setProps({
      displayText: this.getDisplayText(),
    });
  }

  public getCachedMemberId(): string {
    return this.siteStore.usersApi?.currentUser?.loggedIn ? this.siteStore.usersApi?.currentUser?.id : 'Visitor';
  }

  public async getData(): Promise<IDataResponse> {
    if (this.cartPromise) {
      return this.cartPromise;
    }
    if (this.siteStore.experiments.enabled(experiments.UseCartCache)) {
      this.cartPromise = this.getCartFromCacheOrServer();
    } else {
      this.fedops.interactionStarted(FedopsInteraction.GET_CART_WITHOUT_CACHE);
      this.cartPromise = this.loadCartFromServer().then((cartData) => {
        this.fedops.interactionEnded(FedopsInteraction.GET_CART_WITHOUT_CACHE);
        return cartData;
      });
    }
    return this.cartPromise;
  }

  private async getCartFromCacheOrServer(): Promise<IDataResponse> {
    try {
      const shouldUseMemberIdAsCacheKey = this.siteStore.experiments.enabled(experiments.ShouldUseMemberIdAsCacheKey);
      this.fedops.interactionStarted(FedopsInteraction.GET_CART_DATA);
      this.fedops.interactionStarted(FedopsInteraction.GET_CART_FROM_CACHE);
      this.fedops.interactionStarted(FedopsInteraction.GET_CART_FROM_CACHE_UNDEFINED);
      const cartDataFromCache = await this.cartCacheService.get(this.getCachedMemberId(), shouldUseMemberIdAsCacheKey);
      if (cartDataFromCache) {
        this.fedops.interactionEnded(FedopsInteraction.GET_CART_DATA);
        this.fedops.interactionEnded(FedopsInteraction.GET_CART_FROM_CACHE);
        return cartDataFromCache;
      }
      this.fedops.interactionEnded(FedopsInteraction.GET_CART_FROM_CACHE_UNDEFINED);
      this.fedops.interactionStarted(FedopsInteraction.GET_CART_FROM_SERVER);
      const cartData = await this.loadCartFromServer();
      this.fedops.interactionEnded(FedopsInteraction.GET_CART_FROM_SERVER);
      this.fedops.interactionEnded(FedopsInteraction.GET_CART_DATA);
      void this.cartCacheService.set(this.getCachedMemberId(), cartData, shouldUseMemberIdAsCacheKey);
      return cartData;
    } catch (e) {
      return this.loadCartFromServer();
    }
  }

  private loadCartFromServer(): Promise<IDataResponse> {
    let postData;
    if (!this.shouldOpenMinicartFromSettings()) {
      postData = {
        query: queryNodeForSitesWithHiddenMiniCart,
        source: 'Init',
        operationName: 'getCart',
        variables: {
          externalId: this.config.externalId || '',
        },
      };
    } else {
      postData = {
        query: queryNode,
        source: 'WixStoresWebClient',
        operationName: 'getCartService',
        variables: {
          externalId: this.config.externalId || '',
          withTax: false,
          withShipping: false,
        },
      };
    }

    return this.siteStore.httpClient
      .post(this.siteStore.resolveAbsoluteUrl(`/${Topology.NODE_GRAPHQL_URL}`), postData)
      .then(({data}) => {
        return {
          cartSummary: newCartToOldCartStructure(data.cart),
          widgetSettings: _.get(data, 'appSettings.widgetSettings', {}),
        };
      });
  }

  public async getAppSettingsData(): Promise<IDataResponse> {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    if (this.appSettingsPromise) {
      return this.appSettingsPromise;
    }

    const postData = {
      query: getAppSettingsData,
      source: 'WixStoresWebClient',
      operationName: 'getAppSettings',
      variables: {externalId: this.config.externalId || ''},
    };

    this.appSettingsPromise = this.siteStore
      .tryGetGqlAndFallbackToPost(this.siteStore.resolveAbsoluteUrl(`/${Topology.NODE_GRAPHQL_URL}`), postData)
      .then(({data}) => {
        return {
          widgetSettings: _.get(data, 'appSettings.widgetSettings', {}),
        };
      });

    return this.appSettingsPromise;
  }

  public shouldOpenMinicartFromSettings(): boolean {
    const {iconLink} = this.styleParams.numbers;
    return !iconLink || iconLink === 2;
  }

  public isOpenPopup(): boolean {
    const shouldRenderInDevice = !this.siteStore.isMobile();
    return this.shouldOpenMinicartFromSettings() && shouldRenderInDevice;
  }

  public onIconClick = async (): Promise<void> => {
    if (!this.cart.cartId) {
      this.cart = (await this.cartPromise).cartSummary;
    }
    const cartId = this.cart.cartId === EMPTY_CART_GUID ? undefined : this.cart.cartId;
    const partialBi = {
      cartId,
      cartType: this.getCartType(),
      itemsCount: this.getTotalQuantity(this.cart.items),
      viewMode: this.siteStore.viewMode.toLowerCase(),
    };
    if (this.isOpenPopup()) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.siteStore.experiments.enabled(experiments.USE_LIGHTBOXES)
        ? this.siteStore.windowApis.openLightbox('Mini Cart', {
            miniCartLayout: true,
          })
        : this.pubSubManager.publish('Minicart.Toggle', null, false);
      const eventId = this.pubSubManager.subscribe('Minicart.DidClose', () => {
        this.setProps({
          triggerFocus: true,
        });
        this.pubSubManager.unsubscribe('Minicart.DidClose', eventId);
      });

      void this.siteStore.webBiLogger.report(
        cartClickOnCartIconToOpenMiniCart({
          ...partialBi,
          isNavigateCart: false,
          catalogAppId: getCatalogAppId(this.cart?.items),
        })
      );
    } else {
      const origin = 'cart-icon';

      void this.siteStore.webBiLogger.report(
        clickToViewCartPage({
          ...partialBi,
          origin,
          isNavigateCart: true,
          catalogAppId: getCatalogAppId(this.cart?.items),
          checkoutId: this.cart?.checkoutId,
        })
      );

      await this.cartActions.navigateToCart(origin);
    }
  };

  public listenLoadedMinicartPopupAndSendCart(): void {
    this.pubSubManager.subscribe(
      'Minicart.LoadedWithoutData',
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      () =>
        this.getData().then((cart) => {
          this.pubSubManager.publish('Minicart.OnInitialData', cart.cartSummary);
          this.cart = cart.cartSummary;
        }),
      true
    );
  }

  public initPopup = (): void => {
    this.listenLoadedMinicartPopupAndSendCart();
  };

  public sendAddToCartBi = (productId: string, hasOptions: boolean, quantity: number): Promise<any> => {
    const eventData = {
      buttonType: BiButtonActionType.AddToCart,
      appName: 'wixstores-cart-icon',
      hasOptions,
      productId,
      origin: 'corvid',
      isNavigateCart: false,
      navigationClick: this.cartActions.shouldNavigateToCart() ? 'cart' : 'mini-cart',
      quantity,
    };

    return this.siteStore.webBiLogger.report(clickOnAddToCartSf(eventData));
  };

  public trackEvent = (productId: string, quantity: number): Promise<void> => {
    const params: ITrackEventParams = {
      appDefId: APP_DEFINITION_ID,
      category: 'All Products',
      origin: 'Stores',
      id: productId,
      quantity,
    };

    this.siteStore.windowApis.trackEvent('AddToCart', params);

    return Promise.resolve();
  };

  public onAddToCart = async (productId: string, hasOptions: boolean, quantity: number): Promise<void> => {
    await Promise.all([this.sendAddToCartBi(productId, hasOptions, quantity), this.trackEvent(productId, quantity)]);
  };

  public unSubscribeAll(): void {
    return this.pubSubManager.unsubscribeAll();
  }

  private getCartType() {
    const hasDigital = this.cart.items.some((item: any) => item.productType === ProductType.DIGITAL);
    const hasPhysical = this.cart.items.some(
      (item: any) => !item.productType || item.productType === ProductType.PHYSICAL
    );
    const hasService = this.cart.items.some((item: any) => item.productType === ProductType.SERVICE);
    const hasGiftCard = this.cart.items.some((item: any) => item.productType === ProductType.GIFT_CARD);
    const hasMultiVerticalItems = (hasDigital || hasPhysical) && (hasService || hasGiftCard);

    if (hasMultiVerticalItems) {
      return CartType.MIXED_VERTICALS;
    }

    if (hasDigital && hasPhysical) {
      return CartType.MIXED;
    } else if (hasDigital) {
      return CartType.DIGITAL;
    } else if (hasPhysical) {
      return CartType.PHYSICAL;
    } else if (hasService) {
      return CartType.SERVICE;
    } else if (hasGiftCard) {
      return CartType.GIFT_CARD;
    } else {
      return CartType.UNRECOGNISED;
    }
  }

  private getTotalQuantity(cartItems: ICartItem[] = []): number {
    return cartItems.reduce((previousValue, currentValue) => {
      return previousValue + (currentValue.quantity || 0);
    }, 0);
  }

  private getCountRelatedProps(count: number | undefined) {
    return {
      count,
      ariaLabelLink: this.translations.t('sr.CART_WIDGET_BUTTON_TEXT', {itemsCount: count}),
    };
  }

  public async executeWithFedops(interaction: FedopsInteraction, fn: () => Promise<any>): Promise<void> {
    this.fedops.interactionStarted(interaction);
    await fn();
    this.fedops.interactionEnded(interaction);
  }
}
