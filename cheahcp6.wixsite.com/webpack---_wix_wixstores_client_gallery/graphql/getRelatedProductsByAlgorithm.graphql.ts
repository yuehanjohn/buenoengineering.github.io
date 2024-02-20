import {item} from './item';

export const query = `query getRelatedProductsByAlgorithm($productIds: [String!]!, $algorithm: Algorithm, $externalId: String!, $withOptions: Boolean = false, $withPriceRange: Boolean = false) {
  appSettings(externalId: $externalId) {
    widgetSettings
  }
  catalog {
    relatedProducts(productIds: $productIds, algorithm: $algorithm) {
      ${item}
    }
  }
}
`;
