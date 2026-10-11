import type { ICartSummary } from '../../carts/services/calculate-cart-summary';

import { PromotionCode } from '@/domains/main/models/entities/promotion-code';
import { PromotionDiscount } from '@/domains/main/models/value-objects/discount-value';
import { calculatePromotionEligibleAmount } from '../helpers/calculate-promotion-eligible-amount';

interface Input {
	promotionCode: PromotionCode;
	cartSummary: ICartSummary;
}

export function calculatePromotionDiscount({ promotionCode, cartSummary }: Input) {
	const eligibleAmount = calculatePromotionEligibleAmount(cartSummary);

	const promotionDiscount = PromotionDiscount.create({
		type: promotionCode.discountType,
		value: promotionCode.discountValue,
	});

	return {
		eligibleAmount,
		discountAmount: promotionDiscount.calculate(eligibleAmount),
	};
}
