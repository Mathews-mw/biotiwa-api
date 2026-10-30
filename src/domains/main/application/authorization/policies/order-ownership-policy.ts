import { inject, injectable } from 'tsyringe';

import type { IAuthorizationPolicy } from '@/core/auth/policies/authorization-policy';
import type { IAuthorizationContext } from '@/core/auth/policies/authorization-context';
import type { IOrderAuthorizationRepository } from '../repositories/order-authorization-repository';

import { ForbiddenError } from '@/core/errors/forbidden-error';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';

@injectable()
export class OrderOwnershipPolicy implements IAuthorizationPolicy {
	constructor(
		@inject(DEPENDENCY_IDENTIFIERS.ORDER_AUTHORIZATION_REPOSITORY)
		private readonly orderAuthorizationRepository: IOrderAuthorizationRepository
	) {}

	supports(context: IAuthorizationContext) {
		return context.user.role === 'CUSTOMER' && context.entity === 'Order' && context.action === 'read';
	}

	async authorize(context: IAuthorizationContext) {
		if (!context.resourceId) {
			throw new Error('OrderOwnershipPolicy requires resourceId.');
		}

		const belongsToUser = await this.orderAuthorizationRepository.belongsToUser({
			orderId: context.resourceId,
			userId: context.user.id,
		});

		if (!belongsToUser) {
			throw new ForbiddenError('You cannot access this resource', 'RESOURCE_ACCESS_FORBIDDEN');
		}
	}
}
