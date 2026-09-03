import type { IPaginationParams, IPaginationResponse } from '@/core/interfaces/paginating-interfaces';

import { Order } from '@/domains/main/models/entities/order';
import { OrderItem } from '@/domains/main/models/entities/order-item';
import { OrderCustomer } from '@/domains/main/models/entities/order-customer';
import { OrderDetails } from '@/domains/main/models/value-objects/order-details';
import { OrderShippingAddress } from '@/domains/main/models/entities/order-shipping-address';

export interface ICreateOrderWithItemsInput {
	order: Order;
	orderCustomer?: OrderCustomer | null;
	shippingAddress?: OrderShippingAddress | null;
	items: Array<OrderItem>;
}

export interface IFindOrdersByUserParams extends IPaginationParams {
	userId: string;
	search?: string;
}

export interface IFindOrdersByUserResponse {
	pagination: IPaginationResponse;
	orders: Array<OrderDetails>;
}

export interface IOrderRepository {
	createWithItems(input: ICreateOrderWithItemsInput): Promise<OrderDetails>;
	save(order: Order): Promise<OrderDetails>;
	findManyByUser(query: IFindOrdersByUserParams): Promise<IFindOrdersByUserResponse>;
	findById(orderId: string): Promise<OrderDetails | null>;
	findPendingByCartId(cartId: string): Promise<OrderDetails | null>;
}
