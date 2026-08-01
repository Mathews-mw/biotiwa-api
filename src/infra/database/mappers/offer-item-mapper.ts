import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { OfferItem } from '@/domains/main/models/entities/offer-item';
import { OfferItem as PrismaOfferItem } from '@/generated/prisma/client';

export class OfferItemMapper {
	static toDomain(data: PrismaOfferItem): OfferItem {
		return OfferItem.create(
			{
				offerId: new UniqueEntityId(data.offerId),
				productId: new UniqueEntityId(data.productId),
				quantity: data.quantity,
				createdAt: data.createdAt,
			},
			new UniqueEntityId(data.id)
		);
	}

	static toPrisma(data: OfferItem): PrismaOfferItem {
		return {
			id: data.id.toString(),
			offerId: data.offerId.toString(),
			productId: data.productId.toString(),
			quantity: data.quantity,
			createdAt: data.createdAt,
		};
	}
}
