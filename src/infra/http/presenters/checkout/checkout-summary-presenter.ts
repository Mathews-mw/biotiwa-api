import type { ICheckoutSummaryResponseSchema } from '../../schemas/checkout/checkout-summary-schema';
import type { ICheckoutSummary } from '@/domains/main/application/modules/checkout/services/calculate-checkout-summary';

import { CartSummaryItemPresenter } from '../cart/cart-summary-item-presenter';
import { CheckoutShippingSummaryPresenter } from './checkout-shipping-summary-presenter';

export class CheckoutSummaryPresenter {
	static toHTTP(data: ICheckoutSummary): ICheckoutSummaryResponseSchema {
		return {
			items_amount: data.itemsAmount,
			order_bump_amount: data.orderBumpAmount,
			subtotal_amount: data.subtotalAmount,
			discount_amount: data.discountAmount,
			tax_amount: data.taxAmount,
			cart_amount: data.cartAmount,
			shipping_amount: data.shippingAmount,
			shipping: data.shipping ? CheckoutShippingSummaryPresenter.toHTTP(data.shipping) : null,
			total_amount: data.totalAmount,
			currency: data.currency,
			items: data.items.map(CartSummaryItemPresenter.toHTTP),
		};
	}
}
