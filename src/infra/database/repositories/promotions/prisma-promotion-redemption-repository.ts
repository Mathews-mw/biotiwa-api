import type {
	ICountPromotionUsagesByCustomerInput,
	ICountPromotionUsagesInput,
	IPromotionRedemptionRepository,
} from '@/domains/main/application/modules/promotions/repositories/promotion-redemption-repository';

import { prisma } from '../../prisma';

export class PrismaPromotionRedemptionRepository implements IPromotionRedemptionRepository {
	async countReservedUsages({ promotionCodeId }: ICountPromotionUsagesInput): Promise<number> {
		return prisma.promotionRedemption.count({
			where: {
				promotionCodeId,
				status: {
					in: ['PENDING', 'REDEEMED'],
				},
			},
		});
	}

	async countReservedUsagesByCustomer({
		promotionCodeId,
		userId,
	}: ICountPromotionUsagesByCustomerInput): Promise<number> {
		return prisma.promotionRedemption.count({
			where: {
				promotionCodeId: promotionCodeId.toString(),
				userId: userId.toString(),
				status: {
					in: ['PENDING', 'REDEEMED'],
				},
			},
		});
	}
}
