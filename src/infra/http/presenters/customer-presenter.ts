import { CustomerProfile } from '@/domains/main/models/entities/customer-profile';
import type { ICustomerProfileResponseSchema } from '../schemas/user/customer-profile-schema';

export class CustomerProfilePresenter {
	static toHTTP(data: CustomerProfile): ICustomerProfileResponseSchema {
		return {
			id: data.id.toString(),
			user_id: data.userId.toString(),
			birth_date: data.birthDate,
			document: data.document,
			phone: data.phone,
			preferred_market: data.preferredMarket,
			created_at: data.createdAt,
			updated_at: data.updatedAt,
		};
	}
}
