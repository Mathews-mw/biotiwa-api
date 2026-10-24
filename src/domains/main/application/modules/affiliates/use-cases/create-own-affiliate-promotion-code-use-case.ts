import { inject, injectable } from 'tsyringe';

import type { IMarketCode } from '@/core/types/market-code';
import type { IAffiliateRepository } from '../repositories/affiliate-repository';
import type { IPromotionCodeRepository } from '../../promotions/repositories/promotion-code-repository';
import type { IAffiliatePromotionCodeRepository } from '../repositories/affiliate-promotion-code-repository';
import type { IAffiliateProgramSettingsRepository } from '../repositories/affiliate-program-settings-repository';
import type { AffiliatePromotionCodeDetails } from '@/domains/main/models/value-objects/affiliate-promotion-code-details';

import { failure, success, type Outcome } from '@/core/outcome';
import { BadRequestError } from '@/core/errors/bad-request-errors';
import { PromotionCode } from '@/domains/main/models/entities/promotion-code';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';
import { AffiliatePromotionCode } from '@/domains/main/models/entities/affiliate-promotion-code';

interface IRequest {
	userId: string;
	code: string;
	marketCode: IMarketCode;
	expiresInDays: number;
	maxUsesPerCustomer?: number | null;
}

type Response = Outcome<
	ResourceNotFoundError | BadRequestError,
	{
		affiliatePromotionCode: AffiliatePromotionCodeDetails;
	}
>;

@injectable()
export class CreateOwnAffiliatePromotionCodeUseCase {
	constructor(
		@inject(DEPENDENCY_IDENTIFIERS.AFFILIATES_REPOSITORY)
		private readonly affiliateRepository: IAffiliateRepository,
		@inject(DEPENDENCY_IDENTIFIERS.AFFILIATE_PROGRAM_SETTINGS_REPOSITORY)
		private readonly affiliateProgramSettingsRepository: IAffiliateProgramSettingsRepository,
		@inject(DEPENDENCY_IDENTIFIERS.AFFILIATE_PROMOTION_CODES_REPOSITORY)
		private readonly affiliatePromotionCodeRepository: IAffiliatePromotionCodeRepository,
		@inject(DEPENDENCY_IDENTIFIERS.PROMOTION_CODES_REPOSITORY)
		private readonly promotionCodeRepository: IPromotionCodeRepository
	) {}

	async execute(input: IRequest): Promise<Response> {
		const affiliate = await this.affiliateRepository.findByUserId(input.userId);

		if (!affiliate) {
			return failure(new ResourceNotFoundError('Affiliate not found', 'AFFILIATE_NOT_FOUND'));
		}

		if (!affiliate.isActive) {
			return failure(new BadRequestError('Affiliate is not active', 'AFFILIATE_NOT_ACTIVE'));
		}

		const settings = await this.affiliateProgramSettingsRepository.findByMarketCode(input.marketCode);

		if (!settings) {
			return failure(
				new ResourceNotFoundError('Affiliate program settings not found', 'AFFILIATE_PROGRAM_SETTINGS_NOT_FOUND')
			);
		}

		if (!settings.isActive) {
			return failure(new BadRequestError('Affiliate program is not active', 'AFFILIATE_PROGRAM_NOT_ACTIVE'));
		}

		if (!settings.selfServiceCodeCreationEnabled) {
			return failure(
				new BadRequestError('Affiliate code creation is currently disabled', 'AFFILIATE_CODE_CREATION_DISABLED')
			);
		}

		const activeCodesCount = await this.affiliatePromotionCodeRepository.countActiveByAffiliateId(
			affiliate.id.toString()
		);

		if (activeCodesCount >= settings.maxActiveCodesPerAffiliate) {
			return failure(new BadRequestError('Affiliate active code limit reached', 'AFFILIATE_ACTIVE_CODE_LIMIT_REACHED'));
		}

		// Valida a duração escolhida pelo afiliado contra a faixa determinada pelo administrador
		if (input.expiresInDays < settings.minCodeLifetimeDays || input.expiresInDays > settings.maxCodeLifetimeDays) {
			return failure(
				new BadRequestError(
					`Code lifetime must be between ${settings.minCodeLifetimeDays} and ${settings.maxCodeLifetimeDays} days`,
					'AFFILIATE_CODE_LIFETIME_OUT_OF_RANGE'
				)
			);
		}

		if (input.maxUsesPerCustomer !== undefined && input.maxUsesPerCustomer !== null) {
			if (input.maxUsesPerCustomer <= 0 || input.maxUsesPerCustomer > settings.maxUsesPerCustomerLimit) {
				return failure(
					new BadRequestError(
						`Maximum uses per customer must be between 1 and ${settings.maxUsesPerCustomerLimit}`,
						'AFFILIATE_MAX_USES_PER_CUSTOMER_OUT_OF_RANGE'
					)
				);
			}
		}

		const normalizedCode = PromotionCode.normalizeCode(input.code);

		const existingCode = await this.promotionCodeRepository.findByCode(normalizedCode);

		if (existingCode) {
			return failure(new BadRequestError('Promotion code already exists', 'PROMOTION_CODE_ALREADY_EXISTS'));
		}

		const startsAt = new Date();
		const expiresAt = new Date(startsAt.getTime() + input.expiresInDays * 24 * 60 * 60 * 1000);

		const promotionCode = PromotionCode.create({
			code: normalizedCode,
			type: 'AFFILIATE',
			status: 'ACTIVE',
			marketCode: input.marketCode,
			discountType: settings.defaultAffiliateDiscountType,
			discountValue: settings.defaultAffiliateDiscountValue,
			maxUses: null,
			maxUsesPerCustomer: input.maxUsesPerCustomer ?? null,
			startsAt,
			expiresAt,
		});

		const affiliatePromotionCode = AffiliatePromotionCode.create({
			affiliateId: affiliate.id,
			promotionCodeId: promotionCode.id,
			commissionRate: settings.defaultAffiliateCommissionRate,
		});

		const details = await this.affiliatePromotionCodeRepository.createWithPromotionCode({
			promotionCode,
			affiliatePromotionCode,
		});

		return success({
			affiliatePromotionCode: details,
		});
	}
}
