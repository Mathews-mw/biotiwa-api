import type { ICurrencyCode } from '@/core/types/currency-code';
import type { CartDetails } from '@/domains/main/models/value-objects/cart-details';
import type { IShippingProvider } from '@/domains/main/models/entities/shipping-quote-rate';

import { calculateCartSummary, type ICartSummaryItem } from '../../carts/services/calculate-cart-summary';
import { IPromotionCodeType } from '@/domains/main/models/entities/promotion-code';

export interface ICheckoutShippingSummary {
	rateId: string;
	provider: IShippingProvider;
	serviceName: string;
	carrierName: string | null;
	amount: number;
	estimatedDays: number | null;
}

export interface ICheckoutPromotionSummary {
	code: string;
	type: IPromotionCodeType;
	discountAmount: number;
}

export interface ICheckoutSummary {
	itemsAmount: number;
	orderBumpAmount: number;
	subtotalAmount: number;
	discountAmount: number;
	promotionDiscountAmount: number;
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
	promotion: ICheckoutPromotionSummary | null;
	currency: ICurrencyCode;
	items: Array<ICartSummaryItem>;
}

interface ICalculateCheckoutSummaryInput {
	cart: CartDetails;
	shippingAmount?: number | null;
	promotionDiscountAmount?: number;
}

export function calculateCheckoutSummary({
	cart,
	shippingAmount = null,
	promotionDiscountAmount = 0,
}: ICalculateCheckoutSummaryInput): ICheckoutSummary {
	const cartSummary = calculateCartSummary({ cartDetails: cart });

	const discountAmount = cartSummary.discountAmount + promotionDiscountAmount;

	const cartAmount = Math.max(0, cartSummary.totalAmount - promotionDiscountAmount);

	const totalAmount = cartAmount + (shippingAmount ?? 0);

	return {
		itemsAmount: cartSummary.itemsAmount,
		orderBumpAmount: cartSummary.orderBumpAmount,
		subtotalAmount: cartSummary.subtotalAmount,
		discountAmount,
		promotionDiscountAmount,
		taxAmount: cartSummary.taxAmount,
		cartAmount,
		shippingAmount,
		totalAmount,
		currency: cartSummary.currency,
		items: cartSummary.items,
		promotion: null,
	};
}
