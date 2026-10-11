import type {
	ICountPromotionUsagesByCustomerInput,
	ICountPromotionUsagesInput,
	IPromotionRedemptionRepository,
} from '@/domains/main/application/modules/promotions/repositories/promotion-redemption-repository';

import { prisma } from '../../prisma';
import { PromotionRedemption } from '@/domains/main/models/entities/promotion-redemption';
import { PromotionRedemptionMapper } from '../../mappers/promotion/promotion-redemption-mapper';

export class PrismaPromotionRedemptionRepository implements IPromotionRedemptionRepository {
	async save(promotionRedemption: PromotionRedemption): Promise<void> {
		const prismaData = PromotionRedemptionMapper.toPrisma(promotionRedemption);

		await prisma.promotionRedemption.upsert({
			where: {
				id: promotionRedemption.id.toString(),
			},
			update: {
				...prismaData,
			},
			create: {
				...prismaData,
			},
		});
	}

	async countReservedUsages({ promotionCodeId }: ICountPromotionUsagesInput): Promise<number> {
		return prisma.promotionRedemption.count({
			where: {
				promotionCodeId,
				OR: [
					{
						status: 'REDEEMED',
					},
					{
						status: 'PENDING',
						reservedUntil: {
							gt: new Date(),
						},
					},
				],
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
				OR: [
					{
						status: 'REDEEMED',
					},
					{
						status: 'PENDING',
						reservedUntil: {
							gt: new Date(),
						},
					},
				],
			},
		});
	}

	async findByOrderId(orderId: string): Promise<PromotionRedemption | null> {
		const result = await prisma.promotionRedemption.findUnique({
			where: {
				orderId,
			},
		});

		if (!result) {
			return null;
		}

		return PromotionRedemptionMapper.toDomain(result);
	}
}
