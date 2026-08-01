import { container } from 'tsyringe';
import { FastifyReply, FastifyRequest } from 'fastify';

import { applyResponseHeaders } from '../../helpers/apply-response-headers';
import { SignOutUserUseCase } from '@/domains/main/application/modules/auth/sign-out-user-use-case';

export async function signOutUserController(request: FastifyRequest, reply: FastifyReply) {
	const service = container.resolve(SignOutUserUseCase);

	const result = await service.execute({
		context: {
			headers: request.headers,
			ip: request.ip,
			userAgent: request.headers['user-agent'],
		},
	});

	if (result.isFalse()) {
		throw result.value;
	}

	applyResponseHeaders(reply, result.value.responseHeaders);

	return reply.status(204).send();
}
