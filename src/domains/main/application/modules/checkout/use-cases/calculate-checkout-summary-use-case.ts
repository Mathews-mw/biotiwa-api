import { inject, injectable } from 'tsyringe';

import type { ICartRepository } from '../../carts/repositories/cart-repository';

import { failure, success, type Outcome } from '@/core/outcome';
import { BadRequestError } from '@/core/errors/bad-request-errors';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { calculateCartSummary } from '../../carts/services/calculate-cart-summary';
import { ShippingRateResolver } from '../../shipping/services/shipping-rate-resolver';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';
import { PromotionResolverService } from '../../promotions/services/promotion-resolver-service';
import {
	calculateCheckoutSummary,
	type ICheckoutPromotionSummary,
	type ICheckoutSummary,
} from '../services/calculate-checkout-summary';

interface IRequest {
	userId: string;
	shippingRateId?: string | null;
	promotionCode?: string | null;
}

type Response = Outcome<
	ResourceNotFoundError | BadRequestError,
	{
		summary: ICheckoutSummary;
	}
>;

@injectable()
export class CalculateCheckoutSummaryUseCase {
	constructor(
		@inject(DEPENDENCY_IDENTIFIERS.CARTS_REPOSITORY)
		private cartRepository: ICartRepository,
		@inject(DEPENDENCY_IDENTIFIERS.SHIPPING_RATE_RESOLVER)
		private shippingRateResolver: ShippingRateResolver,
		@inject(DEPENDENCY_IDENTIFIERS.PROMOTION_RESOLVER_SERVICE)
		private promotionResolverService: PromotionResolverService
	) {}

	async execute({ userId, shippingRateId, promotionCode }: IRequest): Promise<Response> {
		const cart = await this.cartRepository.findActiveByUserId(userId);

		if (!cart) {
			return failure(new ResourceNotFoundError('Active cart not found', 'ACTIVE_CART_NOT_FOUND'));
		}

		if (cart.items.length === 0) {
			return failure(new BadRequestError('Cart is empty', 'EMPTY_CART'));
		}

		const cartSummary = calculateCartSummary({ cartDetails: cart });

		let promotionDiscountAmount = 0;
		let promotion: ICheckoutPromotionSummary | null = null;

		if (promotionCode) {
			const result = await this.promotionResolverService.resolve({
				userId,
				promotionCode,
				marketCode: cart.marketCode,
				cartSummary,
			});

			if (result.isFalse()) {
				return failure(result.value);
			}

			const { checkoutPromotionSummary, promotionDiscountAmount: promotionDiscountAmountResult } = result.value;

			promotionDiscountAmount = promotionDiscountAmountResult;
			promotion = checkoutPromotionSummary;
		}

		// Caso em que usuário não selecionou nenhuma opção de entrega
		if (!shippingRateId) {
			const checkoutSummary = calculateCheckoutSummary({
				cart,
				shippingAmount: null,
				promotionDiscountAmount,
			});

			return success({
				summary: {
					...checkoutSummary,
					promotion,
				},
			});
		}

		// Existe uma rate selecionada. Validamos contra o carrinho atual
		const shippingResult = await this.shippingRateResolver.resolve({
			userId,
			cart,
			shippingRateId,
		});

		if (shippingResult.isFalse()) {
			return failure(shippingResult.value);
		}

		const rate = shippingResult.value.rate;

		const checkoutSummary: ICheckoutSummary = {
			...calculateCheckoutSummary({
				cart,
				shippingAmount: rate.amount,
				promotionDiscountAmount,
			}),
			promotion,
			shipping: {
				rateId: rate.id.toString(),
				provider: rate.provider,
				serviceName: rate.serviceName,
				carrierName: rate.carrierName ?? null,
				amount: rate.amount,
				estimatedDays: rate.estimatedDays ?? null,
			},
		};

		return success({ summary: checkoutSummary });
	}
}
