import { Address } from '@/domains/main/models/entities/address';
import { IAddressResponseSchema } from '../schemas/user/address-schema';

export class AddressPresenter {
	static toHTTP(data: Address): IAddressResponseSchema {
		return {
			id: data.id.toString(),
			user_id: data.userId.toString(),
			market: data.market,
			label: data.label,
			recipient: data.recipient,
			postal_code: data.postalCode,
			address_line_1: data.addressLine1,
			number: data.number,
			address_line_2: data.addressLine2,
			district: data.district,
			city: data.city,
			state: data.state,
			country: data.country,
			is_default: data.isDefault,
			created_at: data.createdAt,
			updated_at: data.updatedAt,
		};
	}
}
