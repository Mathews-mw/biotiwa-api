import { inject, injectable } from 'tsyringe';

import type { ICurrencyCode } from '@/core/types/currency-code';
import type { AffiliateCommission } from '@/domains/main/models/entities/affiliate-commission';
import type { IAffiliateCommissionRepository } from '../repositories/affiliate-commission-repository';

import { success, type Outcome } from '@/core/outcome';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';

interface IReleasedCommission {
	id: string;
	affiliateId: string;
	orderId: string;
	commissionAmount: number;
	currency: ICurrencyCode;
	availableAt: Date;
}

type IResponse = Outcome<
	null,
	{
		analyzedAt: Date;
		releasedCount: number;
		releasedCommissions: IReleasedCommission[];
	}
>;

@injectable()
export class ReleaseEligibleAffiliateCommissionsUseCase {
	constructor(
		@inject(DEPENDENCY_IDENTIFIERS.AFFILIATE_COMMISSION_REPOSITORY)
		private readonly affiliateCommissionRepository: IAffiliateCommissionRepository
	) {}

	async execute(): Promise<IResponse> {
		const now = new Date();

		const commissions = await this.affiliateCommissionRepository.findPendingEligibleForRelease(now);

		if (commissions.length === 0) {
			return success({
				analyzedAt: now,
				releasedCount: 0,
				releasedCommissions: [],
			});
		}

		for (const commission of commissions) {
			commission.markAsAvailable(now);
		}

		await this.affiliateCommissionRepository.saveMany(commissions);

		return success({
			analyzedAt: now,
			releasedCount: commissions.length,
			releasedCommissions: commissions.map((commission: AffiliateCommission) => ({
				id: commission.id.toString(),
				affiliateId: commission.affiliateId.toString(),
				orderId: commission.orderId.toString(),
				commissionAmount: commission.commissionAmount,
				currency: commission.currency,
				availableAt: commission.availableAt!,
			})),
		});
	}
}
