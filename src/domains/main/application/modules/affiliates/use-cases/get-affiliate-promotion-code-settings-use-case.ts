import { inject, injectable } from 'tsyringe';

import type { IMarketCode } from '@/core/types/market-code';

import { failure, Outcome, success } from '@/core/outcome';
import { IAffiliateRepository } from '../repositories/affiliate-repository';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';
import { AffiliateProgramSettings } from '@/domains/main/models/entities/affiliate-program-settings';
import { IAffiliatePromotionCodeRepository } from '../repositories/affiliate-promotion-code-repository';
import { IAffiliateProgramSettingsRepository } from '../repositories/affiliate-program-settings-repository';

interface IRequest {
	userId: string;
	marketCode: IMarketCode;
}

type IResponse = Outcome<
	ResourceNotFoundError,
	{ enabled: boolean; activeCodes: number; settings: AffiliateProgramSettings }
>;

@injectable()
export class GetAffiliatePromotionCodeSettingsUseCase {
	constructor(
		@inject(DEPENDENCY_IDENTIFIERS.AFFILIATES_REPOSITORY)
		private readonly affiliateRepository: IAffiliateRepository,
		@inject(DEPENDENCY_IDENTIFIERS.AFFILIATE_PROGRAM_SETTINGS_REPOSITORY)
		private readonly settingsRepository: IAffiliateProgramSettingsRepository,
		@inject(DEPENDENCY_IDENTIFIERS.AFFILIATE_PROMOTION_CODES_REPOSITORY)
		private readonly affiliatePromotionCodeRepository: IAffiliatePromotionCodeRepository
	) {}

	async execute({ userId, marketCode }: IRequest): Promise<IResponse> {
		const affiliate = await this.affiliateRepository.findByUserId(userId);

		if (!affiliate) {
			return failure(new ResourceNotFoundError('Affiliate not found', 'AFFILIATE_NOT_FOUND'));
		}

		const settings = await this.settingsRepository.findByMarketCode(marketCode);

		if (!settings) {
			return failure(
				new ResourceNotFoundError('Affiliate program settings not found', 'AFFILIATE_PROGRAM_SETTINGS_NOT_FOUND')
			);
		}

		const activeCodes = await this.affiliatePromotionCodeRepository.countActiveByAffiliateId(affiliate.id.toString());

		return success({
			enabled: affiliate.isActive && settings.isActive && settings.selfServiceCodeCreationEnabled,
			activeCodes,
			settings,
		});
	}
}
