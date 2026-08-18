import { IPaymentService } from './payment-service.interface';
import { StripePaymentService } from './gateways/stripe/stripe-payment-service';

export class PaymentService implements IPaymentService {
	stripe() {
		const service = new StripePaymentService();

		return service;
	}
}
