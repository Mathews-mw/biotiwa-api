import { OrderItem } from '@/domains/main/models/entities/order-item';
import { IOrderItemResponseSchema } from '../../schemas/order/order-item-schema';

export class OrderItemPresenter {
	static toHTTP(data: OrderItem): IOrderItemResponseSchema {
		return {
			id: data.id.toString(),
			order_d: data.orderId.toString(),
			product_d: data.productId ? data.productId.toString() : null,
			type: data.type,
			name: data.name,
			sku: data.sku,
			quantity: data.quantity,
			unit_amount: data.unitAmount,
			total_amount: data.totalAmount,
			metadata: data.metadata ?? null,
			created_at: data.createdAt,
		};
	}
}
