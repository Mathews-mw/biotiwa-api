import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { PromotionCode } from '@/domains/main/models/entities/promotion-code';
import { PromotionCode as PrismaPromotionCode } from '@/generated/prisma/client';

export class PromotionCodeMapper {
	static toDomain(data: PrismaPromotionCode): PromotionCode {
		return PromotionCode.create(
			{
				code: data.code,
				type: data.type,
				status: data.status,
				marketCode: data.marketCode,
				discountType: data.discountType,
				discountValue: data.discountValue,
				maxUses: data.maxUses,
				maxUsesPerCustomer: data.maxUsesPerCustomer,
				startsAt: data.startsAt,
				expiresAt: data.expiresAt,
				createdAt: data.createdAt,
				updatedAt: data.updatedAt,
			},
			new UniqueEntityId(data.id)
		);
	}

	static toPrisma(data: PromotionCode): PrismaPromotionCode {
		return {
			id: data.id.toString(),
			code: data.code,
			type: data.type,
			status: data.status,
			marketCode: data.marketCode,
			discountType: data.discountType,
			discountValue: data.discountValue,
			maxUses: data.maxUses,
			maxUsesPerCustomer: data.maxUsesPerCustomer,
			startsAt: data.startsAt,
			expiresAt: data.expiresAt,
			createdAt: data.createdAt,
			updatedAt: data.updatedAt ?? null,
		};
	}
}
