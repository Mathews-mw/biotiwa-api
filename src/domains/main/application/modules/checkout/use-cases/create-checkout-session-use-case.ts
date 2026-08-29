import { inject, injectable } from 'tsyringe';

import type { IOrderRepository } from '../../orders/repositories/order-repository';
import type { ICartRepository } from '../../carts/repositories/cart-repository';
import type { IPaymentService } from '@/services/payments/payment-service.interface';
import type { IPaymentRepository } from '../../payments/repositories/payment-repository';

import { Order } from '@/domains/main/models/entities/order';
import { failure, success, type Outcome } from '@/core/outcome';
import { Payment } from '@/domains/main/models/entities/payment';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { BadRequestError } from '@/core/errors/bad-request-errors';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { createOrderItemsFromCart } from '../helpers/create-order-items-from-cart';
import { calculateCartSummary } from '../../carts/calculators/calculate-cart-summary';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';
import { CheckoutSession } from '@/domains/main/models/value-objects/checkout-session';

interface IRequest {
	userId: string;
}

type Response = Outcome<
	ResourceNotFoundError | BadRequestError,
	{
		checkoutSession: CheckoutSession;
	}
>;

@injectable()
export class CreateCheckoutSessionUseCase {
	constructor(
		@inject(DEPENDENCY_IDENTIFIERS.CARTS_REPOSITORY)
		private cartRepository: ICartRepository,
		@inject(DEPENDENCY_IDENTIFIERS.ORDER_REPOSITORY)
		private orderRepository: IOrderRepository,
		@inject(DEPENDENCY_IDENTIFIERS.PAYMENT_REPOSITORY)
		private paymentsRepository: IPaymentRepository,
		@inject(DEPENDENCY_IDENTIFIERS.PAYMENT_SERVICE)
		private paymentService: IPaymentService
	) {}

	async execute({ userId }: IRequest): Promise<Response> {
		const cart = await this.cartRepository.findActiveByUserId(userId);

		if (!cart) {
			return failure(new ResourceNotFoundError('Active cart not found', 'ACTIVE_CART_NOT_FOUND'));
		}

		if (cart.items.length === 0) {
			return failure(new BadRequestError('Cart is empty', 'EMPTY_CART'));
		}

		const summary = calculateCartSummary(cart);

		if (summary.itemsAmount <= 0) {
			return failure(new BadRequestError('Invalid checkout amount', 'INVALID_CHECKOUT_AMOUNT'));
		}

		let orderDetails = await this.orderRepository.findPendingByCartId(cart.id.toString());

		if (!orderDetails) {
			const order = Order.create({
				userId: new UniqueEntityId(userId),
				cartId: cart.id,
				marketCode: cart.marketCode,
				currency: summary.currency,
				status: 'PENDING_PAYMENT',
				itemsAmount: summary.itemsAmount,
				orderBumpAmount: summary.orderBumpAmount,
				subtotalAmount: summary.subtotalAmount,
				discountAmount: summary.discountAmount,
				taxAmount: summary.taxAmount,
				shippingAmount: summary.shippingAmount,
				totalAmount: summary.totalAmount,
			});

			const orderItems = createOrderItemsFromCart({ orderId: order.id.toString(), cart });

			if (orderItems.length === 0) {
				return failure(new BadRequestError('Cart has no checkout items', 'EMPTY_CART'));
			}

			orderDetails = await this.orderRepository.createWithItems({ order, items: orderItems });
		}

		const existingPendingPayment = await this.paymentsRepository.findPendingByOrderId(orderDetails.id.toString());

		if (existingPendingPayment?.providerCheckoutUrl) {
			return success({
				checkoutSession: CheckoutSession.create({
					order: orderDetails,
					paymentUrl: existingPendingPayment.providerCheckoutUrl,
					paymentProvider: existingPendingPayment.provider,
					providerSessionId: existingPendingPayment.providerSessionId,
					providerPaymentIntent: existingPendingPayment.providerPaymentIntent,
				}),
			});
		}

		const stripePaymentService = this.paymentService.stripe();

		const gatewaySession = await stripePaymentService.createCheckoutSession({
			orderId: orderDetails.id.toString(),
			userId: userId,
			customerEmail: cart.user.email,
			amount: orderDetails.totalAmount,
			currency: orderDetails.currency,
			items: orderDetails.items.map((item) => ({
				name: item.name,
				description: item.product?.description,
				quantity: item.quantity,
				unitAmount: item.unitAmount,
			})),
		});

		const payment = Payment.create({
			orderId: orderDetails.id,
			provider: gatewaySession.provider,
			status: 'PENDING',
			amount: orderDetails.totalAmount,
			currency: orderDetails.currency,
			providerSessionId: gatewaySession.providerSessionId,
			providerPaymentIntent: gatewaySession.providerPaymentIntent,
			providerCheckoutUrl: gatewaySession.paymentUrl,
			rawPayload: gatewaySession.rawPayload,
		});

		await this.paymentsRepository.create(payment);

		const checkoutSession = CheckoutSession.create({
			order: orderDetails,
			paymentUrl: gatewaySession.paymentUrl,
			paymentProvider: gatewaySession.provider,
			providerSessionId: gatewaySession.providerSessionId,
			providerPaymentIntent: gatewaySession.providerPaymentIntent,
		});

		return success({ checkoutSession });
	}
}
