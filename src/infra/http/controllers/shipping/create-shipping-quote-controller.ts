import { z } from 'zod';
import { container } from 'tsyringe';
import type { FastifyReply, FastifyRequest } from 'fastify';

import type { ICreateShippingQuoteRequest } from '../../schemas/shipping/create-shipping-quote-schema';

import { getAuthenticatedSession } from '@/infra/http/helpers/get-authenticated-session';
import { ShippingQuoteDetailsPresenter } from '../../presenters/shipping/shipping-quote-details-presenter';
import { CreateShippingQuoteUseCase } from '@/domains/main/application/modules/shipping/use-cases/create-shipping-quote-use-case';

export const createShippingQuoteBodySchema = z.object({
	postal_code: z.string().min(8),
});

export async function createShippingQuoteController(request: FastifyRequest, reply: FastifyReply) {
	const session = getAuthenticatedSession(request);

	const { postal_code } = request.body as ICreateShippingQuoteRequest;

	const service = container.resolve(CreateShippingQuoteUseCase);

	const result = await service.execute({
		userId: session.userId,
		destinationPostalCode: postal_code,
	});

	if (result.isFalse()) {
		throw result.value;
	}

	return reply.status(201).send(ShippingQuoteDetailsPresenter.toHTTP(result.value.shippingQuote));
}
