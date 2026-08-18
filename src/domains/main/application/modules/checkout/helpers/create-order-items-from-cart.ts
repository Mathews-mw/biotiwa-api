import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { OrderItem } from '@/domains/main/models/entities/order-item';
import { CartDetails } from '@/domains/main/models/value-objects/cart-details';

export function createOrderItemsFromCart(input: { orderId: string; cart: CartDetails }) {
	const orderItems: Array<OrderItem> = [];

	for (const cartItem of input.cart.items) {
		if (cartItem.type === 'OFFER' && cartItem.offer) {
			for (const offerItem of cartItem.offer.items) {
				const quantity = offerItem.quantity * cartItem.quantity;
				const totalAmount = cartItem.offer.unitAmount * quantity;

				orderItems.push(
					OrderItem.create({
						orderId: new UniqueEntityId(input.orderId),
						productId: offerItem.product.id,
						type: 'OFFER_ITEM',
						name: offerItem.product.name,
						sku: offerItem.product.sku,
						quantity,
						unitAmount: cartItem.offer.unitAmount,
						totalAmount,
						metadata: {
							cart_item_id: cartItem.id.toString(),
							offer_id: cartItem.offer.id.toString(),
							offer_slug: cartItem.offer.slug,
							offer_name: cartItem.offer.name,
							discount_percent: cartItem.offer.discountPercent,
						},
					})
				);
			}
		}

		if (cartItem.type === 'ORDER_BUMP' && cartItem.orderBump) {
			const quantity = cartItem.orderBump.quantity * cartItem.quantity;
			const totalAmount = cartItem.orderBump.unitAmount * quantity;

			orderItems.push(
				OrderItem.create({
					orderId: new UniqueEntityId(input.orderId),
					productId: cartItem.orderBump.product.id,
					type: 'ORDER_BUMP',
					name: cartItem.orderBump.name,
					sku: cartItem.orderBump.product.sku,
					quantity,
					unitAmount: cartItem.orderBump.unitAmount,
					totalAmount,
					metadata: {
						cart_item_id: cartItem.id.toString(),
						order_bump_id: cartItem.orderBump.id.toString(),
						product_name: cartItem.orderBump.product.name,
					},
				})
			);
		}
	}

	return orderItems;
}
