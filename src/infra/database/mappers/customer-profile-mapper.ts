import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { CustomerProfile } from '@/domains/main/models/entities/customer-profile';
import { CustomerProfile as PrismaCustomerProfile } from '@/generated/prisma/client';

export class CustomerProfileMapper {
	static toDomain(data: PrismaCustomerProfile): CustomerProfile {
		return CustomerProfile.create(
			{
				userId: new UniqueEntityId(data.userId),
				preferredMarket: data.preferredMarket,
				phone: data.phone,
				birthDate: data.birthDate,
				createdAt: data.createdAt,
				updatedAt: data.updatedAt,
			},
			new UniqueEntityId(data.id)
		);
	}

	static toPrisma(data: CustomerProfile): PrismaCustomerProfile {
		return {
			id: data.id.toString(),
			userId: data.userId.toString(),
			preferredMarket: data.preferredMarket ?? null,
			phone: data.phone ?? null,
			birthDate: data.birthDate ?? null,
			createdAt: data.createdAt,
			updatedAt: data.updatedAt ?? null,
		};
	}
}
