# KI-1089066
[KI] Nominal Taxes + Gift Promotions on the same item might generate checkout errors

This script is a workaround to KI https://vtexhelp.zendesk.com/agent/tickets/1089066.

You need to add the script to the checkout at the checkout6-custom.js

## Functions 
### Change Items Ordination

It is necessary to sort by GIFT in order to allow create the order. The request for item ordering will only be requested if one of the conditions is met:
- When the length of items is greater than 20: vcs.checkout-ui performs a sort by 'add_time' criteria. When this sorting condition exist, it does not allow to reorder by GIFT criteria. 
This solution intercepts the “add_time” request and replaces by GIFT criteria. The script must be added in the checkout customization ensuring that it is inserted when the DOM is loaded, before the first add_time sort is performed. 
- When coupon and taxes exists
  
###  Intercept requests
- Case 1: Intercepts the itemsOrdination request by 'add_time' criteria and replaces it with 'GIFT' criteria
- Case 2: Intercepts PaymentData and ShippingData request. At the end of each of the requests, it performs a ChangeItemsOrdination()


```
    vtexjs.checkout
        .changeItemsOrdination("GIFT")
        .then(function(orderForm) {
            console.log("items sorted by criteria: ", orderForm.itemsOrdination)
    })
```