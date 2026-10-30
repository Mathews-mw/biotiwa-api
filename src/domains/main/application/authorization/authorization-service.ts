import { injectAll, injectable } from 'tsyringe';

import type { IAuthorizationPolicy } from '@/core/auth/policies/authorization-policy';
import type { IAuthorizationContext } from '@/core/auth/policies/authorization-context';

import { AuthAbility } from '@/core/auth/auth-ability';
import { ForbiddenError } from '@/core/errors/forbidden-error';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';

@injectable()
export class AuthorizationService {
	constructor(
		@injectAll(DEPENDENCY_IDENTIFIERS.AUTHORIZATION_POLICY) // O `@injectAll()` recebe todas as implementações registradas naquele token.
		private readonly policies: IAuthorizationPolicy[]
	) {}

	async authorize(context: IAuthorizationContext): Promise<void> {
		const canPerformAction = AuthAbility.canPerformAction(context.user, context.action, context.entity);

		if (!canPerformAction) {
			throw new ForbiddenError('You have no permission to perform this action', 'INSUFFICIENT_PERMISSION_ERROR');
		}

		const applicablePolicies = this.policies.filter((policy) => policy.supports(context));

		for (const policy of applicablePolicies) {
			await policy.authorize(context);
		}
	}
}
