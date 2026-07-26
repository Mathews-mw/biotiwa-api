import { container } from 'tsyringe';
import { FastifyReply, FastifyRequest } from 'fastify';

import { ICreateAddressRequest } from '../../schemas/user/create-address-schema';
import { CreateAddressUseCase } from '@/domains/main/application/modules/users/use-cases/create-address-use-case';

export async function createAddressController(request: FastifyRequest, reply: FastifyReply) {
	const {
		user_id,
		market,
		label,
		recipient,
		postal_code,
		address_line_1,
		number,
		address_line_2,
		district,
		city,
		state,
		country,
		is_default,
	} = request.body as ICreateAddressRequest;

	const service = container.resolve(CreateAddressUseCase);

	const result = await service.execute({
		userId: user_id,
		market,
		label,
		recipient,
		postalCode: postal_code,
		addressLine1: address_line_1,
		number,
		addressLine2: address_line_2,
		district,
		city,
		state,
		country,
		isDefault: is_default,
	});

	if (result.isFalse()) {
		throw result.value;
	}

	return reply
		.status(201)
		.send({ message: 'Address created successfully', address_id: result.value.address.id.toString() });
}
