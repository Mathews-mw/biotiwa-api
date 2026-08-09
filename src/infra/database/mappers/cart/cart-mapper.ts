import { Cart } from '@/domains/main/models/entities/cart';
import { Cart as PrismaCart } from '@/generated/prisma/client';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export class CartMapper {
	static toDomain(data: PrismaCart): Cart {
		return Cart.create(
			{
				userId: new UniqueEntityId(data.userId),
				marketCode: data.marketCode,
				status: data.status,
				createdAt: data.createdAt,
				updatedAt: data.updatedAt,
			},
			new UniqueEntityId(data.id)
		);
	}

	static toPrisma(data: Cart): PrismaCart {
		return {
			id: data.id.toString(),
			userId: data.userId.toString(),
			marketCode: data.marketCode,
			status: data.status,
			createdAt: data.createdAt,
			updatedAt: data.updatedAt ?? null,
		};
	}
}
