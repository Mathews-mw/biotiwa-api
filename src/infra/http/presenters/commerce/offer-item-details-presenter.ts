import { ProductPresenter } from './product-presenter';
import { OfferItemDetails } from '@/domains/main/models/value-objects/offer-item-details';
import { IOfferItemDetailsResponseSchema } from '../../schemas/commerce/offer-item-details-schema';

export class OfferItemDetailsPresenter {
	static toHTTP(data: OfferItemDetails): IOfferItemDetailsResponseSchema {
		return {
			id: data.id.toString(),
			offer_id: data.offerId.toString(),
			product_id: data.productId.toString(),
			quantity: data.quantity,
			product: ProductPresenter.toHTTP(data.product),
			created_at: data.createdAt,
		};
	}
}
