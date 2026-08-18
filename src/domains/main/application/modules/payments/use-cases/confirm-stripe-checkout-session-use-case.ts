import { inject, injectable } from 'tsyringe';

import type { IPaymentRepository } from '../repositories/payment-repository';
import type { ICartRepository } from '../../carts/repositories/cart-repository';
import type { IOrderRepository } from '../../checkout/repositories/order-repository';

import { failure, success, type Outcome } from '@/core/outcome';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';

interface IRequest {
	orderId: string;
	providerSessionId: string;
	providerPaymentIntent?: string | null;
	rawPayload?: unknown | null;
}

type Response = Outcome<ResourceNotFoundError, null>;

@injectable()
export class ConfirmStripeCheckoutSessionUseCase {
	constructor(
		@inject(DEPENDENCY_IDENTIFIERS.PAYMENT_REPOSITORY)
		private paymentRepository: IPaymentRepository,
		@inject(DEPENDENCY_IDENTIFIERS.ORDER_REPOSITORY)
		private orderRepository: IOrderRepository,
		@inject(DEPENDENCY_IDENTIFIERS.CARTS_REPOSITORY)
		private cartRepository: ICartRepository
	) {}

	async execute(input: IRequest): Promise<Response> {
		const orderDetails = await this.orderRepository.findById(input.orderId);

		if (!orderDetails) {
			return failure(new ResourceNotFoundError('Order not found', 'ORDER_NOT_FOUND'));
		}

		const payment = await this.paymentRepository.findByProviderSessionId(input.providerSessionId);

		if (!payment) {
			return failure(new ResourceNotFoundError('Payment not found', 'PAYMENT_NOT_FOUND'));
		}

		payment.markAsPaid({
			providerPaymentIntent: input.providerPaymentIntent,
			rawPayload: input.rawPayload,
		});

		await this.paymentRepository.save(payment);

		orderDetails.order.markAsPaid();

		await this.orderRepository.save(orderDetails.order);

		if (orderDetails.cartId) {
			await this.cartRepository.markAsConverted(orderDetails.cartId.toString());
		}

		return success(null);
	}
}
