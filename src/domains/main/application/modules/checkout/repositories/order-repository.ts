import { Order } from '@/domains/main/models/entities/order';
import { OrderItem } from '@/domains/main/models/entities/order-item';
import { OrderDetails } from '@/domains/main/models/value-objects/order-details';

export interface IOrderRepository {
	createWithItems(input: { order: Order; items: Array<OrderItem> }): Promise<OrderDetails>;
	save(order: Order): Promise<OrderDetails>;
	findById(orderId: string): Promise<OrderDetails | null>;
	findPendingByCartId(cartId: string): Promise<OrderDetails | null>;
}
