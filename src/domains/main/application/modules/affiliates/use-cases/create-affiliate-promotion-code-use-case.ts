import { inject, injectable } from 'tsyringe';

import type { IMarketCode } from '@/core/types/market-code';
import type { IAffiliateRepository } from '../repositories/affiliate-repository';
import type { IPromotionCodeRepository } from '../../promotions/repositories/promotion-code-repository';
import type { IAffiliatePromotionCodeRepository } from '../repositories/affiliate-promotion-code-repository';
import type { AffiliatePromotionCodeDetails } from '@/domains/main/models/value-objects/affiliate-promotion-code-details';

import { failure, success, type Outcome } from '@/core/outcome';
import { BadRequestError } from '@/core/errors/bad-request-errors';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';
import { AffiliatePromotionCode } from '@/domains/main/models/entities/affiliate-promotion-code';
import { PromotionCode, type IPromotionDiscountType } from '@/domains/main/models/entities/promotion-code';

interface IRequest {
	affiliateId: string;
	code: string;
	marketCode: IMarketCode;
	discountType: IPromotionDiscountType;

	/**
	 * PERCENTAGE:
	 * basis points
	 *
	 * 1000 = 10%
	 * 750  = 7.5%
	 *
	 * FIXED:
	 * minor currency unit
	 *
	 * 1000 = R$ 10,00
	 */
	discountValue: number;

	/**
	 * Também em basis points.
	 *
	 * 1000 = 10%
	 * 750  = 7.5%
	 */
	commissionRate: number;

	maxUses?: number | null;
	maxUsesPerCustomer?: number | null;
	expiresInDays: number;
}

type Response = Outcome<
	ResourceNotFoundError | BadRequestError,
	{
		affiliatePromotionCode: AffiliatePromotionCodeDetails;
	}
>;

@injectable()
export class CreateAffiliatePromotionCodeUseCase {
	constructor(
		@inject(DEPENDENCY_IDENTIFIERS.AFFILIATE_REPOSITORY)
		private readonly affiliateRepository: IAffiliateRepository,
		@inject(DEPENDENCY_IDENTIFIERS.AFFILIATE_PROGRAM_SETTINGS_REPOSITORY)
		private readonly affiliateProgramSettingsRepository: IAffiliateProgramSettingsRepository,
		@inject(DEPENDENCY_IDENTIFIERS.PROMOTION_CODES_REPOSITORY)
		private readonly promotionCodeRepository: IPromotionCodeRepository,
		@inject(DEPENDENCY_IDENTIFIERS.AFFILIATE_PROMOTION_CODE_REPOSITORY)
		private readonly affiliatePromotionCodeRepository: IAffiliatePromotionCodeRepository
	) {}

	async execute(input: IRequest): Promise<Response> {
		const affiliate = await this.affiliateRepository.findById(input.affiliateId);

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
			return failure(
				new BadRequestError('Affiliate program is not active for this market', 'AFFILIATE_PROGRAM_NOT_ACTIVE')
			);
		}

		// Valida a duração escolhida pelo afiliado contra a faixa determinada pelo administrador
		if (input.expiresInDays < settings.minCodeLifetimeDays || input.expiresInDays > settings.maxCodeLifetimeDays) {
			return failure(
				new BadRequestError(
					`Affiliate code lifetime must be between ${settings.minCodeLifetimeDays} and ${settings.maxCodeLifetimeDays} days`,
					'AFFILIATE_CODE_LIFETIME_OUT_OF_RANGE'
				)
			);
		}

		/*
		 * Valida comissão.
		 *
		 * Estamos usando basis points:
		 *
		 * 0      = 0%
		 * 1000   = 10%
		 * 10000  = 100%
		 */
		if (input.commissionRate < 0 || input.commissionRate > 10_000) {
			return failure(
				new BadRequestError(
					'Affiliate commission rate must be between 0% and 100%',
					'INVALID_AFFILIATE_COMMISSION_RATE'
				)
			);
		}

		// Valida limites de uso
		if (input.maxUses !== undefined && input.maxUses !== null && input.maxUses <= 0) {
			return failure(new BadRequestError('Maximum uses must be greater than zero', 'INVALID_PROMOTION_MAX_USES'));
		}

		if (input.maxUsesPerCustomer !== undefined && input.maxUsesPerCustomer !== null && input.maxUsesPerCustomer <= 0) {
			return failure(
				new BadRequestError(
					'Maximum uses per customer must be greater than zero',
					'INVALID_PROMOTION_MAX_USES_PER_CUSTOMER'
				)
			);
		}

		if (
			input.maxUses !== undefined &&
			input.maxUses !== null &&
			input.maxUsesPerCustomer !== undefined &&
			input.maxUsesPerCustomer !== null &&
			input.maxUsesPerCustomer > input.maxUses
		) {
			return failure(
				new BadRequestError(
					'Maximum uses per customer cannot exceed the global usage limit',
					'INVALID_PROMOTION_USAGE_LIMITS'
				)
			);
		}

		const normalizedCode = PromotionCode.normalizeCode(input.code);

		if (!normalizedCode) {
			return failure(new BadRequestError('Promotion code cannot be empty', 'INVALID_PROMOTION_CODE'));
		}

		const existingPromotionCode = await this.promotionCodeRepository.findByCode(normalizedCode);

		if (existingPromotionCode) {
			return failure(new BadRequestError('Promotion code already exists', 'PROMOTION_CODE_ALREADY_EXISTS'));
		}

		// Calcula a janela temporal da campanha
		const startsAt = new Date();
		const expiresAt = new Date(startsAt.getTime() + input.expiresInDays * 24 * 60 * 60 * 1000);

		// O tipo é SEMPRE AFFILIATE aqui. Não deve vir do request
		const promotionCode = PromotionCode.create({
			code: normalizedCode,
			type: 'AFFILIATE',
			status: 'ACTIVE',
			marketCode: input.marketCode,
			discountType: input.discountType,
			discountValue: input.discountValue,
			maxUses: input.maxUses ?? null,
			maxUsesPerCustomer: input.maxUsesPerCustomer ?? null,
			startsAt,
			expiresAt,
		});

		const affiliatePromotionCode = AffiliatePromotionCode.create({
			affiliateId: affiliate.id,
			promotionCodeId: promotionCode.id,
			commissionRate: input.commissionRate,
		});

		const details = await this.affiliatePromotionCodeRepository.createWithPromotionCode({
			affiliatePromotionCode,
			promotionCode,
		});

		return success({
			affiliatePromotionCode: details,
		});
	}
}
