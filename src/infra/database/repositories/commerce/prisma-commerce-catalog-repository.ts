import { prisma } from '../../prisma';
import { Market } from '@/domains/main/models/entities/market';
import { Product } from '@/domains/main/models/entities/product';
import { MarketMapper } from '../../mappers/commerce/market-mapper';
import { ProductMapper } from '../../mappers/commerce/product-mapper';
import { OrderBumpMapper } from '../../mappers/commerce/order-bump-mapper';
import { OfferDetailsMapper } from '../../mappers/commerce/offer-details-mapper';

import type { IMarketCode } from '@/core/types/market-code';
import type { ICommerceCatalogRepository } from '@/domains/main/application/modules/commerce/repositories/commerce-catalog-repository';

export class PrismaCommerceCatalogRepository implements ICommerceCatalogRepository {
	async getPublicOffersByMarket(code: IMarketCode) {
		const market = await prisma.market.findUnique({
			where: {
				code,
			},
		});

		if (!market || !market.isActive) {
			return null;
		}

		const offers = await prisma.offer.findMany({
			where: {
				marketCode: code,
				status: 'ACTIVE',
			},
			include: {
				items: {
					include: {
						product: true,
					},
				},
			},
			orderBy: {
				sortOrder: 'asc',
			},
		});

		if (offers.length === 0) {
			return null;
		}

		const firstProduct = offers[0]?.items[0]?.product;

		if (!firstProduct) {
			return null;
		}

		const orderBump = await prisma.orderBump.findFirst({
			where: {
				marketCode: code,
				isActive: true,
			},
			include: {
				product: true,
			},
			orderBy: {
				sortOrder: 'asc',
			},
		});

		return {
			market: MarketMapper.toDomain(market),
			product: ProductMapper.toDomain(firstProduct),
			offers: offers.map(OfferDetailsMapper.toDomain),
			orderBump: orderBump ? OrderBumpMapper.toDomain(orderBump) : null,
		};
	}

	async listActiveMarkets(): Promise<Market[]> {
		throw new Error('Method not implemented.');
	}
	async findActiveMarketByCode(code: IMarketCode): Promise<Market | null> {
		throw new Error('Method not implemented.');
	}
	async findProductBySlug(slug: string): Promise<Product | null> {
		throw new Error('Method not implemented.');
	}
}
