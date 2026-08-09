import { ICurrencyCode } from '@/core/types/currency-code';
import { ICartItemType } from '@/domains/main/models/entities/cart-item';
import { CartDetails } from '@/domains/main/models/value-objects/cart-details';

export type ICartSummaryItem = {
	cartItemId: string;
	type: ICartItemType;
	name: string;
	quantity: number;
	unitAmount: number;
	totalAmount: number;
};

export type ICartSummary = {
	itemsAmount: number;
	orderBumpAmount: number;
	subtotalAmount: number;
	discountAmount: number;
	taxAmount: number;
	shippingAmount: number;
	totalAmount: number;
	currency: ICurrencyCode;
	items: Array<ICartSummaryItem>;
};

export function calculateCartSummary(cartDetails: CartDetails): ICartSummary {
	const summaryItems: Array<ICartSummaryItem> = [];

	let itemsAmount = 0;
	let orderBumpAmount = 0;
	let discountAmount = 0;

	for (const item of cartDetails.items) {
		if (item.type === 'OFFER' && item.offer) {
			const offer = item.offer;

			const finalQuantity = offer.totalProductsQuantity * item.quantity;
			const totalAmount = offer.unitAmount * finalQuantity;

			const itemDiscountAmount = Math.round(totalAmount * (offer.discountPercent / 100));

			itemsAmount += totalAmount;
			discountAmount += itemDiscountAmount;

			summaryItems.push({
				cartItemId: item.id.toString(),
				type: 'OFFER',
				name: offer.name,
				quantity: finalQuantity,
				unitAmount: offer.unitAmount,
				totalAmount,
			});
		}

		if (item.type === 'ORDER_BUMP' && item.orderBump) {
			const orderBump = item.orderBump;

			const finalQuantity = orderBump.quantity * item.quantity;
			const totalAmount = orderBump.unitAmount * finalQuantity;

			orderBumpAmount += totalAmount;

			summaryItems.push({
				cartItemId: item.id.toString(),
				type: 'ORDER_BUMP',
				name: orderBump.name,
				quantity: finalQuantity,
				unitAmount: orderBump.unitAmount,
				totalAmount,
			});
		}
	}

	const subtotalAmount = itemsAmount + orderBumpAmount;
	const taxableAmount = subtotalAmount - discountAmount;

	const taxAmount = Math.round(taxableAmount * cartDetails.market.taxRate);

	const totalAmount = taxableAmount + taxAmount + cartDetails.market.shippingAmount;

	return {
		itemsAmount,
		orderBumpAmount,
		subtotalAmount,
		discountAmount,
		taxAmount,
		shippingAmount: cartDetails.market.shippingAmount,
		totalAmount,
		currency: cartDetails.market.currency,
		items: summaryItems,
	};
}
