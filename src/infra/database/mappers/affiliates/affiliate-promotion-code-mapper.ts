import type { AffiliatePromotionCode as PrismaAffiliatePromotionCode } from '@/generated/prisma/client';

import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { AffiliatePromotionCode } from '@/domains/main/models/entities/affiliate-promotion-code';

export class AffiliatePromotionCodeMapper {
	static toDomain(raw: PrismaAffiliatePromotionCode): AffiliatePromotionCode {
		return AffiliatePromotionCode.create(
			{
				affiliateId: new UniqueEntityId(raw.affiliateId),
				promotionCodeId: new UniqueEntityId(raw.promotionCodeId),
				commissionRate: raw.commissionRate,
				createdAt: raw.createdAt,
				updatedAt: raw.updatedAt,
			},
			new UniqueEntityId(raw.id)
		);
	}

	static toPrisma(data: AffiliatePromotionCode): PrismaAffiliatePromotionCode {
		return {
			id: data.id.toString(),
			affiliateId: data.affiliateId.toString(),
			promotionCodeId: data.promotionCodeId.toString(),
			commissionRate: data.commissionRate,
			createdAt: data.createdAt,
			updatedAt: data.updatedAt ?? null,
		};
	}
}
