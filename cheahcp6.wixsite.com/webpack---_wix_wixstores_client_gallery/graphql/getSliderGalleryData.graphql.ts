import {item} from './item';

export const query = `query getSliderGalleryData($externalId: String!, $compId: String!, $limit: Int!, $withOptions: Boolean = false, $withPriceRange: Boolean = false) {
  appSettings(externalId: $externalId) {
    widgetSettings
  }
  catalog {
    category(compId: $compId) {
      id
      name
      visible
      productsWithMetaData(limit: $limit, onlyVisible: true) {
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
