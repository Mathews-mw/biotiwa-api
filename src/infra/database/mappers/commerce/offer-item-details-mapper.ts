import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { OfferItem as PrismaOfferItem } from '@/generated/prisma/client';
import { IPrismaProductDetails, ProductDetailsMapper } from './product-details-mapper';
import { OfferItemDetails } from '@/domains/main/models/value-objects/offer-item-details';

export type IPrismaOfferItemDetails = PrismaOfferItem & {
	product: IPrismaProductDetails;
};

export class OfferItemDetailsMapper {
	static toDomain(data: IPrismaOfferItemDetails): OfferItemDetails {
		return OfferItemDetails.create({
			id: new UniqueEntityId(data.id),
			offerId: new UniqueEntityId(data.offerId),
			productId: new UniqueEntityId(data.productId),
			quantity: data.quantity,
			createdAt: data.createdAt,
			product: ProductDetailsMapper.toDomain(data.product),
		});
	}
}
