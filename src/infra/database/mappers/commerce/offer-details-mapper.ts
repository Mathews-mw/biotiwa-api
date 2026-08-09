import { Offer as PrismaOffer } from '@/generated/prisma/client';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { OfferDetails } from '@/domains/main/models/value-objects/offer-details';
import { IPrismaOfferItemDetails, OfferItemDetailsMapper } from './offer-item-details-mapper';

export type IPrismaOfferDetails = PrismaOffer & {
	items: IPrismaOfferItemDetails[];
};

export class OfferDetailsMapper {
	static toDomain(data: IPrismaOfferDetails): OfferDetails {
		return OfferDetails.create({
			id: new UniqueEntityId(data.id),
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
			items: data.items.map(OfferItemDetailsMapper.toDomain),
		});
	}
}
