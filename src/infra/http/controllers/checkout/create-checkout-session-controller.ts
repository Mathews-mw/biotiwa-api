import { container } from 'tsyringe';
import type { FastifyReply, FastifyRequest } from 'fastify';

import { getAuthenticatedSession } from '@/infra/http/helpers/get-authenticated-session';
import { CheckoutSessionPresenter } from '../../presenters/checkout/checkout-session-presenter';
import { CreateCheckoutSessionUseCase } from '@/domains/main/application/modules/checkout/use-cases/create-checkout-session-use-case';

export async function createCheckoutSessionController(request: FastifyRequest, reply: FastifyReply) {
	const session = getAuthenticatedSession(request);

	const service = container.resolve(CreateCheckoutSessionUseCase);

	const result = await service.execute({
		userId: session.userId,
	});

	if (result.isFalse()) {
		throw result.value;
	}

	return reply.status(201).send(CheckoutSessionPresenter.toHTTP(result.value.checkoutSession));
}
