import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { CartItem } from '@/domains/main/models/entities/cart-item';
import { CartItem as PrismaCartItem } from '@/generated/prisma/client';

export class CartItemMapper {
	static toDomain(data: PrismaCartItem): CartItem {
		return CartItem.create(
			{
				cartId: new UniqueEntityId(data.cartId),
				productId: data.productId ? new UniqueEntityId(data.productId) : null,
				offerId: data.offerId ? new UniqueEntityId(data.offerId) : null,
				orderBumpId: data.orderBumpId ? new UniqueEntityId(data.orderBumpId) : null,
				type: data.type,
				quantity: data.quantity,
				createdAt: data.createdAt,
				updatedAt: data.updatedAt,
			},
			new UniqueEntityId(data.id)
		);
	}

	static toPrisma(data: CartItem): PrismaCartItem {
		return {
			id: data.id.toString(),
			cartId: data.cartId.toString(),
			productId: data.productId ? data.productId.toString() : null,
			offerId: data.offerId ? data.offerId.toString() : null,
			orderBumpId: data.orderBumpId ? data.orderBumpId.toString() : null,
			type: data.type,
			quantity: data.quantity,
			createdAt: data.createdAt,
			updatedAt: data.updatedAt ?? null,
		};
	}
}
