import { inject, injectable } from 'tsyringe';

import type { IMarketCode } from '@/core/types/market-code';

import { failure, Outcome, success } from '@/core/outcome';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { CustomerProfile } from '@/domains/main/models/entities/customer-profile';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';
import { ICustomerProfileRepository } from '@/domains/main/application/modules/users/repositories/customer-profile-repository';

interface IRequest {
	userId: string;
	preferredMarket?: IMarketCode | null;
	phone?: string | null;
	birthDate?: Date | null;
	document?: string | null;
}

type Response = Outcome<ResourceNotFoundError, { customerProfile: CustomerProfile }>;

@injectable()
export class UpdateCustomerProfileUseCase {
	constructor(
		@inject(DEPENDENCY_IDENTIFIERS.CUSTOMER_PROFILES_REPOSITORY)
		private customerProfileRepository: ICustomerProfileRepository
	) {}

	async execute({ userId, birthDate, document, phone, preferredMarket }: IRequest): Promise<Response> {
		const customerProfile = await this.customerProfileRepository.findByUserId(userId);

		if (!customerProfile) {
			return failure(new ResourceNotFoundError('Customer profile not found', 'RESOURCE_NOT_FOUND_ERROR'));
		}

		customerProfile.preferredMarket = preferredMarket ?? customerProfile.preferredMarket;
		customerProfile.phone = phone ?? customerProfile.phone;
		customerProfile.birthDate = birthDate ?? customerProfile.birthDate;
		customerProfile.document = document ?? customerProfile.document;

		await this.customerProfileRepository.update(customerProfile);

		return success({ customerProfile });
	}
}
