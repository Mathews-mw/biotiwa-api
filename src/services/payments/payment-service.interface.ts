import { StripePaymentService } from './gateways/stripe/stripe-payment-service';

export interface IPaymentService {
	stripe(): StripePaymentService;
}
