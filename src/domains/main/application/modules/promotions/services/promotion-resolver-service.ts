import { inject, injectable } from 'tsyringe';

import type { IMarketCode } from '@/core/types/market-code';
import type { ICartSummary } from '../../carts/services/calculate-cart-summary';
import type { PromotionCode } from '@/domains/main/models/entities/promotion-code';
import type { ICheckoutPromotionSummary } from '../../checkout/services/calculate-checkout-summary';

import { failure, Outcome, success } from '@/core/outcome';
import { PromotionCodeResolver } from './promotion-code-resolver';
import { BadRequestError } from '@/core/errors/bad-request-errors';
import { calculatePromotionDiscount } from './calculate-promotion-discount';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';

interface IInput {
	promotionCode: string;
	userId: string;
	marketCode: IMarketCode;
	cartSummary: ICartSummary;
}

type IResponse = Outcome<
	ResourceNotFoundError | BadRequestError,
	{
		resolvedPromotionCode: PromotionCode;
		checkoutPromotionSummary: ICheckoutPromotionSummary;
		promotionDiscountAmount: number;
	}
>;

@injectable()
export class PromotionResolverService {
	constructor(
		@inject(DEPENDENCY_IDENTIFIERS.PROMOTION_CODE_RESOLVER)
		private promotionCodeResolver: PromotionCodeResolver
	) {}

	async resolve(input: IInput): Promise<IResponse> {
		const promotionResult = await this.promotionCodeResolver.resolve({
			code: input.promotionCode,
			userId: input.userId,
			marketCode: input.marketCode,
		});

		if (promotionResult.isFalse()) {
			return failure(promotionResult.value);
		}

		const resolvedPromotionCode = promotionResult.value.promotionCode;

		const promotionCalculation = calculatePromotionDiscount({
			cartSummary: input.cartSummary,
			promotionCode: resolvedPromotionCode,
		});

		const promotionDiscountAmount = promotionCalculation.discountAmount;

		const checkoutPromotionSummary = {
			code: resolvedPromotionCode.code,
			type: resolvedPromotionCode.type,
			discountAmount: promotionDiscountAmount,
		};

		return success({
			checkoutPromotionSummary,
			resolvedPromotionCode,
			promotionDiscountAmount,
		});
	}
}
