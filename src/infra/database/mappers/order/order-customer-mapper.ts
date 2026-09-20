import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { OrderCustomer } from '@/domains/main/models/entities/order-customer';
import type { OrderCustomer as PrismaOrderCustomer } from '@/generated/prisma/client';

export class OrderCustomerMapper {
	static toDomain(data: PrismaOrderCustomer): OrderCustomer {
		return OrderCustomer.create(
			{
				orderId: new UniqueEntityId(data.orderId),
				name: data.name,
				email: data.email,
				phone: data.phone,
				document: data.document,
				birthDate: data.birthDate,
				createdAt: data.createdAt,
				updatedAt: data.updatedAt,
			},
			new UniqueEntityId(data.id)
		);
	}

	static toPrisma(data: OrderCustomer): PrismaOrderCustomer {
		return {
			id: data.id.toString(),
			orderId: data.orderId.toString(),
			name: data.name,
			email: data.email,
			phone: data.phone ?? null,
			document: data.document ?? null,
			birthDate: data.birthDate ?? null,
			createdAt: data.createdAt,
			updatedAt: data.updatedAt ?? null,
		};
	}
}
