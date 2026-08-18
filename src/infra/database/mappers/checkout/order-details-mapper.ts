import { OrderMapper } from './order-mapper';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import type { Order as PrismaOrder } from '@/generated/prisma/client';
import { OrderDetails } from '@/domains/main/models/value-objects/order-details';
import { IPrismaOrderItemDetails, OrderItemDetailsMapper } from './order-item-details-mapper';

export type IPrismaOrderDetails = PrismaOrder & {
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
			items: data.items.map(OrderItemDetailsMapper.toDomain),
		});
	}
}
