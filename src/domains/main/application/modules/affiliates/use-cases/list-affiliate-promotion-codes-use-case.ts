import { inject, injectable } from 'tsyringe';

import { success, type Outcome } from '@/core/outcome';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';
import { IAffiliatePromotionCodeRepository } from '../repositories/affiliate-promotion-code-repository';
import { AffiliatePromotionCodeDetails } from '@/domains/main/models/value-objects/affiliate-promotion-code-details';

interface IRequest {
	userId: string;
}

type Response = Outcome<
	null,
	{
		affiliatePromotionCodes: Array<AffiliatePromotionCodeDetails>;
	}
>;

@injectable()
export class ListAffiliatePromotionCodesUseCase {
	constructor(
		@inject(DEPENDENCY_IDENTIFIERS.AFFILIATE_PROMOTION_CODES_REPOSITORY)
		private readonly affiliatePromotionCodesRepository: IAffiliatePromotionCodeRepository
	) {}

	async execute({ userId }: IRequest): Promise<Response> {
		const affiliatePromotionCodes = await this.affiliatePromotionCodesRepository.findManyByAffiliateId(userId);

		return success({
			affiliatePromotionCodes,
		});
	}
}
