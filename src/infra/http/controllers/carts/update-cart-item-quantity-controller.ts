import type { FastifyReply, FastifyRequest } from 'fastify';
import { container } from 'tsyringe';

import { getAuthenticatedSession } from '@/infra/http/helpers/get-authenticated-session';
import { UpdateCartItemQuantityUseCase } from '@/domains/main/application/modules/carts/use-cases/update-cart-item-quantity-use-case';

type Params = {
	cartItemId: string;
};

type Body = {
	quantity: number;
};

export async function updateCartItemQuantityController(request: FastifyRequest, reply: FastifyReply) {
	const session = getAuthenticatedSession(request);

	const { cartItemId } = request.params as Params;
	const { quantity } = request.body as Body;

	const service = container.resolve(UpdateCartItemQuantityUseCase);

	const result = await service.execute({
		userId: session.userId,
		cartItemId,
		quantity,
	});

	if (result.isFalse()) {
		throw result.value;
	}

	return reply.status(200).send({ message: 'Cart item quantity successfully updated' });
}
