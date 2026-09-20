import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ProductShippingProfile } from '@/domains/main/models/entities/product-shipping-profile';
import { ProductShippingProfile as PrismaProductShippingProfile } from '@/generated/prisma/client';

export class ProductShippingProfileMapper {
	static toDomain(data: PrismaProductShippingProfile): ProductShippingProfile {
		return ProductShippingProfile.create(
			{
				productId: new UniqueEntityId(data.productId),
				isShippable: data.isShippable,
				weightInGrams: data.weightInGrams,
				widthInMillimeters: data.widthInMillimeters,
				heightInMillimeters: data.heightInMillimeters,
				lengthInMillimeters: data.lengthInMillimeters,
				insuranceAmount: data.insuranceAmount,
				createdAt: data.createdAt,
				updatedAt: data.updatedAt,
			},
			new UniqueEntityId(data.id)
		);
	}

	static toPrisma(data: ProductShippingProfile): PrismaProductShippingProfile {
		return {
			id: data.id.toString(),
			productId: data.productId.toString(),
			isShippable: data.isShippable,
			weightInGrams: data.weightInGrams,
			widthInMillimeters: data.widthInMillimeters,
			heightInMillimeters: data.heightInMillimeters,
			lengthInMillimeters: data.lengthInMillimeters,
			insuranceAmount: data.insuranceAmount ?? null,
			createdAt: data.createdAt,
			updatedAt: data.updatedAt ?? null,
		};
	}
}
