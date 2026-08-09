import { CartItemDetails } from '@/domains/main/models/value-objects/cart-item-details';
import { ICartItemDetailsResponseSchema } from '../../schemas/cart/cart-item-details-schema';
import { ProductPresenter } from '../commerce/product-presenter';
import { OfferDetailsPresenter } from '../commerce/offer-details-presenter';
import { OderBumpDetailsPresenter } from '../commerce/oder-bump-details-presenter';

export class CartItemDetailsPresenter {
	static toHTTP(data: CartItemDetails): ICartItemDetailsResponseSchema {
		return {
			id: data.id.toString(),
			cart_id: data.cartId.toString(),
			product_id: data.productId ? data.productId.toString() : null,
			offer_id: data.offerId ? data.offerId.toString() : null,
			order_bump_id: data.orderBumpId ? data.orderBumpId.toString() : null,
			type: data.type,
			quantity: data.quantity,
			product: data.product ? ProductPresenter.toHTTP(data.product) : null,
			offer: data.offer ? OfferDetailsPresenter.toHTTP(data.offer) : null,
			order_bump: data.orderBump ? OderBumpDetailsPresenter.toHTTP(data.orderBump) : null,
			created_at: data.createdAt,
			updated_at: data.updatedAt ?? null,
		};
	}
}
