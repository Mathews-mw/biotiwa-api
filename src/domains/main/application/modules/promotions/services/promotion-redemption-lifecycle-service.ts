import { inject, injectable } from 'tsyringe';

import type { IPromotionRedemptionRepository } from '../repositories/promotion-redemption-repository';

import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';

@injectable()
export class PromotionRedemptionLifecycleService {
	constructor(
		@inject(DEPENDENCY_IDENTIFIERS.PROMOTION_REDEMPTION_REPOSITORY)
		private readonly promotionRedemptionRepository: IPromotionRedemptionRepository
	) {}

	async redeem(orderId: string) {
		const redemption = await this.promotionRedemptionRepository.findByOrderId(orderId);

		if (!redemption) {
			return;
		}

		redemption.markAsRedeemed();

		await this.promotionRedemptionRepository.save(redemption);
	}

	async expire(orderId: string) {
		const redemption = await this.promotionRedemptionRepository.findByOrderId(orderId);

		if (!redemption) {
			return;
		}

		redemption.markAsExpired();

		await this.promotionRedemptionRepository.save(redemption);
	}

	async cancel(orderId: string) {
		const redemption = await this.promotionRedemptionRepository.findByOrderId(orderId);

		if (!redemption) {
			return;
		}

		redemption.markAsCanceled();

		await this.promotionRedemptionRepository.save(redemption);
	}
}
