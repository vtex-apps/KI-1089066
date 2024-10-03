# KI-1089066
[KI] Nominal Taxes + Gift Promotions on the same item might generate checkout errors

This script is a workaround to KI https://vtexhelp.zendesk.com/agent/tickets/1089066.

You need to add the script to the checkout at the checkout6-custom.js


There are two cases where it is necessary to sort by GIFT in order to allow create the order.
- *Case 1 - When there are more than 20 items in the orderform*: vcs.checkout-ui performs a sort by 'add_time' criteria. When this sorting condition exist, it does not allow to reorder by GIFT criteria. 
This solution intercepts the “add_time” request and replaces by GIFT criteria. The script must be added in the checkout customization ensuring that it is inserted when the DOM is loaded, before the first add_time sort is performed. 
- *Case 2 - Before closing the order at checkout*: this script change items ordination by "GIFT" criteria in payment step when coupon and taxes exists.


```
    vtexjs.checkout
        .changeItemsOrdination("GIFT")
        .then(function(orderForm) {
            console.log("items sorted by criteria: ", orderForm.itemsOrdination)
    })
```