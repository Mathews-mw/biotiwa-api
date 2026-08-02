import { OfferItemPresenter } from './offer-item-presenter';
import { OfferWithItems } from '@/domains/main/models/value-objects/offer-with-item';
import { IOfferWithItemsResponseSchema } from '../../schemas/commerce/offer-with-items-schema';

export class OfferWithItemsPresenter {
	static toHTTP(data: OfferWithItems): IOfferWithItemsResponseSchema {
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
			items: data.items.map(OfferItemPresenter.toHTTP),
			created_at: data.createdAt,
			updated_at: data.updatedAt,
		};
	}
}
