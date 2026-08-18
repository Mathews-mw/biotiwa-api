import { CartSummaryPresenter } from '../cart/cart-summary-presenter';
import { CartSummaryItemPresenter } from '../cart/cart-summary-item-presenter';
import { ICheckoutResponseSchema } from '../../schemas/checkout/checkout-schema';
import { CheckoutQuote } from '@/domains/main/models/value-objects/checkout-quote';

export class CheckoutPresenter {
	static toHTTP(data: CheckoutQuote): ICheckoutResponseSchema {
		return {
			quote: {
				cart_id: data.cartId.toString(),
				market_code: data.marketCode,
				currency: data.currency,
				expires_at: data.expiresAt,
				created_at: data.createdAt,
				items: data.items.map(CartSummaryItemPresenter.toHTTP),
				summary: CartSummaryPresenter.toHTTP(data.summary),
			},
		};
	}
}
