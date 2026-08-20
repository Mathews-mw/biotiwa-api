import { inject, injectable } from 'tsyringe';

import type { IOrderRepository } from '../repositories/order-repository';
import type { IPaymentRepository } from '../../payments/repositories/payment-repository';

import { failure, success, type Outcome } from '@/core/outcome';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';
import { CheckoutSessionStatus } from '@/domains/main/models/value-objects/checkout-session-status';

interface IRequest {
	userId: UniqueEntityId;
	providerSessionId: string;
}

type Response = Outcome<
	ResourceNotFoundError,
	{
		checkoutSessionStatus: CheckoutSessionStatus;
	}
>;

@injectable()
export class GetCheckoutSessionStatusUseCase {
	constructor(
		@inject(DEPENDENCY_IDENTIFIERS.PAYMENT_REPOSITORY)
		private paymentRepository: IPaymentRepository,

		@inject(DEPENDENCY_IDENTIFIERS.ORDER_REPOSITORY)
		private orderRepository: IOrderRepository
	) {}

	async execute({ userId, providerSessionId }: IRequest): Promise<Response> {
		const payment = await this.paymentRepository.findByProviderSessionId(providerSessionId);

		if (!payment) {
			return failure(new ResourceNotFoundError('Checkout session not found', 'CHECKOUT_SESSION_NOT_FOUND'));
		}

		const orderDetails = await this.orderRepository.findById(payment.orderId.toString());

		if (!orderDetails) {
			return failure(new ResourceNotFoundError('Order not found', 'ORDER_NOT_FOUND'));
		}

		const orderUserId = orderDetails.userId.toString();
		const authenticatedUserId = userId.toString();

		if (orderUserId !== authenticatedUserId) {
			return failure(new ResourceNotFoundError('Checkout session not found', 'CHECKOUT_SESSION_NOT_FOUND'));
		}

		const checkoutSessionStatus = CheckoutSessionStatus.create({
			payment,
			order: orderDetails,
		});

		return success({
			checkoutSessionStatus,
		});
	}
}
