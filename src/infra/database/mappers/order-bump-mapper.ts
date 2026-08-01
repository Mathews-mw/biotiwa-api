import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { OrderBump } from '@/domains/main/models/entities/order-bump';
import { OrderBump as PrismaOrderBump } from '@/generated/prisma/client';

export class OrderBumpMapper {
	static toDomain(data: PrismaOrderBump): OrderBump {
		return OrderBump.create(
			{
				productId: new UniqueEntityId(data.productId),
				marketCode: data.marketCode,
				name: data.name,
				description: data.description,
				unitAmount: data.unitAmount,
				quantity: data.quantity,
				isActive: data.isActive,
				sortOrder: data.sortOrder,
				createdAt: data.createdAt,
				updatedAt: data.updatedAt,
			},
			new UniqueEntityId(data.id)
		);
	}

	static toPrisma(data: OrderBump): PrismaOrderBump {
		return {
			id: data.id.toString(),
			productId: data.id.toString(),
			marketCode: data.marketCode,
			name: data.name,
			description: data.description,
			unitAmount: data.unitAmount,
			quantity: data.quantity,
			isActive: data.isActive,
			sortOrder: data.sortOrder,
			createdAt: data.createdAt,
			updatedAt: data.updatedAt ?? null,
		};
	}
}
