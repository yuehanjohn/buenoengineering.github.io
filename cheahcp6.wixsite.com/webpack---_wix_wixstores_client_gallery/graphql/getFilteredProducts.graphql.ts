import {item} from './item';

export const query = `query getFilteredProducts($mainCollectionId: String!, $filters: ProductFilters, $sort: ProductSort, $offset: Int, $limit: Int, $withOptions: Boolean = false, $withPriceRange: Boolean = false) {
  catalog {
    category(categoryId: $mainCollectionId) {
      numOfProducts
      productsWithMetaData(filters: $filters, limit: $limit, sort: $sort, offset: $offset, onlyVisible: true) {
        totalCount
        list {
           ${item}
        }
      }
    }
  }
}
`;
