import { inject, injectable } from 'tsyringe';

import type { ICartRepository } from '../../carts/repositories/cart-repository';
import type { IShippingService } from '@/services/shipping/repositories/shipping-service';
import type { IShippingQuoteRepository } from '../repositories/shipping-quote-repository';

import { env } from '@/env';
import { onlyDigits } from '@/utils/only-digits';
import shippingConfig from '@/config/shipping-config';
import { failure, success, type Outcome } from '@/core/outcome';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { BadRequestError } from '@/core/errors/bad-request-errors';
import { ShippingQuote } from '@/domains/main/models/entities/shipping-quote';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';
import { ShippingQuoteRate } from '@/domains/main/models/entities/shipping-quote-rate';
import { buildShippingProductsFromCart } from '../helpers/build-shipping-products-from-cart';
import { createCartShippingFingerprint } from '../services/create-cart-shipping-fingerprint';
import { ShippingQuoteDetails } from '@/domains/main/models/value-objects/shipping-quote-details';
import { GetValidMelhorEnvioAccessTokenUseCase } from '../../integrations/melhor-envio/use-cases/get-valid-melhor-envio-access-token-use-case';

interface IRequest {
	userId: string;
	destinationPostalCode: string;
}

type Response = Outcome<
	BadRequestError | ResourceNotFoundError,
	{
		shippingQuote: ShippingQuoteDetails;
	}
>;

@injectable()
export class CreateShippingQuoteUseCase {
	constructor(
		@inject(DEPENDENCY_IDENTIFIERS.CARTS_REPOSITORY)
		private readonly cartRepository: ICartRepository,
		@inject(DEPENDENCY_IDENTIFIERS.SHIPPING_SERVICE)
		private readonly shippingService: IShippingService,
		@inject(DEPENDENCY_IDENTIFIERS.SHIPPING_QUOTE_REPOSITORY)
		private readonly shippingQuoteRepository: IShippingQuoteRepository,
		@inject(DEPENDENCY_IDENTIFIERS.GET_VALID_MELHOR_ENVIO_ACCESS_TOKEN_USE_CASE)
		private readonly getValidMelhorEnvioAccessTokenUseCase: GetValidMelhorEnvioAccessTokenUseCase
	) {}

	async execute(input: IRequest): Promise<Response> {
		const cart = await this.cartRepository.findActiveByUserId(input.userId.toString());

		if (!cart) {
			return failure(new ResourceNotFoundError('Active cart not found', 'ACTIVE_CART_NOT_FOUND'));
		}

		if (cart.items.length === 0) {
			return failure(new BadRequestError('Cart is empty', 'EMPTY_CART'));
		}

		if (cart.marketCode !== 'BR') {
			return failure(
				new BadRequestError('Shipping is currently available only for Brazil', 'SHIPPING_MARKET_NOT_SUPPORTED')
			);
		}

		const tokenResult = await this.getValidMelhorEnvioAccessTokenUseCase.execute();

		if (tokenResult.isFalse()) {
			return failure(new BadRequestError(tokenResult.value.message, 'MELHOR_ENVIO_AUTHENTICATION_FAILED'));
		}

		const products = buildShippingProductsFromCart(cart);

		const gatewayRates = await this.shippingService.calculateRates({
			accessToken: tokenResult.value.accessToken,
			fromPostalCode: env.SHIPPING_ORIGIN_POSTAL_CODE,
			toPostalCode: input.destinationPostalCode,
			products,
		});

		if (gatewayRates.length === 0) {
			return failure(new BadRequestError('No shipping rates available', 'NO_SHIPPING_RATES_AVAILABLE'));
		}

		const quote = ShippingQuote.create({
			userId: new UniqueEntityId(input.userId),
			cartId: cart.id,
			marketCode: cart.marketCode,
			destinationPostalCode: onlyDigits(input.destinationPostalCode),
			cartFingerprint: createCartShippingFingerprint({
				cartId: cart.id.toString(),
				items: cart.items.map((item) => ({
					id: item.id.toString(),
					type: item.type,
					quantity: item.quantity,
					offerId: item.offer?.id.toString() ?? null,
					orderBumpId: item.orderBump?.id.toString() ?? null,
				})),
			}),
			expiresAt: new Date(Date.now() + shippingConfig.SHIPPING_QUOTE_TTL_IN_MS),
			requestPayload: {
				fromPostalCode: env.SHIPPING_ORIGIN_POSTAL_CODE,
				toPostalCode: onlyDigits(input.destinationPostalCode),
				products,
			},
			responsePayload: gatewayRates.map((rate) => rate.rawPayload),
		});

		const rates = gatewayRates.map((rate) =>
			ShippingQuoteRate.create({
				shippingQuoteId: quote.id,
				provider: rate.provider,
				serviceId: rate.serviceId,
				serviceName: rate.serviceName,
				carrierName: rate.carrierName,
				amount: rate.amount,
				currency: rate.currency,
				estimatedDays: rate.estimatedDays,
				rawPayload: rate.rawPayload,
			})
		);

		const shippingQuote = await this.shippingQuoteRepository.createWithRates({
			quote,
			rates,
		});

		return success({
			shippingQuote,
		});
	}
}
