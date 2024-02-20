import {ControllerParams} from '@wix/yoshi-flow-editor';
import {IWidgetControllerConfig} from '@wix/native-components-infra';
import {BaseController, createCartExports} from '@wix/wixstores-client-storefront-sdk';
import {IAddToCartOptions} from '../../../types/product';
import {experiments, FedopsInteraction, origin} from '../../../constants';
import {IAddToCartItem} from '@wix/wixstores-client-core';
import {Scope} from '@wix/app-settings-client/dist/src/domain';
import {CartIconStore} from '../../../domain/stores/CartIconStore';
import {ICartIconStyleParams} from '../../../types/app-types';
import {CartCacheService} from '../../../domain/services/CartCacheService';

export class CartIconController extends BaseController {
  protected cartIconStore!: CartIconStore;
  protected controllerConfig!: IWidgetControllerConfig;
  protected addToCart: any;
  protected addProducts: any;
  constructor(controllerParams: ControllerParams) {
    super(controllerParams);
    this.setStoresAndCreateCartExports(controllerParams);
    this.controllerConfig = controllerParams.controllerConfig;
  }

  private setStoresAndCreateCartExports({controllerConfig, flowAPI}: ControllerParams) {
    const cartCacheService = new CartCacheService(flowAPI.fedops);
    this.cartIconStore = new CartIconStore(
      this.siteStore,
      controllerConfig.config,
      controllerConfig.setProps,
      flowAPI.reportError,
      flowAPI.translations,
      flowAPI.fedops,
      cartCacheService
    );
    const {addToCart, addProducts} = createCartExports({
      context: {
        siteStore: this.siteStore,
        controllerConfigs: [controllerConfig],
      },
      origin,
    });
    this.addToCart = addToCart;
    this.addProducts = addProducts;
  }

  public readonly load = async () => {
    if (this.siteStore.experiments.enabled(experiments.ShouldShowZeroUntilLoadCartIcon)) {
      await this.cartIconStore.setInitialStateAsync();
    } else {
      await this.cartIconStore.setInitialState();
    }
  };

  public readonly init = async (): Promise<void> => {
    await this.load();
  };

  public onStyleUpdate = (newStyleParams: ICartIconStyleParams) => {
    this.cartIconStore.updateStyleParams(newStyleParams);
  };

  public readonly onAppSettingsUpdate = (updates: {[key: string]: any}) => {
    if (updates.scope === Scope.COMPONENT && updates.source === 'app-settings') {
      this.cartIconStore.updateAppSettings(updates.payload);
    } else if (updates.details) {
      this.cartIconStore.updateAppSettings({main: updates.details});
    }
  };

  public readonly onBeforeUnLoad = () => {
    this.cartIconStore.unSubscribeAll();
  };

  public readonly exports = () => {
    return {
      addToCart: async (productId: string, quantity: number = 1, options: IAddToCartOptions = {}): Promise<boolean> => {
        await this.cartIconStore.executeWithFedops(FedopsInteraction.ADD_TO_CART, () =>
          this.addToCart(productId, quantity, options)
        );
        return true;
      },
      addProductsToCart: async (cartItems: IAddToCartItem[]): Promise<boolean> => {
        await this.cartIconStore.executeWithFedops(FedopsInteraction.ADD_ITEMS_TO_CART, () =>
          this.addProducts(cartItems)
        );
        return true;
      },
    };
  };

  public getFreeTexts(): string[] {
    return [];
  }
}
