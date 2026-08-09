import { ProductMapper } from './product-mapper';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { OrderBumpDetails } from '@/domains/main/models/value-objects/order-bump-details';
import { OrderBump as PrismaOrderBump, Product as PrismaProduct } from '@/generated/prisma/client';

export type IPrismaOrderBumpDetails = PrismaOrderBump & {
	product: PrismaProduct;
};

export class OrderBumpDetailsMapper {
	static toDomain(data: IPrismaOrderBumpDetails): OrderBumpDetails {
		return OrderBumpDetails.create({
			id: new UniqueEntityId(data.id),
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
			product: ProductMapper.toDomain(data.product),
		});
	}
}
