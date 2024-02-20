import {
  ProductVariantCalculator,
  IProductSelectionAvailabilityMap,
} from '@wix/wixstores-client-core/dist/es/src/productVariantCalculator/ProductVariantCalculator';
import type {IProduct} from '../types/galleryTypes';

export interface ProductVariantInfo {
  variantSelectionIds: number[];
  selectionsAvailability: IProductSelectionAvailabilityMap;
  mediaItems: IProduct['media'];
  priceInfo: Pick<IProduct, 'formattedPrice' | 'price' | 'comparePrice' | 'formattedComparePrice'>;
}

export interface ProductsVariantInfoMap {
  [productId: string]: ProductVariantInfo;
}

export class ProductsOptionsService {
  private readonly productsMap: {
    [productId: string]: {
      variantCalculator: ProductVariantCalculator;
    };
  } = {};

  public addProducts(products: IProduct[]): void {
    products.forEach((product) => {
      if (this.productsMap[product.id]) {
        this.productsMap[product.id].variantCalculator.updateProduct(product);
        return;
      }

      this.productsMap[product.id] = {
        variantCalculator: new ProductVariantCalculator(product),
      };
    });
  }

  public handleUserInput(productId: string, selectionIds: number[]): void {
    this.productsMap[productId].variantCalculator.setVariantSelectionIds(selectionIds);
  }

  public clearSelections(): void {
    Object.keys(this.productsMap).forEach((productId) =>
      this.productsMap[productId].variantCalculator.setVariantSelectionIds([])
    );
  }

  public getVariantInfoMap(): ProductsVariantInfoMap {
    return Object.keys(this.productsMap).reduce((result, productId) => {
      const variantInfo: ProductVariantInfo = {
        variantSelectionIds: [...this.productsMap[productId].variantCalculator.getVariantSelectionIds()],
        selectionsAvailability: this.productsMap[productId].variantCalculator.getSelectionsAvailability(),
        mediaItems: this.productsMap[productId].variantCalculator.getMediaItems() as IProduct['media'],
        priceInfo: this.productsMap[productId].variantCalculator.getPriceInfo(),
      };

      return {
        ...result,
        [productId]: variantInfo,
      };
    }, {});
  }

  public getVariantSelectionIds(productId: string): number[] {
    return [...this.productsMap[productId].variantCalculator.getVariantSelectionIds()];
  }

  public canAddToCart(productId: string): boolean {
    return this.productsMap[productId].variantCalculator.canAddToCart();
  }
}
