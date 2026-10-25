import type { Affiliate as PrismaAffiliate } from '@/generated/prisma/client';

import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Affiliate } from '@/domains/main/models/entities/affiliate';

export class AffiliateMapper {
	static toDomain(raw: PrismaAffiliate): Affiliate {
		return Affiliate.create(
			{
				userId: new UniqueEntityId(raw.userId),
				type: raw.type,
				status: raw.status,
				createdAt: raw.createdAt,
				updatedAt: raw.updatedAt,
			},
			new UniqueEntityId(raw.id)
		);
	}

	static toPrisma(raw: Affiliate): PrismaAffiliate {
		return {
			id: raw.id.toString(),
			userId: raw.userId.toString(),
			type: raw.type,
			status: raw.status,
			createdAt: raw.createdAt,
			updatedAt: raw.updatedAt ?? null,
		};
	}
}
