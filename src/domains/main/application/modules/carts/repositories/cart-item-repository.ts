import { CartItem } from '@/domains/main/models/entities/cart-item';

export abstract class CartItemRepository {
	abstract create(market: CartItem): Promise<void>;
	abstract createMany(market: CartItem[]): Promise<void>;
	abstract update(market: CartItem): Promise<void>;
	abstract delete(market: CartItem): Promise<void>;
	abstract findItemByOffer(params: { cartId: string; offerId: string }): Promise<CartItem | null>;
	abstract findItemByOrderBump(params: { cartId: string; orderBumpId: string }): Promise<CartItem | null>;
	abstract findItemByIdAndUserId(params: { cartItemId: string; userId: string }): Promise<CartItem | null>;
}
