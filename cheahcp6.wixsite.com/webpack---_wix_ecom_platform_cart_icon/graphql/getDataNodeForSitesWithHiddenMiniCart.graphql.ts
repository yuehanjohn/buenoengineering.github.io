export const query = `query getDataNodeForSitesWithHiddenMiniCart($externalId: String!) {
  appSettings(externalId: $externalId) {
    widgetSettings
  }
    cart {
      cartId
      checkoutId
      items {
        cartItemId
        catalogAppId
        freeText {
          title
          value
        }
        product {
          id
          productType
          urlPart
          name
          media(limit: 1) {
            altText
            mediaType
            url
            height
            width
          }
          digitalProductFileItems {
            fileType
          }
        }
        optionsSelectionsValues {
          id
          title
          value
        }
        quantity
        inventoryQuantity
        convertedPrices {
          formattedComparePrice
          formattedPrice
          formattedPriceBeforeDiscount
        }
        discountRules {
          name
        }
      }
    }
}`;
