import { container } from 'tsyringe';
import type { FastifyReply, FastifyRequest } from 'fastify';

import { getAuthenticatedSession } from '@/infra/http/helpers/get-authenticated-session';
import { CheckoutQuotePresenter } from '../../presenters/checkout/checkout-quote-presenter';
import { CreateCheckoutQuoteUseCase } from '@/domains/main/application/modules/checkout/use-cases/create-checkout-quote-use-case';

export async function createCheckoutQuoteController(request: FastifyRequest, reply: FastifyReply) {
	const session = getAuthenticatedSession(request);

	const service = container.resolve(CreateCheckoutQuoteUseCase);

	const result = await service.execute({
		userId: session.userId,
	});

	if (result.isFalse()) {
		throw result.value;
	}

	return reply.status(200).send(CheckoutQuotePresenter.toHTTP(result.value.quote));
}
