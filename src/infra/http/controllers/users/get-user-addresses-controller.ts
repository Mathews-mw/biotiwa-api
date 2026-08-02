import { container } from 'tsyringe';
import { FastifyReply, FastifyRequest } from 'fastify';

import type { IGetUserAddressesQuery } from '../../schemas/user/get-user-addresses-schema';

import { AddressPresenter } from '../../presenters/users/address-presenter';
import { getAuthenticatedSession } from '../../helpers/get-authenticated-session';
import { GetUserAddressesUseCase } from '@/domains/main/application/modules/users/use-cases/get-user-addresses-use-case';

export async function getUserAddressesController(request: FastifyRequest, reply: FastifyReply) {
	const { is_default } = request.query as IGetUserAddressesQuery;
	const session = getAuthenticatedSession(request);

	const service = container.resolve(GetUserAddressesUseCase);

	const result = await service.execute({
		userId: session.userId,
		isDefault: is_default,
	});

	if (result.isFalse()) {
		throw result.value;
	}

	return reply.status(200).send(result.value.addresses.map(AddressPresenter.toHTTP));
}
