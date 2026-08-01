import { OfferItem } from '@/domains/main/models/entities/offer-item';

export interface IOfferItemRepository {
	create(offerItem: OfferItem): Promise<void>;
	update(offerItem: OfferItem): Promise<void>;
	delete(offerItem: OfferItem): Promise<void>;
	findMany(): Promise<OfferItem[]>;
	findById(id: string): Promise<OfferItem | null>;
}
