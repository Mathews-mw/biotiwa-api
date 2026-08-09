import { container } from 'tsyringe';
import type { FastifyReply, FastifyRequest } from 'fastify';

import { CartDetailsPresenter } from '../../presenters/cart/cart-details-presenter';
import { CartSummaryPresenter } from '../../presenters/cart/cart-summary-presenter';
import { getAuthenticatedSession } from '@/infra/http/helpers/get-authenticated-session';
import { GetActiveCartUseCase } from '@/domains/main/application/modules/carts/use-cases/get-active-cart-use-case';

export async function getActiveCartController(request: FastifyRequest, reply: FastifyReply) {
	const session = getAuthenticatedSession(request);

	const service = container.resolve(GetActiveCartUseCase);

	const result = await service.execute({
		userId: session.userId,
	});

	if (result.isFalse()) {
		throw result.value;
	}

	const { cart, summary } = result.value;

	const response = {
		cart: cart ? CartDetailsPresenter.toHTTP(cart) : null,
		summary: summary ? CartSummaryPresenter.toHTTP(summary) : null,
	};

	return reply.status(200).send(response);
}
