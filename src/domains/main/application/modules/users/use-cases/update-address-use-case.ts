import { inject, injectable } from 'tsyringe';

import type { IMarketCode } from '@/core/types/market-code';
import type { IAddressRepository } from '../repositories/address-repository';

import { failure, Outcome, success } from '@/core/outcome';
import { Address } from '@/domains/main/models/entities/address';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';

interface IRequest {
	addressId: string;
	market?: IMarketCode;
	label?: string | null;
	recipient?: string | null;
	postalCode?: string;
	addressLine1?: string;
	number?: string | null;
	addressLine2?: string | null;
	district?: string | null;
	city?: string;
	state?: string;
	country?: string;
}

type Response = Outcome<ResourceNotFoundError, { address: Address }>;

@injectable()
export class UpdateAddressUseCase {
	constructor(
		@inject(DEPENDENCY_IDENTIFIERS.ADDRESSES_REPOSITORY)
		private addressesRepository: IAddressRepository
	) {}

	async execute({
		addressId,
		market,
		label,
		recipient,
		postalCode,
		addressLine1,
		number,
		addressLine2,
		district,
		city,
		state,
		country,
	}: IRequest): Promise<Response> {
		const address = await this.addressesRepository.findById(addressId);

		if (!address) {
			return failure(new ResourceNotFoundError('Address not found', 'RESOURCE_NOT_FOUND_ERROR'));
		}

		address.market = market ?? address.market;
		address.label = label ?? address.label;
		address.recipient = recipient ?? address.recipient;
		address.postalCode = postalCode ?? address.postalCode;
		address.addressLine1 = addressLine1 ?? address.addressLine1;
		address.number = number ?? address.number;
		address.addressLine2 = addressLine2 ?? address.addressLine2;
		address.district = district ?? address.district;
		address.city = city ?? address.city;
		address.state = state ?? address.state;
		address.country = country ?? address.country;

		await this.addressesRepository.update(address);

		return success({ address });
	}
}
