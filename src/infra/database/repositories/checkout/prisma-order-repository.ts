import { prisma } from '../../prisma';
import { Prisma } from '@/generated/prisma/client';
import { Order } from '@/domains/main/models/entities/order';
import { OrderItem } from '@/domains/main/models/entities/order-item';
import { OrderDetailsMapper } from '../../mappers/checkout/order-details-mapper';

import type { IOrderRepository } from '@/domains/main/application/modules/checkout/repositories/order-repository';

const orderInclude = {
	items: {
		include: {
			product: true,
		},
		orderBy: {
			createdAt: 'asc',
		},
	},
} satisfies Prisma.OrderInclude;

export class PrismaOrderRepository implements IOrderRepository {
	async createWithItems(input: { order: Order; items: Array<OrderItem> }) {
		const order = await prisma.$transaction(async (tx) => {
			const createdOrder = await tx.order.create({
				data: {
					id: input.order.id.toString(),
					userId: input.order.userId.toString(),
					cartId: input.order.cartId?.toString() ?? null,
					marketCode: input.order.marketCode,
					currency: input.order.currency,
					status: input.order.status,
					itemsAmount: input.order.itemsAmount,
					orderBumpAmount: input.order.orderBumpAmount,
					subtotalAmount: input.order.subtotalAmount,
					discountAmount: input.order.discountAmount,
					taxAmount: input.order.taxAmount,
					shippingAmount: input.order.shippingAmount,
					totalAmount: input.order.totalAmount,
					expiresAt: input.order.expiresAt,
					createdAt: input.order.createdAt,
					updatedAt: input.order.updatedAt,
				},
			});

			await tx.orderItem.createMany({
				data: input.items.map((item) => ({
					id: item.id.toString(),
					orderId: createdOrder.id,
					productId: item.productId?.toString() ?? null,
					type: item.type,
					name: item.name,
					sku: item.sku,
					quantity: item.quantity,
					unitAmount: item.unitAmount,
					totalAmount: item.totalAmount,
					metadata: item.metadata ? (item.metadata as Prisma.JsonObject) : Prisma.JsonNull,
					createdAt: item.createdAt,
				})),
			});

			return tx.order.findUniqueOrThrow({
				where: {
					id: createdOrder.id,
				},
				include: orderInclude,
			});
		});

		return OrderDetailsMapper.toDomain(order);
	}

	async save(order: Order) {
		const updatedOrder = await prisma.order.update({
			where: {
				id: order.id.toString(),
			},
			data: {
				status: order.status,
				updatedAt: order.updatedAt,
			},
			include: orderInclude,
		});

		return OrderDetailsMapper.toDomain(updatedOrder);
	}

	async findById(orderId: string) {
		const order = await prisma.order.findUnique({
			where: {
				id: orderId.toString(),
			},
			include: orderInclude,
		});

		if (!order) {
			return null;
		}

		return OrderDetailsMapper.toDomain(order);
	}

	async findPendingByCartId(cartId: string) {
		const order = await prisma.order.findFirst({
			where: {
				cartId: cartId,
				status: 'PENDING_PAYMENT',
				expiresAt: {
					gt: new Date(),
				},
			},
			include: orderInclude,
			orderBy: {
				createdAt: 'desc',
			},
		});

		if (!order) {
			return null;
		}

		return OrderDetailsMapper.toDomain(order);
	}
}
