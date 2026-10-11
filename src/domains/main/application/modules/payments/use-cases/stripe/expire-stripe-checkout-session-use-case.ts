import { inject, injectable } from 'tsyringe';

import type { IPaymentRepository } from '../../repositories/payment-repository';
import type { IOrderRepository } from '../../../orders/repositories/order-repository';

import { failure, success, type Outcome } from '@/core/outcome';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';
import { IPromotionRedemptionRepository } from '../../../promotions/repositories/promotion-redemption-repository';

interface IRequest {
	orderId: string;
	providerSessionId: string;
	rawPayload?: unknown | null;
}

type Response = Outcome<ResourceNotFoundError, null>;

@injectable()
export class ExpireStripeCheckoutSessionUseCase {
	constructor(
		@inject(DEPENDENCY_IDENTIFIERS.PAYMENT_REPOSITORY)
		private paymentRepository: IPaymentRepository,
		@inject(DEPENDENCY_IDENTIFIERS.ORDER_REPOSITORY)
		private orderRepository: IOrderRepository,
		@inject(DEPENDENCY_IDENTIFIERS.PROMOTION_REDEMPTION_REPOSITORY)
		private promotionRedemptionRepository: IPromotionRedemptionRepository
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

		payment.markAsExpired({
			rawPayload: input.rawPayload,
		});

		await this.paymentRepository.save(payment);

		orderDetails.order.markAsExpired();

		await this.orderRepository.save(orderDetails.order);

		const redemption = await this.promotionRedemptionRepository.findByOrderId(orderDetails.id.toString());

		if (redemption) {
			redemption.markAsExpired();

			await this.promotionRedemptionRepository.save(redemption);
		}

		return success(null);
	}
}
