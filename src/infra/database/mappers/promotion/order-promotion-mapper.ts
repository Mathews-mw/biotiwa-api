import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { OrderPromotion } from '@/domains/main/models/entities/order-promotion';
import { OrderPromotion as PrismaOrderPromotion } from '@/generated/prisma/client';

export class OrderPromotionMapper {
	static toDomain(data: PrismaOrderPromotion): OrderPromotion {
		return OrderPromotion.create(
			{
				orderId: new UniqueEntityId(data.orderId),
				sourcePromotionCodeId: data.sourcePromotionCodeId ? new UniqueEntityId(data.sourcePromotionCodeId) : null,
				code: data.code,
				type: data.type,
				discountType: data.discountType,
				discountValue: data.discountValue,
				discountAmount: data.discountAmount,
				affiliateCommissionRate: data.affiliateCommissionRate,
				affiliateId: data.affiliateId ? new UniqueEntityId(data.affiliateId) : null,
				affiliatePromotionCodeId: data.affiliatePromotionCodeId
					? new UniqueEntityId(data.affiliatePromotionCodeId)
					: null,
				createdAt: data.createdAt,
				updatedAt: data.updatedAt,
			},
			new UniqueEntityId(data.id)
		);
	}

	static toPrisma(data: OrderPromotion): PrismaOrderPromotion {
		return {
			id: data.id.toString(),
			orderId: data.orderId.toString(),
			sourcePromotionCodeId: data.sourcePromotionCodeId ? data.sourcePromotionCodeId.toString() : null,
			code: data.code,
			type: data.type,
			discountType: data.discountType,
			discountValue: data.discountValue,
			discountAmount: data.discountAmount,
			affiliateCommissionRate: data.affiliateCommissionRate ?? null,
			affiliateId: data.affiliateId ? data.affiliateId.toString() : null,
			affiliatePromotionCodeId: data.affiliatePromotionCodeId ? data.affiliatePromotionCodeId.toString() : null,
			createdAt: data.createdAt,
			updatedAt: data.updatedAt ?? null,
		};
	}
}
