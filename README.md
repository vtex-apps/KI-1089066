# KI-1089066
[KI] Nominal Taxes + Gift Promotions on the same item might generate checkout errors


This script is a workaround to KI https://vtexhelp.zendesk.com/agent/tickets/1089066.

You need to add the script to the checkout at the checkout6-custom.js


This script change items ordination by "GIFT"  in payment step when coupon and taxes exists. 

```
    vtexjs.checkout
        .changeItemsOrdination("GIFT")
        .then(function(orderForm) {
            console.log("items sorted by criteria: ", orderForm.itemsOrdination)
    })
```