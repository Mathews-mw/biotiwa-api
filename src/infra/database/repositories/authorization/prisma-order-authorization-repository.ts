import { prisma } from '../../prisma';

import type { IOrderAuthorizationRepository } from '@/domains/main/application/authorization/repositories/order-authorization-repository';

export class PrismaOrderAuthorizationRepository implements IOrderAuthorizationRepository {
	async belongsToUser(input: { orderId: string; userId: string }): Promise<boolean> {
		const order = await prisma.order.findFirst({
			where: {
				id: input.orderId,
				userId: input.userId,
			},

			select: {
				id: true,
			},
		});

		return Boolean(order);
	}
}
