import { container } from 'tsyringe';
import { FastifyReply, FastifyRequest } from 'fastify';

import type { IUpdateAddressParams, IUpdateAddressRequest } from '../../schemas/user/update-address-schema';

import { AddressPresenter } from '../../presenters/address-presenter';
import { UpdateAddressUseCase } from '@/domains/main/application/modules/users/use-cases/update-address-use-case';

export async function updateAddressController(request: FastifyRequest, reply: FastifyReply) {
	const { addressId } = request.body as IUpdateAddressParams;
	const {
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
	} = request.body as IUpdateAddressRequest;

	const service = container.resolve(UpdateAddressUseCase);

	const result = await service.execute({
		addressId,
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
	});

	if (result.isFalse()) {
		throw result.value;
	}

	return reply
		.status(200)
		.send({ message: 'Address updated successfully', address: AddressPresenter.toHTTP(result.value.address) });
}
