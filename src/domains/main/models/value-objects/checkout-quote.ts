import { CartDetails } from './cart-details';
import { ValueObject } from '@/core/entities/value-object';
import checkoutConfig from '@/domains/main/application/modules/checkout/config/checkout-config';

import type { ICartSummary } from '../../application/modules/carts/calculators/calculate-cart-summary';

export interface ICheckoutQuoteProps {
	cart: CartDetails;
	summary: ICartSummary;
	expiresAt: Date;
	createdAt: Date;
}

export class CheckoutQuote extends ValueObject<ICheckoutQuoteProps> {
	get cart() {
		return this.props.cart;
	}

	get cartId() {
		return this.props.cart.id;
	}

	get marketCode() {
		return this.props.cart.marketCode;
	}

	get currency() {
		return this.props.summary.currency;
	}

	get summary() {
		return this.props.summary;
	}

	get items() {
		return this.props.summary.items;
	}

	get expiresAt() {
		return this.props.expiresAt;
	}

	get createdAt() {
		return this.props.createdAt;
	}

	static create(props: Omit<ICheckoutQuoteProps, 'createdAt' | 'expiresAt'>) {
		const now = new Date();

		const checkoutQuote = new CheckoutQuote({
			...props,
			createdAt: now,
			expiresAt: new Date(now.getTime() + checkoutConfig.EXPIRES_AT_IN_MS),
		});

		return checkoutQuote;
	}
}
