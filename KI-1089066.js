$(document).ready(function() {

	interceptRequest_KI_1089066()

});

function changeItemsOrdination() {
	if ((vtexjs.checkout.orderForm.marketingData !== null &&
			vtexjs.checkout.orderForm.marketingData.coupon !== null &&
			vtexjs.checkout.orderForm.totalizers !== null &&
			vtexjs.checkout.orderForm.totalizers.some(item => item.id === "Tax")) ||
		vtexjs.checkout.orderForm.items.length > 20) {
		vtexjs.checkout
			.changeItemsOrdination("GIFT")
			.then(function(orderForm) {
				console.log("items sorted by criteria: ", orderForm.itemsOrdination)
			})
	}
}

function interceptRequest_KI_1089066() {

	const originalXHRSend = XMLHttpRequest.prototype.send;
	const originalXHROpen = XMLHttpRequest.prototype.open;
	XMLHttpRequest.prototype.open = function(method, url, ...rest) {
		this._requestUrl = url;
		return originalXHROpen.apply(this, [method, url, ...rest]);
	};

	XMLHttpRequest.prototype.send = function(body) {
		const xhr = this;
		const urlPatternItemsOrdination = /\/api\/checkout\/pub\/orderForm\/.*\/itemsOrdination/;
		const urlPatternPaymentData = /\/api\/checkout\/pub\/orderForm\/.*\/attachments\/paymentData/;
		const urlPatternShippingData = /\/api\/checkout\/pub\/orderForm\/.*\/attachments\/shippingData/;

		if (this._requestUrl && urlPatternItemsOrdination.test(this._requestUrl)) {
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

		if (this._requestUrl &&
			(urlPatternPaymentData.test(this._requestUrl) ||
				urlPatternShippingData.test(this._requestUrl))) {
			return new Promise((resolve, reject) => {
				xhr.onload = function() {
					if (xhr.status >= 200 && xhr.status < 300) {
						resolve(xhr.responseText);
					} else {
						reject(new Error("Request failed  by custom script with status: " + xhr.status));
					}
				};

				xhr.onerror = function() {
					reject(new Error("Network error by custom script"));
				};

				originalXHRSend.apply(xhr, [body]);
			}).then((_response) => {
				changeItemsOrdination();
			}).catch((error) => {
				console.error("Error during the request by custom script:", error);
			});
		} else {
			return originalXHRSend.apply(this, [body]);
		}
	};
}