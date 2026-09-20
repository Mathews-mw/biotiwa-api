import { Payment } from '@/domains/main/models/entities/payment';
import type { IPaymentResponseSchema } from '../../schemas/payment/payment-schema';

export class PaymentPresenter {
	static toHTTP(data: Payment): IPaymentResponseSchema {
		return {
			id: data.id.toString(),
			order_id: data.orderId.toString(),
			provider: data.provider,
			status: data.status,
			amount: data.amount,
			currency: data.currency,
			payment_type: data.paymentType,
			provider_session_id: data.providerSessionId,
			provider_payment_intent: data.providerPaymentIntent,
			provider_checkout_url: data.providerCheckoutUrl,
			// raw_payload: data.rawPayload,
			created_at: data.createdAt,
			updated_at: data.updatedAt ?? null,
		};
	}
}
