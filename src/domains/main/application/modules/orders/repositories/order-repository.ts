import type { IPaginationParams, IPaginationResponse } from '@/core/interfaces/paginating-interfaces';

import { Order } from '@/domains/main/models/entities/order';
import { OrderItem } from '@/domains/main/models/entities/order-item';
import { OrderDetails } from '@/domains/main/models/value-objects/order-details';

export interface IFindOrdersByUserParams extends IPaginationParams {
	userId: string;
	search?: string;
}

export interface IFindOrdersByUserResponse {
	pagination: IPaginationResponse;
	orders: Array<OrderDetails>;
}

export interface IOrderRepository {
	createWithItems(input: { order: Order; items: Array<OrderItem> }): Promise<OrderDetails>;
	save(order: Order): Promise<OrderDetails>;
	findManyByUser(query: IFindOrdersByUserParams): Promise<IFindOrdersByUserResponse>;
	findById(orderId: string): Promise<OrderDetails | null>;
	findPendingByCartId(cartId: string): Promise<OrderDetails | null>;
}
