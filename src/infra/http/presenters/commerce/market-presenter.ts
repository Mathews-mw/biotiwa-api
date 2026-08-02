import { Market } from '@/domains/main/models/entities/market';
import { IMarketResponseSchema } from '../../schemas/commerce/market-schema';

export class MarketPresenter {
	static toHTTP(data: Market): IMarketResponseSchema {
		return {
			id: data.id.toString(),
			code: data.code,
			label: data.label,
			locale: data.locale,
			currency: data.currency,
			shipping_amount: data.shippingAmount,
			tax_rate: data.taxRate,
			is_active: data.isActive,
			created_at: data.createdAt,
			updated_at: data.updatedAt,
		};
	}
}
