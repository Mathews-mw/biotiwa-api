import z from 'zod';

import { OrderDetails } from './order-details';
import { ValueObject } from '@/core/entities/value-object';

export const paymentProviderSchema = z.enum(['STRIPE']);

type IPaymentProvider = z.infer<typeof paymentProviderSchema>;

export interface ICheckoutSessionProps {
	order: OrderDetails;
	paymentUrl?: string | null;
	paymentProvider?: IPaymentProvider | null;
	providerSessionId?: string | null;
	providerPaymentIntent?: string | null;
	createdAt: Date;
}

export class CheckoutSession extends ValueObject<ICheckoutSessionProps> {
	get order() {
		return this.props.order;
	}

	get orderId() {
		return this.props.order.id;
	}

	get status() {
		return this.props.order.status;
	}

	get amount() {
		return this.props.order.totalAmount;
	}

	get currency() {
		return this.props.order.currency;
	}

	get paymentUrl() {
		return this.props.paymentUrl;
	}

	get paymentProvider() {
		return this.props.paymentProvider;
	}

	get providerSessionId() {
		return this.props.providerSessionId;
	}

	get providerPaymentIntent() {
		return this.props.providerPaymentIntent;
	}

	get createdAt() {
		return this.props.createdAt;
	}

	static create(props: Omit<ICheckoutSessionProps, 'createdAt'>) {
		const checkoutSession = new CheckoutSession({
			...props,
			createdAt: new Date(),
		});

		return checkoutSession;
	}
}
