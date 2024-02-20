import {
    __makeTemplateObject
} from "tslib";
import {
    gql
} from '@wix/wixstores-graphql-schema-node/dist/src/helpers/fakeGqlTag';
export var GetCartDocument = gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  query getCart($locale: String!, $withTax: Boolean, $withShipping: Boolean) {\n    cart {\n      cartId\n      checkoutId\n      ecomId\n      purchaseFlowId\n      storeId\n      buyerNote\n      items {\n        cartItemId\n        catalogAppId\n        product {\n          id\n          productType\n          urlPart\n          weight\n          name\n          price\n          comparePrice\n          customTextFields {\n            title\n            value\n          }\n          media(limit: 1) {\n            altText\n            mediaType\n            url\n            height\n            width\n          }\n          digitalProductFileItems {\n            fileType\n          }\n        }\n        optionsSelectionsValues {\n          id\n          title\n          value\n        }\n        freeText {\n          title\n          value\n        }\n        sku\n        quantity\n        inventoryQuantity\n        convertedPrices {\n          formattedComparePrice\n          formattedPrice\n          formattedTotalPrice\n          totalPrice\n          formattedPriceBeforeDiscount\n          price\n          depositAmount\n          formattedDepositAmount\n        }\n        formattedDepositAmount\n        depositAmount\n        formattedPriceBeforeDiscount\n        discountRules {\n          name\n        }\n        renderingConfig {\n          hidePrice\n          hideQuantity\n        }\n        paymentType\n        selectedMembership {\n          membershipId\n          appId\n          name {\n            original\n            translated\n          }\n        }\n      }\n      appliedCoupon {\n        discountValue\n        convertedDiscountValue\n        code\n        couponId\n        couponType\n        name\n      }\n      currencyFormat {\n        code\n      }\n      convertedCurrencyFormat {\n        code\n      }\n      additionalFees {\n        code\n        name\n        totalPrice\n        formattedTotalPrice\n        convertedFormattedTotalPrice\n      }\n      totals(withTax: $withTax, withShipping: $withShipping) {\n        subTotal\n        total\n        shipping\n        discount\n        itemsTotal\n        tax\n        payNow\n        payLater\n        additionalFeesTotal\n        formattedItemsTotal\n        formattedSubTotal\n        formattedShipping\n        formattedDiscount\n        formattedTax\n        formattedAdditionalFeesTotal\n        formattedPayNow\n        formattedPayLater\n        formattedTotal\n      }\n      convertedTotals(withTax: $withTax, withShipping: $withShipping) {\n        subTotal\n        total\n        shipping\n        discount\n        itemsTotal\n        tax\n        payNow\n        payLater\n        additionalFeesTotal\n        formattedItemsTotal\n        formattedSubTotal\n        formattedShipping\n        formattedDiscount\n        formattedTax\n        formattedAdditionalFeesTotal\n        formattedPayNow\n        formattedPayLater\n        formattedTotal\n      }\n      destination {\n        country\n        countryName(translateTo: $locale)\n        subdivision\n        subdivisionName(translateTo: $locale)\n        zipCode\n      }\n      selectedShippingOption {\n        id\n      }\n      shippingRuleInfo {\n        status\n        canShipToDestination\n        shippingRule {\n          id\n          options {\n            id\n            title\n            rate: convertedRate\n            formattedRate: convertedFormattedRate\n            deliveryTime\n            pickupInfo {\n              address {\n                countryName(translateTo: $locale)\n                subdivisionName(translateTo: $locale)\n                addressLine\n                city\n              }\n              pickupMethod\n            }\n            deliveryTimeSlot {\n              from\n              to\n            }\n          }\n        }\n      }\n      destinationCompleteness\n      minimumOrderAmount {\n        reached\n        diff\n        value\n        convertedDiff\n        convertedValue\n        formattedConvertedDiff\n        formattedConvertedValue\n      }\n      violations {\n        severity\n        target {\n          other {\n            name\n          }\n          lineItem {\n            name\n            id\n          }\n        }\n        description\n      }\n    }\n  }\n"], ["\n  query getCart($locale: String!, $withTax: Boolean, $withShipping: Boolean) {\n    cart {\n      cartId\n      checkoutId\n      ecomId\n      purchaseFlowId\n      storeId\n      buyerNote\n      items {\n        cartItemId\n        catalogAppId\n        product {\n          id\n          productType\n          urlPart\n          weight\n          name\n          price\n          comparePrice\n          customTextFields {\n            title\n            value\n          }\n          media(limit: 1) {\n            altText\n            mediaType\n            url\n            height\n            width\n          }\n          digitalProductFileItems {\n            fileType\n          }\n        }\n        optionsSelectionsValues {\n          id\n          title\n          value\n        }\n        freeText {\n          title\n          value\n        }\n        sku\n        quantity\n        inventoryQuantity\n        convertedPrices {\n          formattedComparePrice\n          formattedPrice\n          formattedTotalPrice\n          totalPrice\n          formattedPriceBeforeDiscount\n          price\n          depositAmount\n          formattedDepositAmount\n        }\n        formattedDepositAmount\n        depositAmount\n        formattedPriceBeforeDiscount\n        discountRules {\n          name\n        }\n        renderingConfig {\n          hidePrice\n          hideQuantity\n        }\n        paymentType\n        selectedMembership {\n          membershipId\n          appId\n          name {\n            original\n            translated\n          }\n        }\n      }\n      appliedCoupon {\n        discountValue\n        convertedDiscountValue\n        code\n        couponId\n        couponType\n        name\n      }\n      currencyFormat {\n        code\n      }\n      convertedCurrencyFormat {\n        code\n      }\n      additionalFees {\n        code\n        name\n        totalPrice\n        formattedTotalPrice\n        convertedFormattedTotalPrice\n      }\n      totals(withTax: $withTax, withShipping: $withShipping) {\n        subTotal\n        total\n        shipping\n        discount\n        itemsTotal\n        tax\n        payNow\n        payLater\n        additionalFeesTotal\n        formattedItemsTotal\n        formattedSubTotal\n        formattedShipping\n        formattedDiscount\n        formattedTax\n        formattedAdditionalFeesTotal\n        formattedPayNow\n        formattedPayLater\n        formattedTotal\n      }\n      convertedTotals(withTax: $withTax, withShipping: $withShipping) {\n        subTotal\n        total\n        shipping\n        discount\n        itemsTotal\n        tax\n        payNow\n        payLater\n        additionalFeesTotal\n        formattedItemsTotal\n        formattedSubTotal\n        formattedShipping\n        formattedDiscount\n        formattedTax\n        formattedAdditionalFeesTotal\n        formattedPayNow\n        formattedPayLater\n        formattedTotal\n      }\n      destination {\n        country\n        countryName(translateTo: $locale)\n        subdivision\n        subdivisionName(translateTo: $locale)\n        zipCode\n      }\n      selectedShippingOption {\n        id\n      }\n      shippingRuleInfo {\n        status\n        canShipToDestination\n        shippingRule {\n          id\n          options {\n            id\n            title\n            rate: convertedRate\n            formattedRate: convertedFormattedRate\n            deliveryTime\n            pickupInfo {\n              address {\n                countryName(translateTo: $locale)\n                subdivisionName(translateTo: $locale)\n                addressLine\n                city\n              }\n              pickupMethod\n            }\n            deliveryTimeSlot {\n              from\n              to\n            }\n          }\n        }\n      }\n      destinationCompleteness\n      minimumOrderAmount {\n        reached\n        diff\n        value\n        convertedDiff\n        convertedValue\n        formattedConvertedDiff\n        formattedConvertedValue\n      }\n      violations {\n        severity\n        target {\n          other {\n            name\n          }\n          lineItem {\n            name\n            id\n          }\n        }\n        description\n      }\n    }\n  }\n"])));
var templateObject_1;
//# sourceMappingURL=getCart.js.map