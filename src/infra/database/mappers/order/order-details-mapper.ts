import { OrderMapper } from './order-mapper';
import { OrderCustomerMapper } from './order-customer-mapper';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { OrderShippingAddressMapper } from './order-shipping-address-mapper';
import { OrderDetails } from '@/domains/main/models/value-objects/order-details';

import { type IPrismaOrderItemDetails, OrderItemDetailsMapper } from './order-item-details-mapper';
import type {
	OrderCustomer as PrismaOrderCustomer,
	OrderShippingAddress as PrismaOrderShippingAddress,
	Order as PrismaOrder,
} from '@/generated/prisma/client';

export type IPrismaOrderDetails = PrismaOrder & {
	orderCustomer?: PrismaOrderCustomer | null;
	orderShippingAddress?: PrismaOrderShippingAddress | null;
	items: Array<IPrismaOrderItemDetails>;
};

export class OrderDetailsMapper {
	static toDomain(data: IPrismaOrderDetails): OrderDetails {
		return OrderDetails.create({
			id: new UniqueEntityId(data.id),
			userId: new UniqueEntityId(data.userId),
			cartId: data.cartId ? new UniqueEntityId(data.cartId) : null,
			marketCode: data.marketCode,
			currency: data.currency,
			status: data.status,
			itemsAmount: data.itemsAmount,
			orderBumpAmount: data.orderBumpAmount,
			subtotalAmount: data.subtotalAmount,
			discountAmount: data.discountAmount,
			taxAmount: data.taxAmount,
			shippingAmount: data.shippingAmount,
			totalAmount: data.totalAmount,
			expiresAt: data.expiresAt ?? null,
			createdAt: data.createdAt,
			updatedAt: data.updatedAt,
			order: OrderMapper.toDomain(data),
			orderCustomer: data.orderCustomer ? OrderCustomerMapper.toDomain(data.orderCustomer) : null,
			orderShippingAddress: data.orderShippingAddress
				? OrderShippingAddressMapper.toDomain(data.orderShippingAddress)
				: null,
			items: data.items.map(OrderItemDetailsMapper.toDomain),
		});
	}
}
