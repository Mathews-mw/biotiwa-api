import { inject, injectable } from 'tsyringe';

import type { ICartRepository } from '../../carts/repositories/cart-repository';
import type { IOrderRepository } from '../../orders/repositories/order-repository';
import type { IPaymentService } from '@/services/payments/payment-service.interface';
import type { IPaymentRepository } from '../../payments/repositories/payment-repository';

import promotionConfig from '@/config/promotion-config';
import { Order } from '@/domains/main/models/entities/order';
import { failure, success, type Outcome } from '@/core/outcome';
import { Payment } from '@/domains/main/models/entities/payment';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { BadRequestError } from '@/core/errors/bad-request-errors';
import { PromotionCode } from '@/domains/main/models/entities/promotion-code';
import { OrderCustomer } from '@/domains/main/models/entities/order-customer';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { OrderPromotion } from '@/domains/main/models/entities/order-promotion';
import { calculateCheckoutSummary } from '../services/calculate-checkout-summary';
import { calculateCartSummary } from '../../carts/services/calculate-cart-summary';
import { createOrderItemsFromCart } from '../helpers/create-order-items-from-cart';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';
import { CheckoutSession } from '@/domains/main/models/value-objects/checkout-session';
import { OrderShippingRate } from '@/domains/main/models/entities/order-shipping-rate';
import { PromotionRedemption } from '@/domains/main/models/entities/promotion-redemption';
import { OrderShippingAddress } from '@/domains/main/models/entities/order-shipping-address';
import { PromotionResolverService } from '../../promotions/services/promotion-resolver-service';
import { ResolveShippingRateForCheckoutUseCase } from '../../shipping/use-cases/resolve-shipping-rate-for-checkout-use-case';

interface IRequest {
	userId: string;
	shippingRateId: string;
	promotionCode?: string | null;
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
		private resolveShippingRateForCheckoutUseCase: ResolveShippingRateForCheckoutUseCase,
		@inject(DEPENDENCY_IDENTIFIERS.PROMOTION_RESOLVER_SERVICE)
		private promotionResolverService: PromotionResolverService
	) {}

	async execute(input: IRequest): Promise<Response> {
		const cart = await this.cartRepository.findActiveByUserId(input.userId);

		if (!cart) {
			return failure(new ResourceNotFoundError('Active cart not found', 'ACTIVE_CART_NOT_FOUND'));
		}

		if (cart.items.length === 0) {
			return failure(new BadRequestError('Cart is empty', 'EMPTY_CART'));
		}

		// Primeiro verificamos se este carrinho já possui um checkout iniciado;
		// Se possuir, a Order existente é o snapshot definitivo daquele checkout.
		let orderDetails = await this.orderRepository.findPendingByCartId(cart.id.toString());

		/*
		 * ========================================
		 * EXISTING ORDER
		 * ========================================
		 */

		if (orderDetails) {
			// Depois que uma Order existe, não permitimos trocar o frete
			if (orderDetails.orderShippingRate?.shippingQuoteRateId !== input.shippingRateId) {
				return failure(
					new BadRequestError('Checkout already started with another shipping rate', 'CHECKOUT_SHIPPING_RATE_CHANGED')
				);
			}

			// Também não podemos trocar promoção depois da criação da Order
			const requestedPromotionCode = input.promotionCode ? PromotionCode.normalizeCode(input.promotionCode) : null;

			const existingPromotionCode = orderDetails.orderPromotion?.code ?? null;

			if (existingPromotionCode !== requestedPromotionCode) {
				return failure(
					new BadRequestError('Checkout already started with another promotion code', 'CHECKOUT_PROMOTION_CHANGED')
				);
			}
		}

		/*
		 * ========================================
		 * NEW ORDER
		 * ========================================
		 */

		if (!orderDetails) {
			const cartSummary = calculateCartSummary({
				cartDetails: cart,
			});

			let resolvedPromotion: PromotionCode | null = null;
			let promotionDiscountAmount = 0;

			// Resolve e calcula promoção somente na criação de uma nova Order
			if (input.promotionCode) {
				const result = await this.promotionResolverService.resolve({
					userId: input.userId,
					promotionCode: input.promotionCode,
					marketCode: cart.marketCode,
					cartSummary,
				});

				if (result.isFalse()) {
					return failure(result.value);
				}

				const { resolvedPromotionCode, promotionDiscountAmount: resolvedDiscountAmount } = result.value;

				resolvedPromotion = resolvedPromotionCode;
				promotionDiscountAmount = resolvedDiscountAmount;
			}

			// O frete também é validado definitivamente aqui
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

			// Fonte definitiva dos valores do pedido
			const summary = calculateCheckoutSummary({
				cart,
				shippingAmount: rate.amount,
				promotionDiscountAmount,
			});

			if (summary.totalAmount <= 0) {
				return failure(new BadRequestError('Invalid checkout amount', 'INVALID_CHECKOUT_AMOUNT'));
			}

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

			const orderItems = createOrderItemsFromCart({
				orderId: order.id.toString(),
				cart,
			});

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

			// Snapshot histórico da promoção
			const orderPromotion = resolvedPromotion
				? OrderPromotion.create({
						orderId: order.id,
						sourcePromotionCodeId: resolvedPromotion.id,
						code: resolvedPromotion.code,
						type: resolvedPromotion.type,
						discountType: resolvedPromotion.discountType,
						discountValue: resolvedPromotion.discountValue,
						discountAmount: promotionDiscountAmount,
					})
				: null;

			// Reserva de uso da promoção. Ainda NÃO é um uso confirmado: isso acontecerá somente quando o webhook confirmar pagamento
			const promotionRedemption = resolvedPromotion
				? PromotionRedemption.create({
						promotionCodeId: resolvedPromotion.id,
						userId: new UniqueEntityId(input.userId),
						orderId: order.id,
						status: 'PENDING',
						discountAmount: promotionDiscountAmount,
						reservedUntil: new Date(Date.now() + promotionConfig.PROMOTION_RESERVATION_TTL_MS),
					})
				: null;

			orderDetails = await this.orderRepository.createWithItems({
				order,
				orderCustomer,
				shippingAddress: orderShippingAddress,
				shippingRate: orderShippingRate,
				orderPromotion,
				promotionRedemption,
				items: orderItems,
			});
		}

		/*
		 * ========================================
		 * PAYMENT
		 * ========================================
		 */

		const existingPendingPayment = await this.paymentsRepository.findPendingByOrderId(orderDetails.id.toString());

		// Idempotência: se já criamos a Stripe Session, apenas devolvemos a mesma
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

		return success({
			checkoutSession,
		});
	}
}
