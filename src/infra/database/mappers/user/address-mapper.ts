import { Address } from '@/domains/main/models/entities/address';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Address as PrismaAddress } from '@/generated/prisma/client';

export class AddressMapper {
	static toDomain(data: PrismaAddress): Address {
		return Address.create(
			{
				userId: new UniqueEntityId(data.userId),
				market: data.market,
				label: data.label,
				recipient: data.recipient,
				postalCode: data.postalCode,
				addressLine1: data.addressLine1,
				number: data.number,
				addressLine2: data.addressLine2,
				district: data.district,
				city: data.city,
				state: data.state,
				country: data.country,
				isDefault: data.isDefault,
				createdAt: data.createdAt,
				updatedAt: data.updatedAt,
			},
			new UniqueEntityId(data.id)
		);
	}

	static toPrisma(data: Address): PrismaAddress {
		return {
			id: data.id.toString(),
			userId: data.userId.toString(),
			market: data.market,
			label: data.label ?? null,
			recipient: data.recipient ?? null,
			postalCode: data.postalCode,
			addressLine1: data.addressLine1,
			number: data.number ?? null,
			addressLine2: data.addressLine2 ?? null,
			district: data.district ?? null,
			city: data.city,
			state: data.state,
			country: data.country,
			isDefault: data.isDefault,
			createdAt: data.createdAt,
			updatedAt: data.updatedAt ?? null,
		};
	}
}
