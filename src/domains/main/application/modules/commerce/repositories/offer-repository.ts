import { IMarketCode } from '@/core/types/market-code';
import { IOfferStatus, Offer } from '@/domains/main/models/entities/offer';

export interface IFindManyParams {
	marketCode?: IMarketCode;
	status?: IOfferStatus;
}

export interface IOfferRepository {
	create(offer: Offer): Promise<void>;
	update(offer: Offer): Promise<void>;
	delete(offer: Offer): Promise<void>;
	findMany(params?: IFindManyParams): Promise<Offer[]>;
	findById(id: string): Promise<Offer | null>;
	findBySlug(slug: string): Promise<Offer | null>;
}
