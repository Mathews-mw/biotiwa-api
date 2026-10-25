import { OrderShippingRate } from '@/domains/main/models/entities/order-shipping-rate';
import { IOrderShippingRateResponseSchema } from '../../schemas/order/order-shipping-rate-schema';

export class OrderShippingRatePresenter {
	static toHTTP(data: OrderShippingRate): IOrderShippingRateResponseSchema {
		return {
			id: data.id.toString(),
			order_id: data.orderId.toString(),
			shipping_quote_id: data.shippingQuoteId,
			shipping_quote_rate_id: data.shippingQuoteRateId,
			provider: data.provider,
			service_id: data.serviceId,
			service_name: data.serviceName,
			carrier_name: data.carrierName,
			amount: data.amount,
			currency: data.currency,
			estimated_days: data.estimatedDays,
			created_at: data.createdAt,
			updated_at: data.updatedAt ?? null,
		};
	}
}
