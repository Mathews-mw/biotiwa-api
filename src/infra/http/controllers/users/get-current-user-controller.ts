import { container } from 'tsyringe';
import { FastifyReply, FastifyRequest } from 'fastify';

import { UserPresenter } from '../../presenters/user-presenter';
import { getAuthenticatedSession } from '../../helpers/get-authenticated-session';
import { GetCurrentUserUseCase } from '@/domains/main/application/modules/users/use-cases/get-current-user-use-case';

export async function getCurrentUserController(request: FastifyRequest, reply: FastifyReply) {
	const session = getAuthenticatedSession(request);

	const service = container.resolve(GetCurrentUserUseCase);

	const result = await service.execute({
		userId: session.userId,
	});

	if (result.isFalse()) {
		throw result.value;
	}

	return reply.status(200).send(UserPresenter.toHTTP(result.value.user));
}
