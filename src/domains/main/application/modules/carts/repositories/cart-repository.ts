import { Cart } from '@/domains/main/models/entities/cart';
import { CartItem } from '@/domains/main/models/entities/cart-item';
import { CartDetails } from '@/domains/main/models/value-objects/cart-details';
import { OfferDetails } from '@/domains/main/models/value-objects/offer-details';
import { OrderBumpDetails } from '@/domains/main/models/value-objects/order-bump-details';

import type { IMarketCode } from '@/core/types/market-code';

export interface ICartRepository {
	create(cart: Cart): Promise<CartDetails>;
	createItem(cartItem: CartItem): Promise<CartDetails>;
	saveItem(cartItem: CartItem): Promise<CartDetails>;
	removeItem(cartItem: CartItem): Promise<CartDetails>;
	clearActiveCart(userId: string): Promise<void>;
	findActiveByUserId(userId: string): Promise<CartDetails | null>;
	findOfferDetailsById(offerId: string): Promise<OfferDetails | null>;
	findOrderBumpDetailsById(orderBumpId: string): Promise<OrderBumpDetails | null>;
	findItemByOffer(input: { cartId: string; offerId: string }): Promise<CartItem | null>;
	findItemByOrderBump(input: { cartId: string; orderBumpId: string }): Promise<CartItem | null>;
	findItemByIdAndUserId(input: { cartItemId: string; userId: string }): Promise<CartItem | null>;
	findActiveByUserIdAndMarket(input: { userId: string; marketCode: IMarketCode }): Promise<CartDetails | null>;
}
