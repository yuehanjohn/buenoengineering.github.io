import type {IProduct} from '../types/galleryTypes';

export interface ProductsPriceRangeServiceMap {
  [productId: string]: string;
}

export class ProductsPriceRangeService {
  private products: IProduct[] = [];
  private userInput: {
    [productId: string]: number[];
  } = {};

  public addProducts(products: IProduct[]): void {
    this.products = products;
  }

  public getProductPriceRangeMap(): ProductsPriceRangeServiceMap {
    return this.products.reduce((map, product) => {
      const input = this.userInput[product.id];
      if ((!input || input.length === 0) && product.priceRange) {
        map[product.id] = product.priceRange.fromPriceFormatted;
      }
      return map;
    }, {});
  }

  public handleUserInput(productId: string, selectionIds: number[]): void {
    this.userInput[productId] = selectionIds;
  }

  public clearSelections(): void {
    this.userInput = {};
  }
}
