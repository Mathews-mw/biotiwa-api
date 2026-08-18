import { Order } from '@/domains/main/models/entities/order';
import { IOrderResponseSchema } from '../../schemas/checkout/order-schema';

export class OrderPresenter {
	static toHTTP(data: Order): IOrderResponseSchema {
		return {
			id: data.id.toString(),
			user_id: data.userId.toString(),
			cart_id: data.cartId ? data.cartId.toString() : null,
			market_code: data.marketCode,
			currency: data.currency,
			status: data.status,
			items_amount: data.itemsAmount,
			order_bump_amount: data.orderBumpAmount,
			subtotal_amount: data.subtotalAmount,
			discount_amount: data.discountAmount,
			tax_amount: data.taxAmount,
			shipping_amount: data.shippingAmount,
			total_amount: data.totalAmount,
			expires_at: data.expiresAt ?? null,
			created_at: data.createdAt,
			updated_at: data.updatedAt ?? null,
		};
	}
}
