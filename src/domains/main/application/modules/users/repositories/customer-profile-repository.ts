import { CustomerProfile } from '@/domains/main/models/entities/customer-profile';

export interface ICustomerProfileRepository {
	create(customerProfile: CustomerProfile): Promise<void>;
	update(customerProfile: CustomerProfile): Promise<void>;
	delete(customerProfile: CustomerProfile): Promise<void>;
	findById(id: string): Promise<CustomerProfile | null>;
	findByUserId(userId: string): Promise<CustomerProfile | null>;
}
