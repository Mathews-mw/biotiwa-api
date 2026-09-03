import { prisma } from '../../prisma';
import { Prisma } from '@/generated/prisma/client';
import { Order } from '@/domains/main/models/entities/order';
import { OrderDetailsMapper } from '../../mappers/order/order-details-mapper';

import type {
	ICreateOrderWithItemsInput,
	IFindOrdersByUserParams,
	IOrderRepository,
} from '@/domains/main/application/modules/orders/repositories/order-repository';

const orderInclude = {
	orderCustomer: true,
	orderShippingAddress: true,
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
	async createWithItems(input: ICreateOrderWithItemsInput) {
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

			if (input.orderCustomer) {
				await tx.orderCustomer.create({
					data: {
						id: input.orderCustomer.id.toString(),
						orderId: createdOrder.id,
						name: input.orderCustomer.name,
						email: input.orderCustomer.email,
						phone: input.orderCustomer.phone ?? null,
						document: input.orderCustomer.document ?? null,
						birthDate: input.orderCustomer.birthDate ?? null,
						createdAt: input.orderCustomer.createdAt,
						updatedAt: input.orderCustomer.updatedAt,
					},
				});
			}

			if (input.shippingAddress) {
				await tx.orderShippingAddress.create({
					data: {
						id: input.shippingAddress.id.toString(),
						orderId: createdOrder.id,
						zipCode: input.shippingAddress.zipCode,
						street: input.shippingAddress.street,
						number: input.shippingAddress.number ?? null,
						complement: input.shippingAddress.complement ?? null,
						district: input.shippingAddress.district ?? null,
						city: input.shippingAddress.city,
						state: input.shippingAddress.state,
						countryCode: input.shippingAddress.countryCode,
						createdAt: input.shippingAddress.createdAt,
						updatedAt: input.shippingAddress.updatedAt,
					},
				});
			}

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

	async findManyByUser({ page, perPage, userId, search }: IFindOrdersByUserParams) {
		const query: Prisma.OrderFindManyArgs = {
			where: {
				userId,
				items: {
					some: {
						name: {
							contains: search,
							mode: 'insensitive',
						},
					},
				},
			},
		};

		const isPerPageNumber = typeof perPage === 'number';

		const [orders, count] = await prisma.$transaction([
			prisma.order.findMany({
				where: query.where,
				include: orderInclude,
				take: isPerPageNumber ? perPage : undefined,
				skip: isPerPageNumber ? (page - 1) * perPage : undefined,
			}),
			prisma.order.count({
				where: query.where,
			}),
		]);

		let _perPage = isPerPageNumber ? perPage : 10;

		if (perPage === 'all') {
			_perPage = count;
		}

		const totalPages = Math.ceil(count / _perPage);

		const pagination = {
			page,
			perPage: _perPage,
			totalPages,
			totalOccurrences: count,
		};

		return {
			pagination,
			orders: orders.map(OrderDetailsMapper.toDomain),
		};
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
