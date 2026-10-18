import { inject, injectable } from 'tsyringe';

import type { OrderDetails } from '@/domains/main/models/value-objects/order-details';
import type { IAffiliateCommissionRepository } from '../repositories/affiliate-commission-repository';

import { failure, success, type Outcome } from '@/core/outcome';
import { BadRequestError } from '@/core/errors/bad-request-errors';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';
import { AffiliateCommission } from '@/domains/main/models/entities/affiliate-commission';
import { calculateAffiliateCommission } from '../services/calculate-affiliate-commission';

interface IRequest {
	order: OrderDetails;
}

type Response = Outcome<
	BadRequestError,
	{
		commission: AffiliateCommission | null;
	}
>;

@injectable()
export class CreateAffiliateCommissionForOrderUseCase {
	constructor(
		@inject(DEPENDENCY_IDENTIFIERS.AFFILIATE_COMMISSION_REPOSITORY)
		private readonly affiliateCommissionRepository: IAffiliateCommissionRepository
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

		const existingCommission = await this.affiliateCommissionRepository.findByOrderId(order.id.toString());

		if (existingCommission) {
			return success({
				commission: existingCommission,
			});
		}

		if (!promotion.affiliateCommissionRate) {
			return failure(new BadRequestError('Commission rate cannot be undefined', 'INVALID_AFFILIATE_COMMISSION_RATE'));
		}

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
		});

		await this.affiliateCommissionRepository.create(commission);

		return success({
			commission,
		});
	}
}
