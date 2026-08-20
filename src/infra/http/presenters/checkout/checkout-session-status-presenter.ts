import { OrderDetailsPresenter } from './order-details-presenter';
import { CheckoutSessionStatus } from '@/domains/main/models/value-objects/checkout-session-status';
import type { ICheckoutSessionStatusResponseSchema } from '../../schemas/checkout/checkout-session-status-schema';

export class CheckoutSessionStatusPresenter {
	static toHTTP(data: CheckoutSessionStatus): ICheckoutSessionStatusResponseSchema {
		return {
			provider_session_id: data.providerSessionId,
			payment_provider: data.paymentProvider,
			payment_status: data.paymentStatus,
			order_id: data.orderId.toString(),
			order_status: data.orderStatus,
			amount: data.amount,
			currency: data.currency,
			is_paid: data.isPaid,
			is_pending: data.isPending,
			is_failed: data.isFailed,
			is_expired: data.isExpired,
			created_at: data.createdAt,
			updated_at: data.updatedAt ?? null,
			order: OrderDetailsPresenter.toHTTP(data.order),
		};
	}
}
