import {item} from './item';

export const query = `query getCategoryProducts($compId: String!, $limit: Int!, $offset:Int = 0, $withOptions: Boolean = false, $withPriceRange: Boolean = false) {
  catalog {
    category(compId: $compId) {
      id
      name
      productsWithMetaData(limit: $limit, offset: $offset, onlyVisible: true) {
        list {
          ${item}
        }
        totalCount
      }
    }
  }
}
`;
