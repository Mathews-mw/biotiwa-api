import { container } from 'tsyringe';
import type { FastifyReply, FastifyRequest } from 'fastify';

import { getAuthenticatedSession } from '@/infra/http/helpers/get-authenticated-session';
import { CheckoutQuotePresenter } from '../../presenters/checkout/checkout-quote-presenter';
import { CreateCheckoutQuoteUseCase } from '@/domains/main/application/modules/checkout/use-cases/create-checkout-quote-use-case';

export async function createCheckoutQuoteController(request: FastifyRequest, reply: FastifyReply) {
	const session = getAuthenticatedSession(request);

	//TODO: refatorar a rota, controller e use case para que sejam destinados a fornecer uma prévia dos valores do checkout;
	// Não necessariamente precisa ter valores de cotação de frete
	// Pode ser somente previa dos valores dos itens do carrinho
	const service = container.resolve(CreateCheckoutQuoteUseCase);

	const result = await service.execute({
		userId: session.userId,
		destinationPostalCode: '',
		shippingRateId: '',
	});

	if (result.isFalse()) {
		throw result.value;
	}

	return reply.status(200).send(CheckoutQuotePresenter.toHTTP(result.value.quote));
}
