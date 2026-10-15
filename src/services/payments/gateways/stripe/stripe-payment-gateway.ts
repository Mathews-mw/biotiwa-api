import { BadRequestError } from '@/core/errors/bad-request-errors';
import { Outcome } from '@/core/outcome';
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

type Response = Outcome<BadRequestError, ICreatePaymentGatewayCheckoutSessionOutput>;

export interface IStripePaymentGateway {
	createCheckoutSession(input: ICreatePaymentGatewayCheckoutSessionInput): Promise<Response>;
}
