import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { OrderShippingAddress } from '@/domains/main/models/entities/order-shipping-address';
import type { OrderShippingAddress as PrismaOrderShippingAddress } from '@/generated/prisma/client';

export class OrderShippingAddressMapper {
	static toDomain(data: PrismaOrderShippingAddress): OrderShippingAddress {
		return OrderShippingAddress.create(
			{
				orderId: new UniqueEntityId(data.orderId),
				zipCode: data.zipCode,
				street: data.street,
				number: data.number,
				complement: data.complement,
				district: data.district,
				city: data.city,
				state: data.state,
				countryCode: data.countryCode,
				createdAt: data.createdAt,
				updatedAt: data.updatedAt,
			},
			new UniqueEntityId(data.id)
		);
	}

	static toPrisma(data: OrderShippingAddress): PrismaOrderShippingAddress {
		return {
			id: data.id.toString(),
			orderId: data.orderId.toString(),
			zipCode: data.zipCode,
			street: data.street,
			number: data.number ?? null,
			complement: data.complement ?? null,
			district: data.district ?? null,
			city: data.city,
			state: data.state,
			countryCode: data.countryCode,
			createdAt: data.createdAt,
			updatedAt: data.updatedAt ?? null,
		};
	}
}
