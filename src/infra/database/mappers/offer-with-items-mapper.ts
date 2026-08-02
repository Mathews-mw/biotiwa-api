import { OfferItemMapper } from './offer-item-mapper';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { OfferWithItems } from '@/domains/main/models/value-objects/offer-with-item';
import { OfferItem as PrismaOfferItem, Offer as PrismaOffer } from '@/generated/prisma/client';

export type IPrismaOfferWithItem = PrismaOffer & {
	items: PrismaOfferItem[];
};

export class OfferWithItemsMapper {
	static toDomain(data: IPrismaOfferWithItem): OfferWithItems {
		return OfferWithItems.create({
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
			items: data.items.map(OfferItemMapper.toDomain),
		});
	}
}
