import { container } from 'tsyringe';
import type { FastifyReply, FastifyRequest } from 'fastify';

import type { IGetShippingRatesRequest } from '../../schemas/shipping/get-shipping-rates-schema';

import { getAuthenticatedSession } from '@/infra/http/helpers/get-authenticated-session';
import { ShippingRatePresenter } from '../../presenters/shipping/shipping-rate-presenter';
import { GetShippingRatesUseCase } from '@/domains/main/application/modules/shipping/use-cases/get-shipping-rates-use-case';

export async function getShippingRatesController(request: FastifyRequest, reply: FastifyReply) {
	const session = getAuthenticatedSession(request);

	const { postal_code } = request.body as IGetShippingRatesRequest;

	const useCase = container.resolve(GetShippingRatesUseCase);

	const result = await useCase.execute({
		userId: session.userId,
		destinationPostalCode: postal_code,
	});

	if (result.isFalse()) {
		throw result.value;
	}

	return reply.status(200).send({
		rates: result.value.rates.map(ShippingRatePresenter.toHTTP),
	});
}
