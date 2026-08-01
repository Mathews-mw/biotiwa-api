import { Market } from '@/domains/main/models/entities/market';

export interface IMarketRepository {
	create(market: Market): Promise<void>;
	update(market: Market): Promise<void>;
	delete(market: Market): Promise<void>;
	findMany(): Promise<Market[]>;
	findById(id: string): Promise<Market | null>;
}
