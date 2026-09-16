import { inject, injectable } from 'tsyringe';

import type { ICartRepository } from '../../carts/repositories/cart-repository';
import type { IOrderRepository } from '../../orders/repositories/order-repository';
import type { IPaymentService } from '@/services/payments/payment-service.interface';
import type { IPaymentRepository } from '../../payments/repositories/payment-repository';

import { Order } from '@/domains/main/models/entities/order';
import { failure, success, type Outcome } from '@/core/outcome';
import { Payment } from '@/domains/main/models/entities/payment';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { BadRequestError } from '@/core/errors/bad-request-errors';
import { OrderCustomer } from '@/domains/main/models/entities/order-customer';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { createOrderItemsFromCart } from '../helpers/create-order-items-from-cart';
import { calculateCartSummary } from '../../carts/calculators/calculate-cart-summary';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';
import { CheckoutSession } from '@/domains/main/models/value-objects/checkout-session';
import { OrderShippingRate } from '@/domains/main/models/entities/order-shipping-rate';
import { OrderShippingAddress } from '@/domains/main/models/entities/order-shipping-address';
import { ResolveShippingRateForCheckoutUseCase } from '../../shipping/use-cases/resolve-shipping-rate-for-checkout-use-case';

interface IRequest {
	userId: string;
	shippingRateId: string;
	customer: {
		name: string;
		email: string;
		phone?: string | null;
		document?: string | null;
		birthDate?: string | null;
	};
	shippingAddress: {
		zipCode: string;
		street: string;
		number?: string | null;
		complement?: string | null;
		district?: string | null;
		city: string;
		state: string;
		countryCode: string;
	};
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
		private paymentService: IPaymentService,
		@inject(DEPENDENCY_IDENTIFIERS.RESOLVE_SHIPPING_RATE_FOR_CHECKOUT_USE_CASE)
		private resolveShippingRateForCheckoutUseCase: ResolveShippingRateForCheckoutUseCase
	) {}

	async execute(input: IRequest): Promise<Response> {
		const cart = await this.cartRepository.findActiveByUserId(input.userId);

		if (!cart) {
			return failure(new ResourceNotFoundError('Active cart not found', 'ACTIVE_CART_NOT_FOUND'));
		}

		if (cart.items.length === 0) {
			return failure(new BadRequestError('Cart is empty', 'EMPTY_CART'));
		}

		const shippingResult = await this.resolveShippingRateForCheckoutUseCase.execute({
			userId: input.userId,
			shippingRateId: input.shippingRateId,
			cart,
			destinationPostalCode: input.shippingAddress.zipCode,
		});

		if (shippingResult.isFalse()) {
			return failure(shippingResult.value);
		}

		const { quote, rate } = shippingResult.value.shippingRate;

		const summary = calculateCartSummary({ cartDetails: cart, shippingAmount: rate.amount });

		if (summary.itemsAmount <= 0) {
			return failure(new BadRequestError('Invalid checkout amount', 'INVALID_CHECKOUT_AMOUNT'));
		}

		let orderDetails = await this.orderRepository.findPendingByCartId(cart.id.toString());

		// Depois que começou o pagamento, não podemos trocar frete embaixo daquela Order
		// Ou seja, Se a Order existente foi criada usando: shipping_rate_id A e uma nova requisição chega com: shipping_rate_id B não reutilize silenciosamente a Order.
		if (orderDetails && orderDetails.orderShippingRate?.shippingQuoteRateId !== input.shippingRateId) {
			return failure(
				new BadRequestError('Checkout already started with another shipping rate', 'CHECKOUT_SHIPPING_RATE_CHANGED')
			);
		}

		if (!orderDetails) {
			const order = Order.create({
				userId: new UniqueEntityId(input.userId),
				cartId: cart.id,
				marketCode: cart.marketCode,
				currency: summary.currency,
				status: 'PENDING_PAYMENT',
				itemsAmount: summary.itemsAmount,
				orderBumpAmount: summary.orderBumpAmount,
				subtotalAmount: summary.subtotalAmount,
				discountAmount: summary.discountAmount,
				taxAmount: summary.taxAmount,
				shippingAmount: rate.amount,
				totalAmount: summary.totalAmount,
			});

			const orderItems = createOrderItemsFromCart({ orderId: order.id.toString(), cart });

			if (orderItems.length === 0) {
				return failure(new BadRequestError('Cart has no checkout items', 'EMPTY_CART'));
			}

			const orderCustomer = OrderCustomer.create({
				orderId: order.id,
				name: input.customer.name,
				email: input.customer.email,
				phone: input.customer.phone,
				document: input.customer.document,
				birthDate: input.customer.birthDate,
			});

			const orderShippingAddress = OrderShippingAddress.create({
				orderId: order.id,
				zipCode: input.shippingAddress.zipCode,
				street: input.shippingAddress.street,
				number: input.shippingAddress.number,
				complement: input.shippingAddress.complement,
				district: input.shippingAddress.district,
				city: input.shippingAddress.city,
				state: input.shippingAddress.state,
				countryCode: input.shippingAddress.countryCode,
			});

			const orderShippingRate = OrderShippingRate.create({
				orderId: order.id,
				shippingQuoteId: quote.id.toString(),
				shippingQuoteRateId: rate.id.toString(),
				provider: rate.provider,
				serviceId: rate.serviceId,
				serviceName: rate.serviceName,
				carrierName: rate.carrierName,
				amount: rate.amount,
				currency: rate.currency,
				estimatedDays: rate.estimatedDays,
				rawPayload: rate.rawPayload,
			});

			orderDetails = await this.orderRepository.createWithItems({
				order,
				orderCustomer: orderCustomer,
				shippingAddress: orderShippingAddress,
				shippingRate: orderShippingRate,
				items: orderItems,
			});
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
			userId: input.userId,
			customerEmail: orderDetails.orderCustomer?.email ?? cart.user.email,
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
