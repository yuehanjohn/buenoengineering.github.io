export const item = `  id
      options {
        id
        key
        title @include(if: $withOptions)
        optionType @include(if: $withOptions)
        selections @include(if: $withOptions) {
          id
          value
          description
          key
          linkedMediaItems {
            url
            fullUrl
            thumbnailFullUrl: fullUrl(width: 50, height: 50)
            mediaType
            width
            height
            index
            title
            videoFiles {
              url
              width
              height
              format
              quality
            }
          }
        }
      }
      productItems @include(if: $withOptions) {
        id
        optionsSelections
        price
        formattedPrice
        formattedComparePrice
        availableForPreOrder
        inventory {
          status
          quantity
        }
        isVisible
        pricePerUnit
        formattedPricePerUnit
      }
      customTextFields(limit: 1) {
        title
      }
      productType
      ribbon
      price
      comparePrice
      sku
      isInStock
      urlPart
      formattedComparePrice
      formattedPrice
      pricePerUnit
      formattedPricePerUnit
      pricePerUnitData {
        baseQuantity
        baseMeasurementUnit
      }
      itemDiscount {
        discountRuleName
        priceAfterDiscount
      }
      digitalProductFileItems {
        fileType
      }
      name
      media {
        url
        index
        width
        mediaType
        altText
        title
        height
      }
      isManageProductItems
      productItemsPreOrderAvailability
      isTrackingInventory
      inventory {
        status
        quantity
        availableForPreOrder
        preOrderInfoView {
          limit
        }
      }
      subscriptionPlans {
        list {
          id
          visible
        }
      }
      priceRange(withSubscriptionPriceRange: true) @include(if: $withPriceRange) {
        fromPriceFormatted
      }
      discount {
        mode
        value
      }`;
