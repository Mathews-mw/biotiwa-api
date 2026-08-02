import { container } from 'tsyringe';
import { FastifyReply, FastifyRequest } from 'fastify';

import type { IUpdateCustomerProfileRequest } from '../../schemas/user/update-customer-profile-schema';

import { CustomerProfilePresenter } from '../../presenters/users/customer-presenter';
import { getAuthenticatedSession } from '../../helpers/get-authenticated-session';
import { UpdateCustomerProfileUseCase } from '@/domains/main/application/modules/users/use-cases/update-customer-profile-use-case';

export async function updateCustomerProfileController(request: FastifyRequest, reply: FastifyReply) {
	const session = getAuthenticatedSession(request);
	const { birth_date, document, phone, preferred_market } = request.body as IUpdateCustomerProfileRequest;

	const service = container.resolve(UpdateCustomerProfileUseCase);

	const result = await service.execute({
		userId: session.userId,
		birthDate: birth_date,
		document,
		phone,
		preferredMarket: preferred_market,
	});

	if (result.isFalse()) {
		throw result.value;
	}

	return reply.status(200).send({
		message: 'CustomerProfile updated successfully',
		customer_profile: CustomerProfilePresenter.toHTTP(result.value.customerProfile),
	});
}
