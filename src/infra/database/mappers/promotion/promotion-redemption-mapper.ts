import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { PromotionRedemption } from '@/domains/main/models/entities/promotion-redemption';
import { PromotionRedemption as PrismaPromotionRedemption } from '@/generated/prisma/client';

export class PromotionRedemptionMapper {
	static toDomain(data: PrismaPromotionRedemption): PromotionRedemption {
		return PromotionRedemption.create(
			{
				promotionCodeId: new UniqueEntityId(data.promotionCodeId),
				userId: new UniqueEntityId(data.userId),
				orderId: new UniqueEntityId(data.orderId),
				status: data.status,
				discountAmount: data.discountAmount,
				reservedUntil: data.reservedUntil,
				redeemedAt: data.redeemedAt,
				canceledAt: data.canceledAt,
				expiredAt: data.expiredAt,
				createdAt: data.createdAt,
				updatedAt: data.updatedAt,
			},
			new UniqueEntityId(data.id)
		);
	}

	static toPrisma(data: PromotionRedemption): PrismaPromotionRedemption {
		return {
			id: data.id.toString(),
			promotionCodeId: data.promotionCodeId.toString(),
			userId: data.userId.toString(),
			orderId: data.orderId.toString(),
			status: data.status,
			discountAmount: data.discountAmount,
			reservedUntil: data.reservedUntil ?? null,
			redeemedAt: data.redeemedAt ?? null,
			canceledAt: data.canceledAt ?? null,
			expiredAt: data.expiresAt ?? null,
			createdAt: data.createdAt,
			updatedAt: data.updatedAt ?? null,
		};
	}
}
