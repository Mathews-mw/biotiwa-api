import type { FastifyReply, FastifyRequest } from 'fastify';
import { container } from 'tsyringe';

import { getAuthenticatedSession } from '@/infra/http/helpers/get-authenticated-session';
import { ClearCartUseCase } from '@/domains/main/application/modules/carts/use-cases/clear-cart-use-case';

export async function clearCartController(request: FastifyRequest, reply: FastifyReply) {
	const session = getAuthenticatedSession(request);

	const service = container.resolve(ClearCartUseCase);

	const result = await service.execute({
		userId: session.userId,
	});

	if (result.isFalse()) {
		throw result.value;
	}

	return reply.status(204).send();
}
