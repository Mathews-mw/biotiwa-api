import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { OrderBump as PrismaOrderBump } from '@/generated/prisma/client';
import { IPrismaProductDetails, ProductDetailsMapper } from './product-details-mapper';
import { OrderBumpDetails } from '@/domains/main/models/value-objects/order-bump-details';

export type IPrismaOrderBumpDetails = PrismaOrderBump & {
	product: IPrismaProductDetails;
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
			product: ProductDetailsMapper.toDomain(data.product),
		});
	}
}
