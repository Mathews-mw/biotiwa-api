import { OrderShippingAddress } from '@/domains/main/models/entities/order-shipping-address';
import type { IOrderShippingAddressResponseSchema } from '../../schemas/order/order-shipping-address-schema';

export class OrderShippingAddressPresenter {
	static toHTTP(data: OrderShippingAddress): IOrderShippingAddressResponseSchema {
		return {
			id: data.id.toString(),
			order_d: data.orderId.toString(),
			zip_code: data.zipCode,
			street: data.street,
			number: data.number ?? null,
			complement: data.complement ?? null,
			district: data.district ?? null,
			city: data.city,
			state: data.state,
			country_code: data.countryCode,
			created_at: data.createdAt,
			updated_at: data.updatedAt ?? null,
		};
	}
}
