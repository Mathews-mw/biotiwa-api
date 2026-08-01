import { Market } from '@/domains/main/models/entities/market';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Prisma, Market as PrismaMarket } from '@/generated/prisma/client';

export class MarketMapper {
	static toDomain(data: PrismaMarket): Market {
		return Market.create(
			{
				code: data.code,
				label: data.label,
				locale: data.locale,
				currency: data.currency,
				shippingAmount: data.shippingAmount,
				taxRate: parseFloat(data.taxRate.toString()),
				isActive: data.isActive,
				createdAt: data.createdAt,
				updatedAt: data.updatedAt,
			},
			new UniqueEntityId(data.id)
		);
	}

	static toPrisma(data: Market): PrismaMarket {
		return {
			id: data.id.toString(),
			code: data.code,
			label: data.label,
			locale: data.locale,
			currency: data.currency,
			shippingAmount: data.shippingAmount,
			taxRate: Prisma.Decimal(data.taxRate),
			isActive: data.isActive,
			createdAt: data.createdAt,
			updatedAt: data.updatedAt ?? null,
		};
	}
}
