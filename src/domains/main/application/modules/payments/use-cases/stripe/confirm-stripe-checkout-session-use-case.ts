import { inject, injectable } from 'tsyringe';

import type { IPaymentRepository } from '../../repositories/payment-repository';
import type { ICartRepository } from '../../../carts/repositories/cart-repository';
import type { IOrderRepository } from '../../../orders/repositories/order-repository';

import { failure, success, type Outcome } from '@/core/outcome';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';
import { EnqueueBlingOrderSyncUseCase } from '../../../integrations/bling/use-cases/enqueue-bling-order-sync-use-case';

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
		private cartRepository: ICartRepository,
		@inject(DEPENDENCY_IDENTIFIERS.ENQUEUE_BLING_ORDER_SYNC_USE_CASE)
		private enqueueBlingOrderSyncUseCase: EnqueueBlingOrderSyncUseCase
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

		// Quando o pagamento for confirmado, o use case deve criar a pendência de sync com o Bling
		await this.enqueueBlingOrderSyncUseCase.execute({
			orderId: orderDetails.id.toString(),
		});

		return success(null);
	}
}
