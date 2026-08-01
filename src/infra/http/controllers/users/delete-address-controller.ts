import { container } from 'tsyringe';
import { FastifyReply, FastifyRequest } from 'fastify';

import type { IDeleteAddressParams } from '../../schemas/user/delete-address-schema';

import { DeleteAddressUseCase } from '@/domains/main/application/modules/users/use-cases/delete-address-use-case';

export async function deleteAddressController(request: FastifyRequest, reply: FastifyReply) {
	const { addressId } = request.params as IDeleteAddressParams;

	const service = container.resolve(DeleteAddressUseCase);

	const result = await service.execute({
		addressId,
	});

	if (result.isFalse()) {
		throw result.value;
	}

	return reply.status(204).send();
}
