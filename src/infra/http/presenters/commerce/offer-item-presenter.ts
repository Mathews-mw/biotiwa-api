import { OfferItem } from '@/domains/main/models/entities/offer-item';
import { IOfferItemResponseSchema } from '../../schemas/commerce/offer-item-schema';

export class OfferItemPresenter {
	static toHTTP(data: OfferItem): IOfferItemResponseSchema {
		return {
			id: data.id.toString(),
			offer_id: data.offerId.toString(),
			product_id: data.productId.toString(),
			quantity: data.quantity,
			created_at: data.createdAt,
		};
	}
}
