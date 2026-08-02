import { prisma } from '../../prisma';
import { MarketMapper } from '../../mappers/market-mapper';
import { ProductMapper } from '../../mappers/product-mapper';
import { Market } from '@/domains/main/models/entities/market';
import { Product } from '@/domains/main/models/entities/product';
import { OrderBumpMapper } from '../../mappers/order-bump-mapper';

import type { IMarketCode } from '@/core/types/market-code';
import type { ICommerceCatalogRepository } from '@/domains/main/application/modules/commerce/repositories/commerce-catalog-repository';
import { OfferWithItemsMapper } from '../../mappers/offer-with-items-mapper';

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
			offers: offers.map(OfferWithItemsMapper.toDomain),
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
