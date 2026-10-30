import { prisma } from '../../prisma';
import type { ICartAuthorizationRepository } from '@/domains/main/application/authorization/repositories/cart-authorization-repository';

export class PrismaCartAuthorizationRepository implements ICartAuthorizationRepository {
	async belongsToUser(input: { cartId: string; userId: string }): Promise<boolean> {
		const cart = await prisma.cart.findFirst({
			where: {
				id: input.cartId,
				userId: input.userId,
			},

			select: {
				id: true,
			},
		});

		return Boolean(cart);
	}
}
