import { inject, injectable } from 'tsyringe';

import type { IUserRepository } from '../../users/repositories/user-repository';
import type { IAffiliateRepository } from '../repositories/affiliate-repository';

import { failure, success, type Outcome } from '@/core/outcome';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { BadRequestError } from '@/core/errors/bad-request-errors';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';
import { Affiliate, type IAffiliateType } from '@/domains/main/models/entities/affiliate';

interface IRequest {
	userId: string;
	type: IAffiliateType;
}

type Response = Outcome<
	ResourceNotFoundError | BadRequestError,
	{
		affiliate: Affiliate;
	}
>;

@injectable()
export class RegisterAffiliateUseCase {
	constructor(
		@inject(DEPENDENCY_IDENTIFIERS.AFFILIATES_REPOSITORY)
		private affiliateRepository: IAffiliateRepository,
		@inject(DEPENDENCY_IDENTIFIERS.USERS_REPOSITORY)
		private userRepository: IUserRepository
	) {}

	async execute({ userId, type }: IRequest): Promise<Response> {
		const user = await this.userRepository.findById(userId);

		if (!user) {
			return failure(new ResourceNotFoundError('User not found', 'USER_NOT_FOUND'));
		}

		const existingAffiliate = await this.affiliateRepository.findByUserId(userId);

		if (existingAffiliate) {
			return failure(new BadRequestError('User is already registered as an affiliate', 'AFFILIATE_ALREADY_EXISTS'));
		}

		const affiliate = Affiliate.create({
			userId: new UniqueEntityId(userId),
			type,
			status: 'PENDING',
		});

		await this.affiliateRepository.create(affiliate);

		return success({ affiliate });
	}
}
