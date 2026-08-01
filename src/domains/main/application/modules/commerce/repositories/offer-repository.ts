import { Offer } from '@/domains/main/models/entities/offer';

export interface IOfferRepository {
	create(offer: Offer): Promise<void>;
	update(offer: Offer): Promise<void>;
	delete(offer: Offer): Promise<void>;
	findMany(): Promise<Offer[]>;
	findById(id: string): Promise<Offer | null>;
}
