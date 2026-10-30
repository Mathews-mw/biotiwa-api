import { inject, injectable } from 'tsyringe';

import type { IAuthorizationPolicy } from '@/core/auth/policies/authorization-policy';
import type { IAuthorizationContext } from '@/core/auth/policies/authorization-context';
import type { IAddressAuthorizationRepository } from '../repositories/address-authorization-repository';

import { ForbiddenError } from '@/core/errors/forbidden-error';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';

@injectable()
export class AddressOwnershipPolicy implements IAuthorizationPolicy {
	constructor(
		@inject(DEPENDENCY_IDENTIFIERS.ADDRESS_AUTHORIZATION_REPOSITORY)
		private readonly addressAuthorizationRepository: IAddressAuthorizationRepository
	) {}

	supports(context: IAuthorizationContext) {
		return context.user.role === 'CUSTOMER' && context.entity === 'Address' && context.action === 'read';
	}

	async authorize(context: IAuthorizationContext) {
		if (!context.resourceId) {
			throw new Error('AddressOwnershipPolicy requires resourceId.');
		}

		const belongsToUser = await this.addressAuthorizationRepository.belongsToUser({
			addressId: context.resourceId,
			userId: context.user.id,
		});

		if (!belongsToUser) {
			throw new ForbiddenError('You cannot access this resource', 'RESOURCE_ACCESS_FORBIDDEN');
		}
	}
}
