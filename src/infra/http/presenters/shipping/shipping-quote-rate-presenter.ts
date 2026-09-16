import { ShippingQuoteRate } from '@/domains/main/models/entities/shipping-quote-rate';
import type { IShippingQuoteRateResponseSchema } from '../../schemas/shipping/shipping-quote-rate.schema';

export class ShippingQuoteRatePresenter {
	static toHTTP(data: ShippingQuoteRate): IShippingQuoteRateResponseSchema {
		return {
			id: data.id.toString(),
			shipping_quote_id: data.shippingQuoteId.toString(),
			provider: data.provider,
			service_id: data.serviceId,
			service_name: data.serviceName,
			carrier_name: data.carrierName,
			amount: data.amount,
			currency: data.currency,
			estimated_days: data.estimatedDays,
			created_at: data.createdAt,
		};
	}
}
