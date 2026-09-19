import { inject, injectable } from 'tsyringe';

import type { CartDetails } from '@/domains/main/models/value-objects/cart-details';
import type { ShippingQuoteRateDetails } from '@/domains/main/models/value-objects/shipping-quote-rate-details';

import { failure, success, type Outcome } from '@/core/outcome';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { BadRequestError } from '@/core/errors/bad-request-errors';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { createCartShippingFingerprint } from './create-cart-shipping-fingerprint';
import { IShippingQuoteRepository } from '../repositories/shipping-quote-repository';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';

interface IResolveShippingRateInput {
	userId: string;
	cart: CartDetails;
	shippingRateId: string;
}

type Response = Outcome<BadRequestError | ResourceNotFoundError, ShippingQuoteRateDetails>;

@injectable()
export class ShippingRateResolver {
	constructor(
		@inject(DEPENDENCY_IDENTIFIERS.SHIPPING_QUOTE_REPOSITORY)
		private readonly shippingQuoteRepository: IShippingQuoteRepository
	) {}

	async resolve(input: IResolveShippingRateInput): Promise<Response> {
		const shippingQuoteRateDetails = await this.shippingQuoteRepository.findRateForCheckout({
			userId: new UniqueEntityId(input.userId),
			cartId: input.cart.id,
			rateId: new UniqueEntityId(input.shippingRateId),
		});

		if (!shippingQuoteRateDetails) {
			return failure(new ResourceNotFoundError('Shipping rate not found', 'SHIPPING_RATE_NOT_FOUND'));
		}

		const { quote } = shippingQuoteRateDetails;

		if (quote.isExpired) {
			return failure(new BadRequestError('Shipping quote expired', 'SHIPPING_QUOTE_EXPIRED'));
		}

		if (quote.marketCode !== input.cart.marketCode) {
			return failure(new BadRequestError('Shipping rate does not match cart market', 'SHIPPING_RATE_MARKET_MISMATCH'));
		}

		const currentFingerprint = createCartShippingFingerprint({
			cartId: input.cart.id.toString(),
			items: input.cart.items.map((item) => ({
				id: item.id.toString(),
				type: item.type,
				quantity: item.quantity,
				offerId: item.offer?.id.toString() ?? null,
				orderBumpId: item.orderBump?.id.toString() ?? null,
			})),
		});

		if (currentFingerprint !== quote.cartFingerprint) {
			return failure(new BadRequestError('Cart changed after shipping calculation', 'SHIPPING_RATE_CART_MISMATCH'));
		}

		return success(shippingQuoteRateDetails);
	}
}
