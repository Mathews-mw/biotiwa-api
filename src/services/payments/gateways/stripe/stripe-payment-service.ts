import type {
	ICreatePaymentGatewayCheckoutSessionInput,
	ICreatePaymentGatewayCheckoutSessionOutput,
	IStripePaymentGateway,
} from './stripe-payment-gateway';

import { env } from '@/env';
import { stripe } from './stripe';

export class StripePaymentService implements IStripePaymentGateway {
	async createCheckoutSession(
		input: ICreatePaymentGatewayCheckoutSessionInput
	): Promise<ICreatePaymentGatewayCheckoutSessionOutput> {
		const session = await stripe.checkout.sessions.create(
			{
				mode: 'payment',
				customer_email: input.customerEmail,
				line_items: input.items.map((item) => ({
					quantity: item.quantity,
					price_data: {
						currency: input.currency.toLowerCase(),
						unit_amount: item.unitAmount,
						product_data: {
							name: item.name,
							description: item.description ?? undefined,
						},
					},
				})),
				success_url: env.STRIPE_SUCCESS_URL,
				cancel_url: env.STRIPE_CANCEL_URL,
				metadata: {
					order_id: input.orderId,
					user_id: input.userId,
				},
			},
			{ idempotencyKey: `checkout-session:${input.orderId}` }
		);

		if (!session.url) {
			throw new Error('Stripe checkout session URL was not generated.');
		}

		return {
			provider: 'STRIPE',
			providerSessionId: session.id,
			providerPaymentIntent: typeof session.payment_intent === 'string' ? session.payment_intent : null,
			paymentUrl: session.url,
			rawPayload: session,
		};
	}
}
