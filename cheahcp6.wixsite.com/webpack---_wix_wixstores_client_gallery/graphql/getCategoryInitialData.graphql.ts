export const query = `query getCategoryInitialData($externalId: String!) {
  appSettings(externalId: $externalId) {
    widgetSettings
  }
  catalog {
    filters(enabledFilters: "CATEGORY") {
      filterType
      name
      field
      values {
        key
        value
      }
    }
    categories {
      list {
        id
        name
        slug
        visible
        numOfProducts
        description
        media {
          url
          fullUrl
          mediaType
          width
          height
        }
        seoData
      }
    }
    allProductsCategoryId
  }
}
`;
