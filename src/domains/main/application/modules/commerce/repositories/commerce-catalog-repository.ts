import type { IMarketCode } from '@/core/types/market-code';

import { Market } from '@/domains/main/models/entities/market';
import { Product } from '@/domains/main/models/entities/product';
import { OrderBump } from '@/domains/main/models/entities/order-bump';
import { OfferWithItems } from '@/domains/main/models/value-objects/offer-with-item';

export abstract class ICommerceCatalogRepository {
	abstract listActiveMarkets(): Promise<Market[]>;
	abstract findActiveMarketByCode(code: IMarketCode): Promise<Market | null>;
	abstract getPublicOffersByMarket(code: IMarketCode): Promise<{
		market: Market;
		product: Product;
		offers: OfferWithItems[];
		orderBump: OrderBump | null;
	} | null>;
	abstract findProductBySlug(slug: string): Promise<Product | null>;
}
