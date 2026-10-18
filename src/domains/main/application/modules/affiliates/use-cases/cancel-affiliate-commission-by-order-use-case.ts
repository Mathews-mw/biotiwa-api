import { inject, injectable } from 'tsyringe';

import type { IAffiliateCommissionRepository } from '../repositories/affiliate-commission-repository';

import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';

@injectable()
export class CancelAffiliateCommissionByOrderUseCase {
	constructor(
		@inject(DEPENDENCY_IDENTIFIERS.AFFILIATE_COMMISSION_REPOSITORY)
		private readonly affiliateCommissionRepository: IAffiliateCommissionRepository
	) {}

	async execute({ orderId }: { orderId: string }) {
		const commission = await this.affiliateCommissionRepository.findByOrderId(orderId);

		// Refund de pedido sem afiliado
		if (!commission) {
			return;
		}

		// Já processado anteriormente
		if (commission.status === 'CANCELED') {
			return;
		}

		commission.cancel();

		await this.affiliateCommissionRepository.save(commission);
	}
}
