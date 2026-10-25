import { inject, injectable } from 'tsyringe';

import type { IAffiliateRepository } from '../repositories/affiliate-repository';
import type { IPromotionRedemptionStatus } from '@/domains/main/models/entities/promotion-redemption';
import type { IAffiliatePromotionCodeRepository } from '../repositories/affiliate-promotion-code-repository';

import { failure, success, type Outcome } from '@/core/outcome';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';
import { AffiliatePromotionCodeDetails } from '@/domains/main/models/value-objects/affiliate-promotion-code-details';

interface IRequest {
	userId: string;
	redemptionStatus?: IPromotionRedemptionStatus;
}

type Response = Outcome<
	ResourceNotFoundError,
	{
		affiliatePromotionCodes: Array<AffiliatePromotionCodeDetails>;
	}
>;

@injectable()
export class ListAffiliatePromotionCodesUseCase {
	constructor(
		@inject(DEPENDENCY_IDENTIFIERS.AFFILIATES_REPOSITORY)
		private readonly affiliateRepository: IAffiliateRepository,
		@inject(DEPENDENCY_IDENTIFIERS.AFFILIATE_PROMOTION_CODES_REPOSITORY)
		private readonly affiliatePromotionCodesRepository: IAffiliatePromotionCodeRepository
	) {}

	async execute({ userId, redemptionStatus }: IRequest): Promise<Response> {
		const affiliate = await this.affiliateRepository.findByUserId(userId);

		if (!affiliate) {
			return failure(new ResourceNotFoundError('Affiliate not found', 'AFFILIATE_NOT_FOUND'));
		}

		const affiliatePromotionCodes = await this.affiliatePromotionCodesRepository.findManyByAffiliateId({
			affiliateId: affiliate.id.toString(),
			redemptionStatus,
		});

		return success({
			affiliatePromotionCodes,
		});
	}
}
