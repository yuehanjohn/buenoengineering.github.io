export const query = `query getDataNode($externalId: String!, $withTax: Boolean, $withShipping: Boolean) {
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
      convertedTotals(withTax: $withTax, withShipping: $withShipping) {
        itemsTotal
        formattedItemsTotal
        formattedSubTotal
        formattedTotal
      }
    }
}`;
