import { container } from 'tsyringe';
import { FastifyRequest } from 'fastify';

import type { IRole } from '@/core/auth/roles';
import type { IIdentityProvider } from '@/domains/main/application/ports/identity-provider';

import { UnauthorizedError } from '@/core/errors/unauthorized-error';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';

export async function authMiddleware(request: FastifyRequest) {
	const identityProvider = container.resolve<IIdentityProvider>(DEPENDENCY_IDENTIFIERS.IDENTITY_PROVIDER);

	const session = await identityProvider.getSession({
		context: {
			headers: request.headers,
			ip: request.ip,
			userAgent: request.headers['user-agent'],
		},
	});

	if (!session) {
		throw new UnauthorizedError('Invalid session or expired', 'INVALID_SESSION_EXPIRED');
	}

	request.session = {
		userId: session.user.id,
		userEmail: session.user.email,
		userRole: session.user.role as IRole,
		sessionId: session.sessionId,
		expiresAt: session.expiresAt,
	};
}
