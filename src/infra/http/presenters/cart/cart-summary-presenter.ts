import { CartSummaryItemPresenter } from './cart-summary-item-presenter';
import type { ICartSummaryResponseSchema } from '../../schemas/cart/cart-summary-schema';
import type { ICartSummary } from '@/domains/main/application/modules/carts/calculators/calculate-cart-summary';

export class CartSummaryPresenter {
	static toHTTP(data: ICartSummary): ICartSummaryResponseSchema {
		return {
			items_amount: data.itemsAmount,
			order_bump_amount: data.orderBumpAmount,
			subtotal_amount: data.subtotalAmount,
			discount_amount: data.discountAmount,
			tax_amount: data.taxAmount,
			shipping_amount: data.shippingAmount,
			total_amount: data.totalAmount,
			currency: data.currency,
			items: data.items.map(CartSummaryItemPresenter.toHTTP),
		};
	}
}
