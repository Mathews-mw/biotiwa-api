import { inject, injectable } from 'tsyringe';

import type { IMarketCode } from '@/core/types/market-code';
import type { IPromotionCodeRepository } from '../repositories/promotion-code-repository';
import type { IPromotionRedemptionRepository } from '../repositories/promotion-redemption-repository';

import { failure, Outcome, success } from '@/core/outcome';
import { BadRequestError } from '@/core/errors/bad-request-errors';
import { PromotionCode } from '@/domains/main/models/entities/promotion-code';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';
import { AffiliatePromotionValidator } from '../../affiliates/services/affiliate-promotion-validator';
import { AffiliatePromotionCodeDetails } from '@/domains/main/models/value-objects/affiliate-promotion-code-details';

interface IRequest {
	code: string;
	userId: string;
	marketCode: IMarketCode;
}

type Response = Outcome<
	BadRequestError | ResourceNotFoundError,
	{
		promotionCode: PromotionCode;
		affiliatePromotionCode: AffiliatePromotionCodeDetails | null;
	}
>;

@injectable()
export class PromotionCodeResolver {
	constructor(
		@inject(DEPENDENCY_IDENTIFIERS.PROMOTION_CODES_REPOSITORY)
		private readonly promotionCodeRepository: IPromotionCodeRepository,
		@inject(DEPENDENCY_IDENTIFIERS.PROMOTION_REDEMPTION_REPOSITORY)
		private readonly promotionRedemptionRepository: IPromotionRedemptionRepository,
		@inject(DEPENDENCY_IDENTIFIERS.AFFILIATE_PROMOTION_VALIDATOR)
		private readonly affiliatePromotionValidator: AffiliatePromotionValidator
	) {}

	async resolve({ code, userId, marketCode }: IRequest): Promise<Response> {
		const promotionCode = await this.promotionCodeRepository.findByCode(code);

		if (!promotionCode) {
			return failure(new ResourceNotFoundError('Promotion code not found.', 'PROMOTION_CODE_NOT_FOUND'));
		}

		if (!promotionCode.isActive) {
			return failure(new BadRequestError('Promotion code is inactive.', 'PROMOTION_CODE_INACTIVE'));
		}

		if (promotionCode.marketCode !== marketCode) {
			return failure(
				new BadRequestError('Promotion code is not available for this market.', 'PROMOTION_CODE_MARKET_MISMATCH')
			);
		}

		const now = new Date();

		if (!promotionCode.hasStarted(now)) {
			return failure(new BadRequestError('Promotion code is not available yet.', 'PROMOTION_CODE_NOT_STARTED'));
		}

		if (promotionCode.isExpired(now)) {
			return failure(new BadRequestError('Promotion code has expired.', 'PROMOTION_CODE_EXPIRED'));
		}

		if (promotionCode.maxUses !== null) {
			const usages = await this.promotionRedemptionRepository.countReservedUsages({
				promotionCodeId: promotionCode.id.toString(),
			});

			if (usages >= promotionCode.maxUses) {
				return failure(new BadRequestError('Promotion usage limit reached.', 'PROMOTION_CODE_USAGE_LIMIT_REACHED'));
			}
		}

		if (promotionCode.maxUsesPerCustomer !== null) {
			const usages = await this.promotionRedemptionRepository.countReservedUsagesByCustomer({
				promotionCodeId: promotionCode.id.toString(),
				userId,
			});

			if (usages >= promotionCode.maxUsesPerCustomer) {
				return failure(
					new BadRequestError(
						'Promotion usage limit reached for this customer.',
						'PROMOTION_CODE_CUSTOMER_USAGE_LIMIT_REACHED'
					)
				);
			}
		}

		// Se for uma promoção de afiliado, aplica regras específicas
		let affiliatePromotionCode: AffiliatePromotionCodeDetails | null = null;

		if (promotionCode.type === 'AFFILIATE') {
			const affiliateResult = await this.affiliatePromotionValidator.validate({
				promotionCodeId: promotionCode.id.toString(),
				userId,
				marketCode,
			});

			if (affiliateResult.isFalse()) {
				return failure(affiliateResult.value);
			}

			affiliatePromotionCode = affiliateResult.value.affiliatePromotion;
		}

		return success({ promotionCode, affiliatePromotionCode });
	}
}
