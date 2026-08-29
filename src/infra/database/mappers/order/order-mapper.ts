import { Order } from '@/domains/main/models/entities/order';
import { Order as PrismaOrder } from '@/generated/prisma/client';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export class OrderMapper {
	static toDomain(data: PrismaOrder): Order {
		return Order.create(
			{
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
			},
			new UniqueEntityId(data.id)
		);
	}

	static toPrisma(data: Order): PrismaOrder {
		return {
			id: data.id.toString(),
			userId: data.userId.toString(),
			cartId: data.cartId ? data.cartId.toString() : null,
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
			updatedAt: data.updatedAt ?? null,
		};
	}
}
