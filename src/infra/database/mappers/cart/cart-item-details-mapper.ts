import { ProductMapper } from '../commerce/product-mapper';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { CartItemDetails } from '@/domains/main/models/value-objects/cart-item-details';
import { IPrismaOfferDetails, OfferDetailsMapper } from '../commerce/offer-details-mapper';
import { CartItem as PrismaCartItem, Product as PrismaProduct } from '@/generated/prisma/client';
import { IPrismaOrderBumpDetails, OrderBumpDetailsMapper } from '../commerce/order-bump-details-mapper';

export type IPrismaCartItemDetails = PrismaCartItem & {
	offer?: IPrismaOfferDetails | null;
	orderBump?: IPrismaOrderBumpDetails | null;
	product?: PrismaProduct | null;
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
			product: data.product ? ProductMapper.toDomain(data.product) : null,
		});
	}
}
