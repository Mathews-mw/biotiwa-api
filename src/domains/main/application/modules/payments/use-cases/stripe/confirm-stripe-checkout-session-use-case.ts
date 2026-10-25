import { inject, injectable } from 'tsyringe';

import type { IPaymentRepository } from '../../repositories/payment-repository';
import type { ICartRepository } from '../../../carts/repositories/cart-repository';
import type { IOrderRepository } from '../../../orders/repositories/order-repository';

import { failure, success, type Outcome } from '@/core/outcome';
import { BadRequestError } from '@/core/errors/bad-request-errors';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';
import { EnqueueBlingOrderSyncUseCase } from '../../../integrations/bling/use-cases/enqueue-bling-order-sync-use-case';
import { PromotionRedemptionLifecycleService } from '../../../promotions/services/promotion-redemption-lifecycle-service';
import { CreateAffiliateCommissionForOrderUseCase } from '../../../affiliates/use-cases/create-affiliate-commission-for-order-use-case';

interface IRequest {
	orderId: string;
	providerSessionId: string;
	providerPaymentIntent?: string | null;
	rawPayload?: unknown | null;
}

type Response = Outcome<ResourceNotFoundError | BadRequestError, null>;

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
		private enqueueBlingOrderSyncUseCase: EnqueueBlingOrderSyncUseCase,
		@inject(DEPENDENCY_IDENTIFIERS.PROMOTION_REDEMPTION_LIFECYCLE_SERVICE)
		private promotionRedemptionLifecycleService: PromotionRedemptionLifecycleService,
		@inject(DEPENDENCY_IDENTIFIERS.CREATE_AFFILIATE_COMMISSION_FOR_ORDER_USE_CASE)
		private createAffiliateCommissionForOrderUseCase: CreateAffiliateCommissionForOrderUseCase
	) {}

	async execute(input: IRequest): Promise<Response> {
		console.log('Confirm payment input: ', input);

		const orderDetails = await this.orderRepository.findById(input.orderId);

		console.log('Confirm payment orderDetails: ', orderDetails);

		if (!orderDetails) {
			return failure(new ResourceNotFoundError('Order not found', 'ORDER_NOT_FOUND'));
		}

		const payment = await this.paymentRepository.findByProviderSessionId(input.providerSessionId);

		console.log('Confirm payment payment: ', payment);

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

		await this.promotionRedemptionLifecycleService.redeem(orderDetails.id.toString());

		// Quando o pagamento for confirmado, o use case deve criar a pendência de sync com o Bling
		await this.enqueueBlingOrderSyncUseCase.execute({
			orderId: orderDetails.id.toString(),
		});

		const commissionResult = await this.createAffiliateCommissionForOrderUseCase.execute({
			order: orderDetails,
		});

		console.log('commissionResult: ', commissionResult.value);

		if (commissionResult.isFalse()) {
			console.log('ERROR WHILE TRYING TO CREATE A COMMISSION FOR AN AFFILIATE: ', commissionResult.value);
			return failure(commissionResult.value);
		}

		return success(null);
	}
}
