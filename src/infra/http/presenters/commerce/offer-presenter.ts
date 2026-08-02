import { Offer } from '@/domains/main/models/entities/offer';
import { IOfferResponseSchema } from '../../schemas/commerce/offer-schema';

export class OfferPresenter {
	static toHTTP(data: Offer): IOfferResponseSchema {
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
			created_at: data.createdAt,
			updated_at: data.updatedAt,
		};
	}
}
