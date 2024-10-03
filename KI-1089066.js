$(document).ready(function () {

    // Case 1: Intercepts the add_time request and replaces it with GIFT criteria
    const originalXHRSend = XMLHttpRequest.prototype.send;
    const originalXHROpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url, ...rest) {
        this._requestUrl = url;
        return originalXHROpen.apply(this, [method, url, ...rest]);
    };

    XMLHttpRequest.prototype.send = function (body) {

        const urlPattern = /\/api\/checkout\/pub\/orderForm\/.*\/itemsOrdination/;

        if (this._requestUrl && urlPattern.test(this._requestUrl)) {
            let requestBody;

            try {
                requestBody = JSON.parse(body);
            } catch (error) {
                requestBody = null;
            }

            if (requestBody && requestBody.criteria === "add_time") {
                console.log('Modifying requestBody to avoid add_time criteria: changed to GIFT criteria');
                window.checkout.loading(false);
                $('body').removeClass('loading');
                requestBody.criteria = "GIFT";
                body = JSON.stringify(requestBody);
            }
        }
        return originalXHRSend.apply(this, [body]);
    };

    // Case 2: Listener to sort by GIFT on payment step

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
