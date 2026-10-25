import { inject, injectable } from 'tsyringe';

import type { IMarketCode } from '@/core/types/market-code';
import type { IAffiliatePromotionCodeRepository } from '../repositories/affiliate-promotion-code-repository';
import type { IAffiliateProgramSettingsRepository } from '../repositories/affiliate-program-settings-repository';
import type { AffiliatePromotionCodeDetails } from '@/domains/main/models/value-objects/affiliate-promotion-code-details';

import { failure, success, type Outcome } from '@/core/outcome';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { BadRequestError } from '@/core/errors/bad-request-errors';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';
import { AffiliateProgramSettings } from '@/domains/main/models/entities/affiliate-program-settings';

interface IRequest {
	promotionCodeId: string;
	userId: string;
	marketCode: IMarketCode;
}

type Response = Outcome<
	ResourceNotFoundError | BadRequestError,
	{
		affiliatePromotion: AffiliatePromotionCodeDetails;
		affiliateProgramSettings: AffiliateProgramSettings;
	}
>;

@injectable()
export class AffiliatePromotionValidator {
	constructor(
		@inject(DEPENDENCY_IDENTIFIERS.AFFILIATE_PROMOTION_CODES_REPOSITORY)
		private readonly affiliatePromotionCodeRepository: IAffiliatePromotionCodeRepository,
		@inject(DEPENDENCY_IDENTIFIERS.AFFILIATE_PROGRAM_SETTINGS_REPOSITORY)
		private readonly affiliateProgramSettingsRepository: IAffiliateProgramSettingsRepository
	) {}

	async validate(input: IRequest): Promise<Response> {
		const affiliatePromotion = await this.affiliatePromotionCodeRepository.findByPromotionCodeId(input.promotionCodeId);

		if (!affiliatePromotion) {
			return failure(
				new ResourceNotFoundError('Affiliate promotion configuration not found', 'AFFILIATE_PROMOTION_NOT_FOUND')
			);
		}

		const settings = await this.affiliateProgramSettingsRepository.findByMarketCode(input.marketCode);

		if (!settings) {
			return failure(
				new ResourceNotFoundError('Affiliate program settings not found', 'AFFILIATE_PROGRAM_SETTINGS_NOT_FOUND')
			);
		}

		if (!settings.isActive) {
			return failure(
				new BadRequestError('Affiliate program is not active for this market', 'AFFILIATE_PROGRAM_NOT_ACTIVE')
			);
		}

		const { affiliate } = affiliatePromotion;

		if (!affiliate.isActive) {
			return failure(new BadRequestError('Affiliate is not active', 'AFFILIATE_NOT_ACTIVE'));
		}

		// Autoconsumo não é permitido
		const customerUserId = new UniqueEntityId(input.userId);

		if (affiliate.userId.equals(customerUserId)) {
			return failure(
				new BadRequestError('Affiliate cannot use their own promotion code', 'AFFILIATE_SELF_REDEMPTION_NOT_ALLOWED')
			);
		}

		return success({
			affiliatePromotion,
			affiliateProgramSettings: settings,
		});
	}
}
