import { container } from 'tsyringe';
import { FastifyReply, FastifyRequest } from 'fastify';

import { UserPresenter } from '../../presenters/users/user-presenter';
import { applyResponseHeaders } from '../../helpers/apply-response-headers';
import { AuthenticateUserRequest } from '../../schemas/auth/authenticate-user-schema';
import { AuthenticateWithCredentialsUseCase } from '@/domains/main/application/modules/auth/authenticate-with-credentials-use-case';

export async function authenticateWithCredentialsController(request: FastifyRequest, reply: FastifyReply) {
	const { email, password } = request.body as AuthenticateUserRequest;

	const authService = container.resolve(AuthenticateWithCredentialsUseCase);

	const ip = request.ip;
	const userAgent = request.headers['user-agent'];

	const result = await authService.execute({
		email,
		password,
		context: {
			headers: request.headers,
			ip,
			userAgent,
		},
	});

	if (result.isFalse()) {
		throw result.value;
	}

	const { user, responseHeaders } = result.value;

	applyResponseHeaders(reply, responseHeaders);

	return reply.status(200).send({
		message: 'Authenticated successfully',
		user: UserPresenter.toHTTP(user),
	});
}
