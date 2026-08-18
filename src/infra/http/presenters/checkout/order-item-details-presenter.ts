import { OrderItemDetails } from '@/domains/main/models/value-objects/order-item-details';
import { IOrderItemDetailsResponseSchema } from '../../schemas/checkout/order-item-details-schema';
import { ProductPresenter } from '../commerce/product-presenter';

export class OrderItemDetailsPresenter {
	static toHTTP(data: OrderItemDetails): IOrderItemDetailsResponseSchema {
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
			product: data.product ? ProductPresenter.toHTTP(data.product) : null,
		};
	}
}
