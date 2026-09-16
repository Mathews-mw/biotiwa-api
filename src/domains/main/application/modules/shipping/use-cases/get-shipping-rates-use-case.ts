import { inject, injectable } from 'tsyringe';

import type { ICartRepository } from '../../carts/repositories/cart-repository';
import type { IShippingRate, IShippingService } from '@/services/shipping/repositories/shipping-service';

import { env } from '@/env';
import { failure, success, type Outcome } from '@/core/outcome';
import { BadRequestError } from '@/core/errors/bad-request-errors';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { getShippingErrorMessage } from '../helpers/get-shipping-error-message';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';
import { buildShippingProductsFromCart } from '../helpers/build-shipping-products-from-cart';
import { GetValidMelhorEnvioAccessTokenUseCase } from '../../integrations/melhor-envio/use-cases/get-valid-melhor-envio-access-token-use-case';

interface IRequest {
	userId: string;
	destinationPostalCode: string;
}

type Response = Outcome<
	BadRequestError | ResourceNotFoundError,
	{
		rates: IShippingRate[];
	}
>;

@injectable()
export class GetShippingRatesUseCase {
	constructor(
		@inject(DEPENDENCY_IDENTIFIERS.CARTS_REPOSITORY)
		private readonly cartRepository: ICartRepository,
		@inject(DEPENDENCY_IDENTIFIERS.SHIPPING_SERVICE)
		private readonly shippingService: IShippingService,
		@inject(DEPENDENCY_IDENTIFIERS.GET_VALID_MELHOR_ENVIO_ACCESS_TOKEN_USE_CASE)
		private readonly getValidMelhorEnvioAccessTokenUseCase: GetValidMelhorEnvioAccessTokenUseCase
	) {}

	async execute(input: IRequest): Promise<Response> {
		const cart = await this.cartRepository.findActiveByUserId(input.userId);

		if (!cart) {
			return failure(new ResourceNotFoundError('Cart not found', 'CART_NOT_FOUND'));
		}

		if (cart.items.length === 0) {
			return failure(new BadRequestError('Cart is empty', 'EMPTY_CART'));
		}

		if (cart.marketCode !== 'BR') {
			return failure(
				new BadRequestError('Shipping quotes are currently available only for Brazil', 'SHIPPING_MARKET_NOT_SUPPORTED')
			);
		}

		const tokenResult = await this.getValidMelhorEnvioAccessTokenUseCase.execute();

		if (tokenResult.isFalse()) {
			return failure(new BadRequestError(tokenResult.value.message, 'MELHOR_ENVIO_AUTHENTICATION_FAILED'));
		}

		const products = buildShippingProductsFromCart(cart);

		if (products.length === 0) {
			return failure(new BadRequestError('Cart has no shippable products', 'CART_HAS_NO_SHIPPABLE_PRODUCTS'));
		}

		try {
			const rates = await this.shippingService.calculateRates({
				accessToken: tokenResult.value.accessToken,
				fromPostalCode: env.SHIPPING_ORIGIN_POSTAL_CODE,
				toPostalCode: input.destinationPostalCode,
				products,
				services: env.MELHOR_ENVIO_SERVICES,
			});

			if (rates.length === 0) {
				return failure(
					new BadRequestError('No shipping rates available for this destination', 'SHIPPING_NO_RATES_AVAILABLE')
				);
			}

			return success({
				rates,
			});
		} catch (error) {
			return failure(new BadRequestError(getShippingErrorMessage(error), 'MELHOR_ENVIO_SHIPPING_QUOTE_FAILED'));
		}
	}
}
