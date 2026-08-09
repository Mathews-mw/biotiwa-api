import { Offer } from '@/domains/main/models/entities/offer';
import { Offer as PrismaOffer } from '@/generated/prisma/client';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export class OfferMapper {
	static toDomain(data: PrismaOffer): Offer {
		return Offer.create(
			{
				slug: data.slug,
				marketCode: data.marketCode,
				name: data.name,
				description: data.description,
				unitAmount: data.unitAmount,
				discountPercent: data.discountPercent,
				isHighlighted: data.isHighlighted,
				status: data.status,
				sortOrder: data.sortOrder,
				createdAt: data.createdAt,
				updatedAt: data.updatedAt,
			},
			new UniqueEntityId(data.id)
		);
	}

	static toPrisma(data: Offer): PrismaOffer {
		return {
			id: data.id.toString(),
			slug: data.slug,
			marketCode: data.marketCode,
			name: data.name,
			description: data.description,
			unitAmount: data.unitAmount,
			discountPercent: data.discountPercent,
			isHighlighted: data.isHighlighted,
			status: data.status,
			sortOrder: data.sortOrder,
			createdAt: data.createdAt,
			updatedAt: data.updatedAt ?? null,
		};
	}
}
