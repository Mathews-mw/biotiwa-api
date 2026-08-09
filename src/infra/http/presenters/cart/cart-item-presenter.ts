import { CartItem } from '@/domains/main/models/entities/cart-item';
import { ICartItemResponseSchema } from '../../schemas/cart/cart-item-schema';

export class CartItemPresenter {
	static toHTTP(data: CartItem): ICartItemResponseSchema {
		return {
			id: data.id.toString(),
			cart_id: data.cartId.toString(),
			product_id: data.productId ? data.productId.toString() : null,
			offer_id: data.offerId ? data.offerId.toString() : null,
			order_bump_id: data.orderBumpId ? data.orderBumpId.toString() : null,
			type: data.type,
			quantity: data.quantity,
			created_at: data.createdAt,
			updated_at: data.updatedAt ?? null,
		};
	}
}
