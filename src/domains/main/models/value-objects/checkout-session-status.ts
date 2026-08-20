import { Payment } from '../entities/payment';
import { OrderDetails } from './order-details';
import { ValueObject } from '@/core/entities/value-object';

export interface ICheckoutSessionStatusProps {
	payment: Payment;
	order: OrderDetails;
}

export class CheckoutSessionStatus extends ValueObject<ICheckoutSessionStatusProps> {
	get payment() {
		return this.props.payment;
	}

	get order() {
		return this.props.order;
	}

	get providerSessionId() {
		return this.props.payment.providerSessionId;
	}

	get paymentProvider() {
		return this.props.payment.provider;
	}

	get paymentStatus() {
		return this.props.payment.status;
	}

	get orderId() {
		return this.props.order.id;
	}

	get orderStatus() {
		return this.props.order.status;
	}

	get amount() {
		return this.props.payment.amount;
	}

	get currency() {
		return this.props.payment.currency;
	}

	get createdAt() {
		return this.props.payment.createdAt;
	}

	get updatedAt() {
		return this.props.payment.updatedAt;
	}

	get isPaid() {
		return this.props.payment.status === 'PAID' && this.props.order.status === 'PAID';
	}

	get isPending() {
		return this.props.payment.status === 'PENDING';
	}

	get isFailed() {
		return this.props.payment.status === 'FAILED';
	}

	get isExpired() {
		return this.props.payment.status === 'EXPIRED';
	}

	static create(props: ICheckoutSessionStatusProps) {
		return new CheckoutSessionStatus(props);
	}
}
