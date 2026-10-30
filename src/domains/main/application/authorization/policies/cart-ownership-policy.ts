import { inject, injectable } from 'tsyringe';

import type { IAuthorizationPolicy } from '@/core/auth/policies/authorization-policy';
import type { IAuthorizationContext } from '@/core/auth/policies/authorization-context';
import type { ICartAuthorizationRepository } from '../repositories/cart-authorization-repository';

import { ForbiddenError } from '@/core/errors/forbidden-error';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';

@injectable()
export class CartOwnershipPolicy implements IAuthorizationPolicy {
	constructor(
		@inject(DEPENDENCY_IDENTIFIERS.CART_AUTHORIZATION_REPOSITORY)
		private readonly cartAuthorizationRepository: ICartAuthorizationRepository
	) {}

	supports(context: IAuthorizationContext) {
		return context.user.role === 'CUSTOMER' && context.entity === 'Cart' && context.action === 'read';
	}

	async authorize(context: IAuthorizationContext) {
		if (!context.resourceId) {
			throw new Error('CartOwnershipPolicy requires resourceId.');
		}

		const belongsToUser = await this.cartAuthorizationRepository.belongsToUser({
			cartId: context.resourceId,
			userId: context.user.id,
		});

		if (!belongsToUser) {
			throw new ForbiddenError('You cannot access this resource', 'RESOURCE_ACCESS_FORBIDDEN');
		}
	}
}
