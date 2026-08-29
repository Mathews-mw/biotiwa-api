import { OrderItemMapper } from './order-item-mapper';
import { ProductMapper } from '../commerce/product-mapper';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { OrderItemDetails } from '@/domains/main/models/value-objects/order-item-details';
import { OrderItem as PrismaOrderItem, Product as PrismaProduct } from '@/generated/prisma/client';

export type IPrismaOrderItemDetails = PrismaOrderItem & {
	product?: PrismaProduct | null;
};

export class OrderItemDetailsMapper {
	static toDomain(data: IPrismaOrderItemDetails): OrderItemDetails {
		return OrderItemDetails.create({
			id: new UniqueEntityId(data.id),
			orderId: new UniqueEntityId(data.orderId),
			productId: data.productId ? new UniqueEntityId(data.productId) : null,
			type: data.type,
			name: data.name,
			sku: data.sku,
			quantity: data.quantity,
			unitAmount: data.unitAmount,
			totalAmount: data.totalAmount,
			product: data.product ? ProductMapper.toDomain(data.product) : null,
			orderItem: OrderItemMapper.toDomain(data),
			metadata: data.metadata ? Object(data.metadata) : null,
			createdAt: data.createdAt,
		});
	}
}
