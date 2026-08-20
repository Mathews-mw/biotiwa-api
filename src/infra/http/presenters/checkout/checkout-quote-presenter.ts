import { CartSummaryPresenter } from '../cart/cart-summary-presenter';
import { CartSummaryItemPresenter } from '../cart/cart-summary-item-presenter';
import { CheckoutQuote } from '@/domains/main/models/value-objects/checkout-quote';

import type { ICheckoutQuoteResponseSchema } from '../../schemas/checkout/checkout-quote-schema';

export class CheckoutQuotePresenter {
	static toHTTP(data: CheckoutQuote): ICheckoutQuoteResponseSchema {
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
