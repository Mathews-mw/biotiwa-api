import { inject, injectable } from 'tsyringe';

import type { IMarketCode } from '@/core/types/market-code';
import type { ICustomerProfileRepository } from '../repositories/customer-profile-repository';

import { failure, Outcome, success } from '@/core/outcome';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { BadRequestError } from '@/core/errors/bad-request-errors';
import { CustomerProfile } from '@/domains/main/models/entities/customer-profile';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';

interface IRequest {
	userId: string;
	preferredMarket?: IMarketCode;
	phone?: string;
	birthDate?: Date;
}

type Response = Outcome<BadRequestError, { customerProfile: CustomerProfile }>;

@injectable()
export class CreateCustomerProfileUseCase {
	constructor(
		@inject(DEPENDENCY_IDENTIFIERS.CUSTOMER_PROFILES_REPOSITORY)
		private customerProfilesRepository: ICustomerProfileRepository
	) {}

	async execute({ userId, birthDate, phone, preferredMarket }: IRequest): Promise<Response> {
		const customerProfileAlreadyExists = await this.customerProfilesRepository.findByUserId(userId);

		if (customerProfileAlreadyExists) {
			return failure(new BadRequestError('Customer Profile already exists', 'BAD_REQUEST_ERROR'));
		}

		const newCustomerProfile = CustomerProfile.create({
			userId: new UniqueEntityId(userId),
			birthDate,
			phone,
			preferredMarket,
		});

		await this.customerProfilesRepository.create(newCustomerProfile);

		return success({ customerProfile: newCustomerProfile });
	}
}
