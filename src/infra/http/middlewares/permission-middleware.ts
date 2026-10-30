import { FastifyRequest } from 'fastify';

import { ForbiddenError } from '@/core/errors/forbidden-error';
import { userAuthSchema } from '@/core/auth/models/user-auth-model';
import { Actions, AuthAbility, Entities } from '@/core/auth/auth-ability';

export function verifyUserPermissions(entity: Entities, action: Actions) {
	return async (request: FastifyRequest) => {
		const session = request.session;

		const userAuth = userAuthSchema.parse({
			id: session?.userId,
			role: session?.userRole,
		});

		const canPerformAction = AuthAbility.canPerformAction(userAuth, action, entity);

		if (!canPerformAction) {
			throw new ForbiddenError('You have no permission to perform this action', 'INSUFFICIENT_PERMISSION_ERROR');
		}
	};
}
