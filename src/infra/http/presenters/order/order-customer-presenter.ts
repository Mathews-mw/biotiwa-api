import { OrderCustomer } from '@/domains/main/models/entities/order-customer';
import type { IOrderCustomerResponseSchema } from '../../schemas/order/order-customer-schema';

export class OrderCustomerPresenter {
	static toHTTP(data: OrderCustomer): IOrderCustomerResponseSchema {
		return {
			id: data.id.toString(),
			order_d: data.orderId.toString(),
			name: data.name,
			email: data.email,
			phone: data.phone ?? null,
			document: data.document ?? null,
			birth_date: data.birthDate ?? null,
			created_at: data.createdAt,
			updated_at: data.updatedAt ?? null,
		};
	}
}
