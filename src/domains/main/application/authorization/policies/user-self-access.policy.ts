import { injectable } from 'tsyringe';

import { ForbiddenError } from '@/core/errors/forbidden-error';

import type { IAuthorizationPolicy } from '@/core/auth/policies/authorization-policy';
import type { IAuthorizationContext } from '@/core/auth/policies/authorization-context';

@injectable()
export class UserSelfAccessPolicy implements IAuthorizationPolicy {
	supports(context: IAuthorizationContext) {
		return (
			context.user.role === 'CUSTOMER' &&
			context.entity === 'User' &&
			(context.action === 'read' || context.action === 'update')
		);
	}

	async authorize(context: IAuthorizationContext) {
		if (!context.resourceId) {
			throw new Error('UserSelfAccessPolicy requires resourceId.');
		}

		if (context.resourceId !== context.user.id) {
			throw new ForbiddenError('You cannot access this resource', 'RESOURCE_ACCESS_FORBIDDEN');
		}
	}
}
