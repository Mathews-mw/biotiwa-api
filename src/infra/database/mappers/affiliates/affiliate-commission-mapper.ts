import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { AffiliateCommission } from '@/domains/main/models/entities/affiliate-commission';
import type { AffiliateCommission as PrismaAffiliateCommission } from '@/generated/prisma/client';

export class PrismaAffiliateCommissionMapper {
	static toDomain(raw: PrismaAffiliateCommission) {
		return AffiliateCommission.create(
			{
				affiliateId: new UniqueEntityId(raw.affiliateId),
				orderId: new UniqueEntityId(raw.orderId),
				promotionCode: raw.promotionCode,
				commissionBaseAmount: raw.commissionBaseAmount,
				commissionRate: raw.commissionRate,
				commissionAmount: raw.commissionAmount,
				currency: raw.currency,
				status: raw.status,
				availableAt: raw.availableAt,
				paidAt: raw.paidAt,
				canceledAt: raw.canceledAt,
				createdAt: raw.createdAt,
				updatedAt: raw.updatedAt,
			},
			new UniqueEntityId(raw.id)
		);
	}

	static toPrisma(commission: AffiliateCommission): PrismaAffiliateCommission {
		return {
			id: commission.id.toString(),
			affiliateId: commission.affiliateId.toString(),
			orderId: commission.orderId.toString(),
			promotionCode: commission.promotionCode,
			commissionBaseAmount: commission.commissionBaseAmount,
			commissionRate: commission.commissionRate,
			commissionAmount: commission.commissionAmount,
			currency: commission.currency,
			status: commission.status,
			availableAt: commission.availableAt ?? null,
			paidAt: commission.paidAt ?? null,
			canceledAt: commission.canceledAt,
			createdAt: commission.createdAt,
			updatedAt: commission.updatedAt ?? null,
		};
	}
}
