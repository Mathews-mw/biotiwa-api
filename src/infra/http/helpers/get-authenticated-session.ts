import { UnauthorizedError } from '@/core/errors/unauthorized-error';
import type { FastifyRequest } from 'fastify';

export function getAuthenticatedSession(request: FastifyRequest) {
	if (!request.session) {
		throw new UnauthorizedError('Authentication middleware was not executed', 'AUTH_MIDDLEWARE_NOT_EXECUTED');
	}

	return request.session;
}
