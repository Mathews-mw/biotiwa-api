import { ProductMapper } from './product-mapper';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ProductShippingProfileMapper } from './product-shipping-profile-mapper';
import { ProductDetails } from '@/domains/main/models/value-objects/product-details';

import type {
	Product as PrismaProduct,
	ProductShippingProfile as PrismaProductShippingProfile,
} from '@/generated/prisma/client';

export type IPrismaProductDetails = PrismaProduct & {
	productShippingProfile?: PrismaProductShippingProfile | null;
};

export class ProductDetailsMapper {
	static toDomain(data: IPrismaProductDetails): ProductDetails {
		return ProductDetails.create({
			id: new UniqueEntityId(data.id),
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
			productShippingProfile: data.productShippingProfile
				? ProductShippingProfileMapper.toDomain(data.productShippingProfile)
				: null,
			product: ProductMapper.toDomain(data),
		});
	}
}
