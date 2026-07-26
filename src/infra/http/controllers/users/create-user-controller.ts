import { container } from 'tsyringe';
import { FastifyReply, FastifyRequest } from 'fastify';

import type { ICreateUserRequest } from '../../schemas/user/create-user-schema';
import { CreateUserUseCase } from '@/domains/main/application/modules/users/use-cases/create-user-use-case';

export async function createUserController(request: FastifyRequest, reply: FastifyReply) {
	const { name, email, password, image, user_consents } = request.body as ICreateUserRequest;

	const service = container.resolve(CreateUserUseCase);

	const ip = request.ip;
	const userAgent = request.headers['user-agent'];

	const result = await service.execute({
		name,
		email,
		password,
		image,
		userConsent: {
			consents: user_consents.map((item) => {
				return {
					type: item.type,
					version: item.version,
					acceptedAt: item.accepted_at,
				};
			}),
			ipAddress: ip,
			userAgent,
		},
		context: {
			headers: request.headers,
			ip,
			userAgent,
		},
	});

	if (result.isFalse()) {
		throw result.value;
	}

	for (const header of result.value.responseHeaders) {
		reply.header(header.name, header.value);
	}

	return reply.status(201).send({ message: 'User created successfully', user_id: result.value.user.id.toString() });
}
