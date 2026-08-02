import { CustomerProfile } from '@/domains/main/models/entities/customer-profile';

export abstract class ICustomerProfileRepository {
	abstract create(customerProfile: CustomerProfile): Promise<void>;
	abstract update(customerProfile: CustomerProfile): Promise<void>;
	abstract delete(customerProfile: CustomerProfile): Promise<void>;
	abstract findById(id: string): Promise<CustomerProfile | null>;
	abstract findByUserId(userId: string): Promise<CustomerProfile | null>;
}
