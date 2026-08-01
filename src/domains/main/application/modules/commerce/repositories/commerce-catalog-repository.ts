import type { IMarketCode } from '@/core/types/market-code';

import { Offer } from '@/domains/main/models/entities/offer';
import { Market } from '@/domains/main/models/entities/market';
import { Product } from '@/domains/main/models/entities/product';
import { OrderBump } from '@/domains/main/models/entities/order-bump';

export interface ICommerceCatalogRepository {
	listActiveMarkets(): Promise<Market[]>;
	findActiveMarketByCode(code: IMarketCode): Promise<Market | null>;
	getPublicOffersByMarket(code: IMarketCode): Promise<{
		market: Market;
		product: Product;
		offers: Offer[];
		orderBump: OrderBump | null;
	} | null>;
	findProductBySlug(slug: string): Promise<Product | null>;
}
