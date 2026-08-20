import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { OrderItem } from '@/domains/main/models/entities/order-item';
import { Prisma, OrderItem as PrismaOrderItem } from '@/generated/prisma/client';

export class OrderItemMapper {
	static toDomain(data: PrismaOrderItem): OrderItem {
		return OrderItem.create(
			{
				orderId: new UniqueEntityId(data.orderId),
				productId: data.productId ? new UniqueEntityId(data.productId) : null,
				type: data.type,
				name: data.name,
				sku: data.sku,
				quantity: data.quantity,
				unitAmount: data.unitAmount,
				totalAmount: data.totalAmount,
				metadata: data.metadata ? Object(data.metadata) : null,
				createdAt: data.createdAt,
			},
			new UniqueEntityId(data.id)
		);
	}

	static toPrisma(data: OrderItem): PrismaOrderItem {
		return {
			id: data.id.toString(),
			orderId: data.orderId.toString(),
			productId: data.productId ? data.productId.toString() : null,
			type: data.type,
			name: data.name,
			sku: data.sku,
			quantity: data.quantity,
			unitAmount: data.unitAmount,
			totalAmount: data.totalAmount,
			metadata: data.metadata ? (data.metadata as Prisma.JsonObject) : null,
			createdAt: data.createdAt,
		};
	}
}
