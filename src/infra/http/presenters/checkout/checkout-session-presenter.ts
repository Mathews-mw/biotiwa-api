import { OrderDetailsPresenter } from './order-details-presenter';
import { CheckoutSession } from '@/domains/main/models/value-objects/checkout-session';
import { ICheckoutSessionResponseSchema } from '../../schemas/checkout/checkout-session-schema';

export class CheckoutSessionPresenter {
	static toHTTP(data: CheckoutSession): ICheckoutSessionResponseSchema {
		return {
			order_id: data.orderId.toString(),
			status: data.status,
			amount: data.amount,
			currency: data.currency,
			payment_url: data.paymentUrl ?? null,
			payment_provider: data.paymentProvider ?? null,
			provider_session_id: data.providerSessionId ?? null,
			provider_payment_intent: data.providerPaymentIntent ?? null,
			created_at: data.createdAt,
			order: OrderDetailsPresenter.toHTTP(data.order),
		};
	}
}
