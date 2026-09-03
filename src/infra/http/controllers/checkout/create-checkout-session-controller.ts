import { container } from 'tsyringe';
import type { FastifyReply, FastifyRequest } from 'fastify';

import { getAuthenticatedSession } from '@/infra/http/helpers/get-authenticated-session';
import { CheckoutSessionPresenter } from '../../presenters/checkout/checkout-session-presenter';
import { CreateCheckoutSessionUseCase } from '@/domains/main/application/modules/checkout/use-cases/create-checkout-session-use-case';

import type { ICreateCheckoutSessionRequest } from '../../schemas/checkout/create-checkout-session-schema';

export async function createCheckoutSessionController(
	request: FastifyRequest<{ Body: ICreateCheckoutSessionRequest }>,
	reply: FastifyReply
) {
	const session = getAuthenticatedSession(request);

	const service = container.resolve(CreateCheckoutSessionUseCase);

	const { customer, shipping_address } = request.body;

	const result = await service.execute({
		userId: session.userId,
		customer: {
			name: customer.name,
			email: customer.email,
			phone: customer.phone,
			document: customer.document,
			birthDate: customer.birth_date,
		},
		shippingAddress: {
			zipCode: shipping_address.zip_code,
			street: shipping_address.street,
			number: shipping_address.number,
			complement: shipping_address.complement,
			district: shipping_address.district,
			city: shipping_address.city,
			state: shipping_address.state,
			countryCode: shipping_address.country_code,
		},
	});

	console.log('createCheckoutSessionController result: ', result);

	if (result.isFalse()) {
		throw result.value;
	}

	return reply.status(201).send(CheckoutSessionPresenter.toHTTP(result.value.checkoutSession));
}
