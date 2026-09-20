import { CartDetails } from '@/domains/main/models/value-objects/cart-details';
import { createCartShippingFingerprint } from '../services/create-cart-shipping-fingerprint';

export function getCartShippingFingerprint(cart: CartDetails) {
	const cartFingerprint = createCartShippingFingerprint({
		cartId: cart.id.toString(),
		items: cart.items.map((details) => ({
			id: details.id.toString(),
			type: details.type,
			quantity: details.quantity,
			offerId: details.offer?.id.toString() ?? null,
			orderBumpId: details.orderBump?.id.toString() ?? null,
		})),
	});

	return cartFingerprint;
}
