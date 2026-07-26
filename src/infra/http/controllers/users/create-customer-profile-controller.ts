import { container } from 'tsyringe';
import { FastifyReply, FastifyRequest } from 'fastify';

import { ICreateCustomerProfileRequest } from '../../schemas/user/create-customer-profile-schema';
import { CreateCustomerProfileUseCase } from '@/domains/main/application/modules/users/use-cases/create-customer-profile-use-case';

export async function createCustomerProfileController(request: FastifyRequest, reply: FastifyReply) {
	const { user_id, preferred_market, birth_date, phone } = request.body as ICreateCustomerProfileRequest;

	const service = container.resolve(CreateCustomerProfileUseCase);

	const result = await service.execute({
		userId: user_id,
		preferredMarket: preferred_market,
		phone,
		birthDate: birth_date,
	});

	if (result.isFalse()) {
		throw result.value;
	}

	return reply.status(201).send({
		message: 'Customer profile created successfully',
		customer_profile_id: result.value.customerProfile.id.toString(),
	});
}
