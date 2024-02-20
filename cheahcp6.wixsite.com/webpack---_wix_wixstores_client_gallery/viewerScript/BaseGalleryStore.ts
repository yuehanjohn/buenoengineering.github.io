/* eslint-disable @typescript-eslint/no-floating-promises */

import {IControllerConfig} from '@wix/native-components-infra/dist/es/src/types/types';
import {HeadingTags} from '@wix/wixstores-client-core/dist/es/src/types/heading-tags';
import {ProductPriceBreakdown} from '@wix/wixstores-client-storefront-sdk/dist/es/src/services/ProductPriceBreakdown/ProductPriceBreakdown';
import {SiteStore} from '@wix/wixstores-client-storefront-sdk/dist/es/src/viewer-script/site-store/SiteStore';
import _ from 'lodash';
import {ProductOptionType} from '@wix/wixstores-graphql-schema';
import {BI_APP_NAME, Experiments, origin} from '../constants';
import {actualPrice, isPreOrder} from '@wix/wixstores-client-core/dist/es/src/productOptions/productUtils';
import {ProductsService} from '../services/ProductsService';
import {AddToCartService} from '@wix/wixstores-client-storefront-sdk/dist/es/src/services/AddToCartService/AddToCartService';
import {
  IGalleryControllerConfig,
  ImageModeId,
  ImageRatioId,
  IPropsInjectedByViewerScript as IGalleryPropsInjectedByViewerScript,
  ProductOptionsShowOptionsOption,
  ProductsManifest,
} from '../types/galleryTypes';
import {
  BI_PRODUCT_OPTION_ACTION,
  BI_PRODUCT_OPTION_TYPE,
} from '@wix/wixstores-client-storefront-sdk/dist/es/src/constants';
import {ProductsVariantInfoMap} from '../services/ProductsOptionsService';
import {IPropsInjectedByViewerScript as ISliderGalleryPropsInjectedByViewerScript} from '../types/sliderGalleryTypes';
import {getStylesValues, IStyleParam, StyleParamType} from '@wix/tpa-settings';
import {clickOnProductOptionSf, clickShippingInfoLinkSf} from '@wix/bi-logger-ec-sf/v2';
import {roundStyleParams} from './utils';
import {IStylesParamsValues} from '../styleParams/types';

export abstract class BaseGalleryStore {
  protected config: IGalleryControllerConfig;
  protected readonly publicData: IControllerConfig['publicData'];

  protected productPriceBreakdown: ProductPriceBreakdown;
  protected productsManifest: ProductsManifest = {};
  protected productsService: ProductsService;
  protected addToCartService: AddToCartService;
  protected styles: IStylesParamsValues;
  protected allStyles: IStylesParamsValues[];
  protected abstract get stylesParams();

  constructor(
    config: IControllerConfig,
    protected readonly siteStore: SiteStore,
    protected readonly updateComponent: (
      props: Partial<IGalleryPropsInjectedByViewerScript> | Partial<ISliderGalleryPropsInjectedByViewerScript>
    ) => void,
    protected readonly type: string
  ) {
    this.config = config;
    this.publicData = _.cloneDeep(this.config.publicData);
    this.updateStyles();

    //todo: COMPONENT === null is not tested, be this check can be removed after bolt will stop sending nulls https://wix.slack.com/archives/CAKBA7TDH/p1555852184003900
    /* istanbul ignore next: hard to test */
    if (this.config.publicData.COMPONENT === null || this.config.publicData.COMPONENT === undefined) {
      this.config.publicData.COMPONENT = {};
    }
  }

  protected updateStyles() {
    const {
      style: {styleParams},
      allStyles,
    } = this.config;
    roundStyleParams(styleParams);
    this.styles = getStylesValues(styleParams, this.stylesParams);
    this.allStyles = allStyles.map((styles) => getStylesValues(styles, this.stylesParams));
  }

  protected isTrueInAnyBreakpoint(styleParam: IStyleParam<StyleParamType.Boolean>) {
    return this.allStyles.some((bpStyle) => bpStyle[styleParam.key] === true);
  }

  protected getCommonPropsToInject() {
    return {
      htmlTags: this.htmlTags,
      priceBreakdown: this.priceBreakdown,
      sendClickShippingInfoLinkSf: this.sendClickShippingInfoLinkSf.bind(this),
      imageMode: this.imageMode,
      imageRatio: this.imageRatio,
      isSEO: this.siteStore.seo.isInSEO(),
    };
  }

  protected abstract reportProductItemClick({productId, index}: {productId: string; index: number});

  protected sendClickShippingInfoLinkSf(productId: string) {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.siteStore.webBiLogger.report(clickShippingInfoLinkSf({productId}));
  }

  protected getCommonPropsToUpdate() {
    const htmlTags = this.htmlTags;
    const productsVariantInfoMap = this.productsVariantInfoMap;
    const imageMode = this.imageMode;
    const imageRatio = this.imageRatio;

    return {htmlTags, productsVariantInfoMap, imageMode, imageRatio};
  }

  protected get priceBreakdown() {
    return {
      shouldRenderTaxDisclaimer: this.productPriceBreakdown.shouldShowTaxDisclaimer,
      shippingDisclaimer: this.productPriceBreakdown.shippingDisclaimer,
      taxDisclaimer: this.productPriceBreakdown.taxDisclaimer,
    };
  }

  protected get imageMode(): ImageModeId {
    return this.styles.gallery_imageMode;
  }

  protected get imageRatio(): ImageRatioId {
    return this.styles.galleryImageRatio;
  }

  protected get htmlTags() {
    return {
      productNameHtmlTag: this.publicData.COMPONENT.gallery_productNameHtmlTag || HeadingTags.H3,
      headerTextHtmlTag: this.publicData.COMPONENT.gallery_headerTextHtmlTag || HeadingTags.H2,
    };
  }

  protected handleOptionSelectionsChange(params: {
    productId: string;
    selectionIds: number[];
    optionType: ProductOptionType;
  }) {
    if (this.getIsOptionsRevealEnabled()) {
      this.productsService.clearSelections();
    }

    this.productsService.handleProductsOptionsChange(params);

    const {product, variant} = this.productsService.getProductAndVariantById(params.productId);

    this.productsManifest[product.id].addToCartState = this.addToCartService.getButtonState({
      price: actualPrice(product),
      inStock: product.isInStock,
      isPreOrderState: isPreOrder(product, variant),
    });

    this.updateComponent({
      productsManifest: this.productsManifest,
      productsVariantInfoMap: this.productsVariantInfoMap,
      productsPriceRangeMap: this.productsService.productPriceRangeMap,
    });

    this.sendClickOnProductOptionBiEvent(params);
  }

  protected getIsOptionsRevealEnabled(): boolean {
    const productOptionsShowOptions = this.styles.gallery_productOptionsShowOptions;

    return (
      !this.siteStore.isMobile() &&
      productOptionsShowOptions === ProductOptionsShowOptionsOption.REVEAL &&
      this.siteStore.experiments.enabled(Experiments.GalleryProductOptionsVisibilitySettings)
    );
  }

  private sendClickOnProductOptionBiEvent(params: {productId: string; optionType: ProductOptionType}) {
    const {productId, optionType} = params;

    const optiontype = (
      {
        [ProductOptionType.DROP_DOWN]: BI_PRODUCT_OPTION_TYPE.LIST,
        [ProductOptionType.COLOR]: BI_PRODUCT_OPTION_TYPE.COLOR,
      } as const
    )[optionType];

    const {productType} = this.productsService.getProduct(productId);

    this.siteStore.webBiLogger.report(
      clickOnProductOptionSf({
        action: BI_PRODUCT_OPTION_ACTION.CHECKED,
        appName: BI_APP_NAME,
        optiontype,
        productId,
        productType,
        origin,
        viewMode: this.siteStore.biStorefrontViewMode,
      })
    );
  }

  protected get productsVariantInfoMap(): ProductsVariantInfoMap {
    return this.shouldShowProductOptions ? this.productsService.getVariantInfoMap() : {};
  }

  protected abstract get shouldShowProductOptions(): boolean;
}
