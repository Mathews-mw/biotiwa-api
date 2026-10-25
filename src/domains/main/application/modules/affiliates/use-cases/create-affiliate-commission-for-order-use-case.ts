import { inject, injectable } from 'tsyringe';

import type { OrderDetails } from '@/domains/main/models/value-objects/order-details';
import type { IAffiliateCommissionRepository } from '../repositories/affiliate-commission-repository';
import type { IAffiliateProgramSettingsRepository } from '../repositories/affiliate-program-settings-repository';

import { failure, success, type Outcome } from '@/core/outcome';
import { BadRequestError } from '@/core/errors/bad-request-errors';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';
import { AffiliateCommission } from '@/domains/main/models/entities/affiliate-commission';
import { calculateAffiliateCommission } from '../services/calculate-affiliate-commission';
import { calculateCommissionAvailableAt } from '../services/calculate-commission-available-at';

interface IRequest {
	order: OrderDetails;
}

type Response = Outcome<
	BadRequestError | ResourceNotFoundError,
	{
		commission: AffiliateCommission | null;
	}
>;

@injectable()
export class CreateAffiliateCommissionForOrderUseCase {
	constructor(
		@inject(DEPENDENCY_IDENTIFIERS.AFFILIATE_COMMISSION_REPOSITORY)
		private readonly affiliateCommissionRepository: IAffiliateCommissionRepository,
		@inject(DEPENDENCY_IDENTIFIERS.AFFILIATE_PROGRAM_SETTINGS_REPOSITORY)
		private readonly affiliateProgramSettingsRepository: IAffiliateProgramSettingsRepository
	) {}

	async execute({ order }: IRequest): Promise<Response> {
		const promotion = order.orderPromotion;

		// Pedido sem promoção ou com cupom comum não gera comissão
		if (!promotion || promotion.type !== 'AFFILIATE') {
			return success({
				commission: null,
			});
		}

		// Os dados financeiros precisam vir do snapshot do OrderPromotion
		if (!promotion.affiliateId || promotion.affiliateCommissionRate === null) {
			return failure(
				new BadRequestError('Affiliate commission snapshot is incomplete', 'INVALID_AFFILIATE_COMMISSION_SNAPSHOT')
			);
		}

		const settings = await this.affiliateProgramSettingsRepository.findByMarketCode(order.marketCode);

		if (!settings) {
			return failure(
				new ResourceNotFoundError(
					'Affiliate program settings not found for order market',
					'AFFILIATE_PROGRAM_SETTINGS_NOT_FOUND'
				)
			);
		}

		const existingCommission = await this.affiliateCommissionRepository.findByOrderId(order.id.toString());

		if (existingCommission) {
			return success({
				commission: existingCommission,
			});
		}

		if (!promotion.affiliateCommissionRate) {
			return failure(new BadRequestError('Commission rate cannot be undefined', 'INVALID_AFFILIATE_COMMISSION_RATE'));
		}

		// TODO: `paidAt` deve ser a data real em que o pagamento foi confirmado, fornecido pelo gateway de pagamento (Stripe, PagSeguro...)
		const paidAt = new Date();

		const commissionWillBeAvailableAt = calculateCommissionAvailableAt({
			paidAt,
			holdDays: settings.commissionHoldDays,
		});

		const { commissionBaseAmount, commissionAmount } = calculateAffiliateCommission({
			itemsAmount: order.itemsAmount,
			orderBumpAmount: order.orderBumpAmount,
			discountAmount: order.discountAmount,
			commissionRate: promotion.affiliateCommissionRate,
		});

		const commission = AffiliateCommission.create({
			affiliateId: promotion.affiliateId,
			orderId: order.id,
			promotionCode: promotion.code,
			commissionBaseAmount,
			commissionRate: promotion.affiliateCommissionRate,
			commissionAmount,
			currency: order.currency,
			status: 'PENDING',
			availableAt: commissionWillBeAvailableAt,
		});

		await this.affiliateCommissionRepository.create(commission);

		return success({
			commission,
		});
	}
}
