import { OrderBump } from '@/domains/main/models/entities/order-bump';

export interface IOrderBumpRepository {
	create(orderBump: OrderBump): Promise<void>;
	update(orderBump: OrderBump): Promise<void>;
	delete(orderBump: OrderBump): Promise<void>;
	findMany(): Promise<OrderBump[]>;
	findById(id: string): Promise<OrderBump | null>;
}
