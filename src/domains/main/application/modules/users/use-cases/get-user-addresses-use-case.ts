import { inject, injectable } from 'tsyringe';

import type { IAddressRepository } from '../repositories/address-repository';

import { Outcome, success } from '@/core/outcome';
import { Address } from '@/domains/main/models/entities/address';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';

interface IRequest {
	userId: string;
	isDefault?: boolean;
}

type Response = Outcome<null, { addresses: Address[] }>;

@injectable()
export class GetUserAddressesUseCase {
	constructor(@inject(DEPENDENCY_IDENTIFIERS.ADDRESSES_REPOSITORY) private addressesRepository: IAddressRepository) {}

	async execute({ userId, isDefault }: IRequest): Promise<Response> {
		const addresses = await this.addressesRepository.findManyByUserId({ userId, isDefault });

		return success({ addresses });
	}
}
