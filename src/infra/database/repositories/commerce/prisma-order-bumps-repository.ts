import { prisma } from '../../prisma';
import { OrderBumpMapper } from '../../mappers/order-bump-mapper';
import { OrderBump } from '@/domains/main/models/entities/order-bump';

import type { IOrderBumpRepository } from '@/domains/main/application/modules/commerce/repositories/order-bump-repository';

export class PrismaOrderBumpsRepository implements IOrderBumpRepository {
	async create(orderBump: OrderBump) {
		const data = OrderBumpMapper.toPrisma(orderBump);

		await prisma.orderBump.create({
			data,
		});
	}

	async update(orderBump: OrderBump) {
		const data = OrderBumpMapper.toPrisma(orderBump);

		await prisma.orderBump.update({
			data,
			where: {
				id: data.id,
			},
		});
	}

	async delete(orderBump: OrderBump) {
		await prisma.orderBump.delete({
			where: {
				id: orderBump.id.toString(),
			},
		});
	}

	async findMany(): Promise<OrderBump[]> {
		const orderBumps = await prisma.orderBump.findMany();

		return orderBumps.map(OrderBumpMapper.toDomain);
	}

	async findById(id: string) {
		const orderBump = await prisma.orderBump.findUnique({
			where: {
				id,
			},
		});

		if (!orderBump) {
			return null;
		}

		return OrderBumpMapper.toDomain(orderBump);
	}
}
