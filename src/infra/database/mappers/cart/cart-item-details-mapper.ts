import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { CartItem as PrismaCartItem } from '@/generated/prisma/client';
import { CartItemDetails } from '@/domains/main/models/value-objects/cart-item-details';
import { IPrismaOfferDetails, OfferDetailsMapper } from '../commerce/offer-details-mapper';
import { IPrismaProductDetails, ProductDetailsMapper } from '../commerce/product-details-mapper';
import { IPrismaOrderBumpDetails, OrderBumpDetailsMapper } from '../commerce/order-bump-details-mapper';

export type IPrismaCartItemDetails = PrismaCartItem & {
	offer?: IPrismaOfferDetails | null;
	orderBump?: IPrismaOrderBumpDetails | null;
	product?: IPrismaProductDetails | null;
};

export class CartItemDetailsMapper {
	static toDomain(data: IPrismaCartItemDetails): CartItemDetails {
		return CartItemDetails.create({
			id: new UniqueEntityId(data.id),
			cartId: new UniqueEntityId(data.cartId),
			productId: data.productId ? new UniqueEntityId(data.productId) : null,
			offerId: data.offerId ? new UniqueEntityId(data.offerId) : null,
			orderBumpId: data.orderBumpId ? new UniqueEntityId(data.orderBumpId) : null,
			type: data.type,
			quantity: data.quantity,
			createdAt: data.createdAt,
			updatedAt: data.updatedAt,
			offer: data.offer ? OfferDetailsMapper.toDomain(data.offer) : null,
			orderBump: data.orderBump ? OrderBumpDetailsMapper.toDomain(data.orderBump) : null,
			product: data.product ? ProductDetailsMapper.toDomain(data.product) : null,
		});
	}
}
