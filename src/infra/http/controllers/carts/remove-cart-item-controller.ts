import type { FastifyReply, FastifyRequest } from 'fastify';
import { container } from 'tsyringe';

import { getAuthenticatedSession } from '@/infra/http/helpers/get-authenticated-session';
import { RemoveCartItemUseCase } from '@/domains/main/application/modules/carts/use-cases/remove-cart-item-use-case';

type Params = {
	cartItemId: string;
};

export async function removeCartItemController(request: FastifyRequest, reply: FastifyReply) {
	const session = getAuthenticatedSession(request);
	const { cartItemId } = request.params as Params;

	const service = container.resolve(RemoveCartItemUseCase);

	const result = await service.execute({
		userId: session.userId,
		cartItemId,
	});

	if (result.isFalse()) {
		throw result.value;
	}

	return reply.status(204).send();
}
