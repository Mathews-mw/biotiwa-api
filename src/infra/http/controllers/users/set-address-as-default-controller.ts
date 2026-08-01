import { container } from 'tsyringe';
import { FastifyReply, FastifyRequest } from 'fastify';

import type { ISetAddressAsDefaultParams } from '../../schemas/user/set-address-as-default-schema';

import { SetAddressAsDefaultUseCase } from '@/domains/main/application/modules/users/use-cases/set-address-as-default-use-case';

export async function setAddressAsDefaultController(request: FastifyRequest, reply: FastifyReply) {
	const { addressId } = request.params as ISetAddressAsDefaultParams;

	const service = container.resolve(SetAddressAsDefaultUseCase);

	const result = await service.execute({
		addressId,
	});

	if (result.isFalse()) {
		throw result.value;
	}

	return reply.status(201).send({ message: 'Address updated successfully' });
}
