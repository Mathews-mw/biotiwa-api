import { ProductMapper } from './product-mapper';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { OfferItemDetails } from '@/domains/main/models/value-objects/offer-item-details';
import { Product as PrismaProduct, OfferItem as PrismaOfferItem } from '@/generated/prisma/client';

export type IPrismaOfferItemDetails = PrismaOfferItem & {
	product: PrismaProduct;
};

export class OfferItemDetailsMapper {
	static toDomain(data: IPrismaOfferItemDetails): OfferItemDetails {
		return OfferItemDetails.create({
			id: new UniqueEntityId(data.id),
			offerId: new UniqueEntityId(data.offerId),
			productId: new UniqueEntityId(data.productId),
			quantity: data.quantity,
			createdAt: data.createdAt,
			product: ProductMapper.toDomain(data.product),
		});
	}
}
