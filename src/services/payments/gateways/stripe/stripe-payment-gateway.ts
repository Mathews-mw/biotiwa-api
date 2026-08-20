import type { ICurrencyCode } from '@/core/types/currency-code';

export interface ICreatePaymentGatewayCheckoutSessionInput {
	orderId: string;
	userId: string;
	customerEmail: string;
	amount: number;
	currency: ICurrencyCode;
	items: Array<{ name: string; quantity: number; unitAmount: number; description?: string | null }>;
}

export interface ICreatePaymentGatewayCheckoutSessionOutput {
	provider: 'STRIPE';
	providerSessionId: string;
	providerPaymentIntent: string | null;
	paymentUrl: string;
	rawPayload: unknown;
}

export interface IStripePaymentGateway {
	createCheckoutSession(
		input: ICreatePaymentGatewayCheckoutSessionInput
	): Promise<ICreatePaymentGatewayCheckoutSessionOutput>;
}
