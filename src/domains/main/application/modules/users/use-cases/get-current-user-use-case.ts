import { inject, injectable } from 'tsyringe';

import type { IUserRepository } from '../repositories/user-repository';

import { failure, Outcome, success } from '@/core/outcome';
import { User } from '@/domains/main/models/entities/user';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';

interface IRequest {
	userId: string;
}

type Response = Outcome<ResourceNotFoundError, { user: User }>;

@injectable()
export class GetCurrentUserUseCase {
	constructor(@inject(DEPENDENCY_IDENTIFIERS.USERS_REPOSITORY) private usersRepository: IUserRepository) {}

	async execute({ userId }: IRequest): Promise<Response> {
		const user = await this.usersRepository.findById(userId);

		if (!user) {
			return failure(new ResourceNotFoundError('User not found', 'RESOURCE_NOT_FOUND_ERROR'));
		}

		return success({ user });
	}
}
