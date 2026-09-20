import type { ICurrencyCode } from '@/core/types/currency-code';
import type { CartDetails } from '@/domains/main/models/value-objects/cart-details';
import type { IShippingProvider } from '@/domains/main/models/entities/shipping-quote-rate';

import { calculateCartSummary, type ICartSummaryItem } from '../../carts/services/calculate-cart-summary';

export interface ICheckoutShippingSummary {
	rateId: string;
	provider: IShippingProvider;
	serviceName: string;
	carrierName: string | null;
	amount: number;
	estimatedDays: number | null;
}

export interface ICheckoutSummary {
	itemsAmount: number;
	orderBumpAmount: number;
	subtotalAmount: number;
	discountAmount: number;
	taxAmount: number;
	/**
	 * valor atual do carrinho
	 */
	cartAmount: number;
	/**
	 * frete escolhido
	 *
	 * Null => frete ainda não calculado/selecionado
	 *
	 * 0 => frete realmente grátis
	 */
	shippingAmount: number | null;
	shipping?: ICheckoutShippingSummary | null;
	/**
	 * valor efetivamente cobrado no checkout
	 */
	totalAmount: number;
	currency: ICurrencyCode;
	items: Array<ICartSummaryItem>;
}

interface ICalculateCheckoutSummaryInput {
	cart: CartDetails;
	shippingAmount?: number | null;
}

export function calculateCheckoutSummary({
	cart,
	shippingAmount = null,
}: ICalculateCheckoutSummaryInput): ICheckoutSummary {
	const cartSummary = calculateCartSummary({ cartDetails: cart });

	const totalAmount = cartSummary.totalAmount + (shippingAmount ?? 0);

	return {
		itemsAmount: cartSummary.itemsAmount,
		orderBumpAmount: cartSummary.orderBumpAmount,
		subtotalAmount: cartSummary.subtotalAmount,
		discountAmount: cartSummary.discountAmount,
		taxAmount: cartSummary.taxAmount,
		cartAmount: cartSummary.totalAmount,
		shippingAmount,
		totalAmount,
		currency: cartSummary.currency,
		items: cartSummary.items,
	};
}
