import { Product } from '@/domains/main/models/entities/product';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Product as PrismaProduct } from '@/generated/prisma/client';

export class ProductMapper {
	static toDomain(data: PrismaProduct): Product {
		return Product.create(
			{
				sku: data.sku,
				slug: data.slug,
				name: data.name,
				shortDescription: data.shortDescription,
				description: data.description,
				imageUrl: data.imageUrl,
				pillsPerPack: data.pillsPerPack,
				status: data.status,
				createdAt: data.createdAt,
				updatedAt: data.updatedAt,
			},
			new UniqueEntityId(data.id)
		);
	}

	static toPrisma(data: Product): PrismaProduct {
		return {
			id: data.id.toString(),
			sku: data.sku,
			slug: data.slug,
			name: data.name,
			shortDescription: data.shortDescription,
			description: data.description ?? null,
			imageUrl: data.imageUrl ?? null,
			pillsPerPack: data.pillsPerPack ?? null,
			status: data.status,
			createdAt: data.createdAt,
			updatedAt: data.updatedAt ?? null,
		};
	}
}
