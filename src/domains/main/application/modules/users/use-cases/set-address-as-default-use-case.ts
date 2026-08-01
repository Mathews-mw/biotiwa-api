import { inject, injectable } from 'tsyringe';

import type { IAddressRepository } from '../repositories/address-repository';

import { failure, Outcome, success } from '@/core/outcome';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';

interface IRequest {
	addressId: string;
}

type Response = Outcome<ResourceNotFoundError, null>;

@injectable()
export class SetAddressAsDefaultUseCase {
	constructor(
		@inject(DEPENDENCY_IDENTIFIERS.ADDRESSES_REPOSITORY)
		private addressesRepository: IAddressRepository
	) {}

	async execute({ addressId }: IRequest): Promise<Response> {
		const address = await this.addressesRepository.findById(addressId);

		if (!address) {
			return failure(new ResourceNotFoundError('Address not found', 'RESOURCE_NOT_FOUND_ERROR'));
		}

		await this.addressesRepository.setAsDefault(address);

		return success(null);
	}
}
