import { inject, injectable } from 'tsyringe';

import type { ICartRepository } from '../../carts/repositories/cart-repository';

import { failure, success, type Outcome } from '@/core/outcome';
import { BadRequestError } from '@/core/errors/bad-request-errors';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { ShippingRateResolver } from '../../shipping/services/shipping-rate-resolver';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';
import { calculateCheckoutSummary, ICheckoutSummary } from '../services/calculate-checkout-summary';

interface IRequest {
	userId: string;
	shippingRateId?: string | null;
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
		private shippingRateResolver: ShippingRateResolver
	) {}

	async execute({ userId, shippingRateId }: IRequest): Promise<Response> {
		const cart = await this.cartRepository.findActiveByUserId(userId);

		if (!cart) {
			return failure(new ResourceNotFoundError('Active cart not found', 'ACTIVE_CART_NOT_FOUND'));
		}

		if (cart.items.length === 0) {
			return failure(new BadRequestError('Cart is empty', 'EMPTY_CART'));
		}

		// Caso em que usuário não selecionou nenhuma opção de entrega
		if (!shippingRateId) {
			return success({
				summary: calculateCheckoutSummary({
					cart,
					shippingAmount: null,
				}),
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
			}),
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
