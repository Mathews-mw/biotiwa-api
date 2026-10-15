import { inject, injectable } from 'tsyringe';

import type { IAffiliatePromotionCodeRepository } from '../../affiliates/repositories/affiliate-promotion-code-repository';

import { failure, success, type Outcome } from '@/core/outcome';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { BadRequestError } from '@/core/errors/bad-request-errors';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';
import { AffiliatePromotionCodeDetails } from '@/domains/main/models/value-objects/affiliate-promotion-code-details';

type Response = Outcome<
	ResourceNotFoundError | BadRequestError,
	{
		affiliatePromotionCode: AffiliatePromotionCodeDetails;
	}
>;

@injectable()
export class AffiliatePromotionValidatorService {
	constructor(
		@inject(DEPENDENCY_IDENTIFIERS.AFFILIATE_PROMOTION_CODE_REPOSITORY)
		private affiliatePromotionCodeRepository: IAffiliatePromotionCodeRepository
	) {}

	async validate({ promotionCodeId, userId }: { promotionCodeId: string; userId: string }): Promise<Response> {
		const affiliatePromotionCode = await this.affiliatePromotionCodeRepository.findByPromotionCodeId(promotionCodeId);

		if (!affiliatePromotionCode) {
			return failure(
				new ResourceNotFoundError('Affiliate promotion configuration not found', 'AFFILIATE_PROMOTION_NOT_FOUND')
			);
		}

		if (!affiliatePromotionCode.affiliate.isActive) {
			return failure(new BadRequestError('Affiliate is not active', 'AFFILIATE_NOT_ACTIVE'));
		}

		if (affiliatePromotionCode.affiliate.userId.equals(new UniqueEntityId(userId))) {
			return failure(
				new BadRequestError('Affiliate cannot use their own promotion code', 'AFFILIATE_SELF_REDEMPTION_NOT_ALLOWED')
			);
		}

		return success({ affiliatePromotionCode });
	}
}
