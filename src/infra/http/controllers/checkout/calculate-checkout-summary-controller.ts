import { container } from 'tsyringe';
import type { FastifyReply, FastifyRequest } from 'fastify';

import type { ICalculateCheckoutSummaryRequest } from '../../schemas/checkout/calculate-checkout-summary-schema';

import { getAuthenticatedSession } from '@/infra/http/helpers/get-authenticated-session';
import { CheckoutSummaryPresenter } from '../../presenters/checkout/checkout-summary-presenter';
import { CalculateCheckoutSummaryUseCase } from '@/domains/main/application/modules/checkout/use-cases/calculate-checkout-summary-use-case';

export async function calculateCheckoutSummaryController(request: FastifyRequest, reply: FastifyReply) {
	const session = getAuthenticatedSession(request);

	const { shipping_rate_id } = request.body as ICalculateCheckoutSummaryRequest;

	const service = container.resolve(CalculateCheckoutSummaryUseCase);

	const result = await service.execute({
		userId: session.userId,
		shippingRateId: shipping_rate_id,
	});

	if (result.isFalse()) {
		throw result.value;
	}

	return reply.status(200).send(CheckoutSummaryPresenter.toHTTP(result.value.summary));
}
