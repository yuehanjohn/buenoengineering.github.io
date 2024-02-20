import {item} from './item';

export const query = `query getData($externalId: String!, $compId: String, $mainCollectionId: String, $limit: Int!, $sort: ProductSort, $filters: ProductFilters, $offset: Int, $withOptions: Boolean = false, $withPriceRange: Boolean = false) {
  appSettings(externalId: $externalId) {
    widgetSettings
  }
  catalog {
    category(compId: $compId, categoryId: $mainCollectionId) {
      id
      name
      visible
      productsWithMetaData(limit: $limit, onlyVisible: true, sort: $sort, filters: $filters, offset: $offset) {
        list {
          ${item}
        }
        totalCount
      }
    }
    allProductsCategoryId
  }
}
`;
