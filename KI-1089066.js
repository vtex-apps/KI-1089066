$(document).ready(function () {
    let listenerCreated = false;
    const observerContainer = new MutationObserver((mutations, obsP) => {
        const paymentDataContainer = document.querySelector("#payment-data");
        if (document.contains(paymentDataContainer)) {
            if (!listenerCreated) {
                listenerCreated = true;
                createListener(listenerCreated);
            }
        } else {
            listenerCreated = false;
        }
    });

    observerContainer.observe(document, {
        childList: true,
        subtree: true,
    });
});

function createListener(listenerFlag) {
    if (listenerFlag) {
        function checkURL() {
            if (window.location.hash.includes('/payment')) {
                orderItems();
            }
        }

        function orderItems() {
            if (vtexjs.checkout.orderForm.marketingData !== null
                && vtexjs.checkout.orderForm.marketingData.coupon !== null
                && vtexjs.checkout.orderForm.totalizers !== null
                && vtexjs.checkout.orderForm.totalizers.some(item => item.id === "Tax")) {
                vtexjs.checkout
                    .changeItemsOrdination("GIFT")
                    .then(function (orderForm) {
                        console.log("items sorted by criteria: ", orderForm.itemsOrdination)
                    })
            }
        }

        window.addEventListener('popstate', checkURL);
        checkURL();
    }
}
