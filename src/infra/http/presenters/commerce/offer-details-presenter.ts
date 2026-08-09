import { OfferItemDetailsPresenter } from './offer-item-details-presenter';
import { OfferDetails } from '@/domains/main/models/value-objects/offer-details';
import { IOfferDetailsResponseSchema } from '../../schemas/commerce/offer-details-schema';

export class OfferDetailsPresenter {
	static toHTTP(data: OfferDetails): IOfferDetailsResponseSchema {
		return {
			id: data.id.toString(),
			slug: data.slug,
			market_code: data.marketCode,
			name: data.name,
			description: data.description,
			unit_amount: data.unitAmount,
			discount_percent: data.discountPercent,
			is_highlighted: data.isHighlighted,
			status: data.status,
			sort_order: data.sortOrder,
			items: data.items.map(OfferItemDetailsPresenter.toHTTP),
			created_at: data.createdAt,
			updated_at: data.updatedAt,
		};
	}
}
