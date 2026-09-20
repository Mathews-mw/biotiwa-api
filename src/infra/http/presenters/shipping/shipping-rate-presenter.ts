import { IShippingRate } from '@/services/shipping/repositories/shipping-service';
import { IShippingRateResponseSchema } from '../../schemas/shipping/shipping-rate-schema';

export class ShippingRatePresenter {
	static toHTTP(data: IShippingRate): IShippingRateResponseSchema {
		return {
			provider: data.provider,
			service_id: data.serviceId,
			service_name: data.serviceName,
			carrier_name: data.carrierName,
			amount: data.amount,
			currency: data.currency,
			estimated_days: data.estimatedDays,
			company_picture: data.companyPicture,
		};
	}
}
