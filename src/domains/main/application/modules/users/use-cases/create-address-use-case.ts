import { inject, injectable } from 'tsyringe';

import type { IMarketCode } from '@/core/types/market-code';
import type { IAddressRepository } from '../repositories/address-repository';

import { Outcome, success } from '@/core/outcome';
import { Address } from '@/domains/main/models/entities/address';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';

interface IRequest {
	userId: string;
	market: IMarketCode;
	label?: string | null;
	recipient?: string | null;
	postalCode: string;
	addressLine1: string;
	number?: string | null;
	addressLine2?: string | null;
	district?: string | null;
	city: string;
	state: string;
	country: string;
	isDefault?: boolean;
}

type Response = Outcome<null, { address: Address }>;

@injectable()
export class CreateAddressUseCase {
	constructor(
		@inject(DEPENDENCY_IDENTIFIERS.ADDRESSES_REPOSITORY)
		private addressesRepository: IAddressRepository
	) {}

	async execute({
		userId,
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
		isDefault,
	}: IRequest): Promise<Response> {
		const newAddress = Address.create({
			userId: new UniqueEntityId(userId),
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
			isDefault,
		});

		await this.addressesRepository.create(newAddress);

		return success({ address: newAddress });
	}
}
