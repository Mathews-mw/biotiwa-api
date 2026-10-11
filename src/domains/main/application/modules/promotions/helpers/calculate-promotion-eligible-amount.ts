import type { ICartSummary } from '../../carts/services/calculate-cart-summary';

export function calculatePromotionEligibleAmount(cartSummary: ICartSummary) {
	return Math.max(0, cartSummary.subtotalAmount - cartSummary.discountAmount);
}
