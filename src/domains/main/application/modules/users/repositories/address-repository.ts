import { Address } from '@/domains/main/models/entities/address';

export interface IParams {
	userId: string;
	isDefault?: boolean;
}

export interface IAddressRepository {
	create(address: Address): Promise<void>;
	update(address: Address): Promise<void>;
	delete(address: Address): Promise<void>;
	setAsDefault(address: Address): Promise<void>;
	findById(id: string): Promise<Address | null>;
	findManyByUserId(params: IParams): Promise<Address[]>;
}
