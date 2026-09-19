import type { ICheckoutShippingSummaryResponseSchema } from '../../schemas/checkout/checkout-shipping-summary-schema';
import type { ICheckoutShippingSummary } from '@/domains/main/application/modules/checkout/services/calculate-checkout-summary';

export class CheckoutShippingSummaryPresenter {
	static toHTTP(data: ICheckoutShippingSummary): ICheckoutShippingSummaryResponseSchema {
		return {
			rate_id: data.rateId,
			provider: data.provider,
			service_name: data.serviceName,
			carrier_name: data.carrierName,
			amount: data.amount,
			estimated_days: data.estimatedDays,
		};
	}
}
