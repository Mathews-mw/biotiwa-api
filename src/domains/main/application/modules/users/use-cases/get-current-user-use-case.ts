import { inject, injectable } from 'tsyringe';

import type { IUserRepository } from '../repositories/user-repository';

import { failure, Outcome, success } from '@/core/outcome';
import { User } from '@/domains/main/models/entities/user';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { CustomerProfile } from '@/domains/main/models/entities/customer-profile';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';
import { ICustomerProfileRepository } from '@/domains/main/application/modules/users/repositories/customer-profile-repository';

interface IRequest {
	userId: string;
}

type Response = Outcome<ResourceNotFoundError, { user: User; customerProfile: CustomerProfile | null }>;

@injectable()
export class GetCurrentUserUseCase {
	constructor(
		@inject(DEPENDENCY_IDENTIFIERS.USERS_REPOSITORY) private usersRepository: IUserRepository,
		@inject(DEPENDENCY_IDENTIFIERS.CUSTOMER_PROFILES_REPOSITORY)
		private customerProfilesRepository: ICustomerProfileRepository
	) {}

	async execute({ userId }: IRequest): Promise<Response> {
		const user = await this.usersRepository.findById(userId);

		if (!user) {
			return failure(new ResourceNotFoundError('User not found', 'RESOURCE_NOT_FOUND_ERROR'));
		}

		const customerProfile = await this.customerProfilesRepository.findByUserId(user.id.toString());

		return success({ user, customerProfile });
	}
}
