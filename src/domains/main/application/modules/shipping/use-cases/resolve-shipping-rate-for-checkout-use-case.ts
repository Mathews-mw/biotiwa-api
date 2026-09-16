import { inject, injectable } from 'tsyringe';

import type { CartDetails } from '@/domains/main/models/value-objects/cart-details';
import type { IShippingQuoteRepository } from '../repositories/shipping-quote-repository';

import { onlyDigits } from '@/utils/only-digits';
import { failure, success, type Outcome } from '@/core/outcome';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { BadRequestError } from '@/core/errors/bad-request-errors';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';
import { createCartShippingFingerprint } from '../services/create-cart-shipping-fingerprint';
import { ShippingQuoteRateDetails } from '@/domains/main/models/value-objects/shipping-quote-rate-details';

interface IRequest {
	userId: string;
	shippingRateId: string;
	cart: CartDetails;
	destinationPostalCode: string;
}

type Response = Outcome<
	BadRequestError | ResourceNotFoundError,
	{
		shippingRate: ShippingQuoteRateDetails;
	}
>;

@injectable()
export class ResolveShippingRateForCheckoutUseCase {
	constructor(
		@inject(DEPENDENCY_IDENTIFIERS.SHIPPING_QUOTE_REPOSITORY)
		private readonly shippingQuoteRepository: IShippingQuoteRepository
	) {}

	async execute(input: IRequest): Promise<Response> {
		const rateDetails = await this.shippingQuoteRepository.findRateForCheckout({
			userId: new UniqueEntityId(input.userId),
			cartId: input.cart.id,
			rateId: new UniqueEntityId(input.shippingRateId),
		});

		// Deve ser o mesmo erro para rate inexistente ou pertencente a outro usuário
		if (!rateDetails) {
			return failure(new ResourceNotFoundError('Shipping rate not found', 'SHIPPING_RATE_NOT_FOUND'));
		}

		const { quote } = rateDetails;

		if (quote.isExpired) {
			return failure(new BadRequestError('Shipping quote expired', 'SHIPPING_QUOTE_EXPIRED'));
		}

		const destinationPostalCode = onlyDigits(input.destinationPostalCode);

		if (quote.destinationPostalCode !== destinationPostalCode) {
			return failure(
				new BadRequestError('Shipping rate does not match checkout destination', 'SHIPPING_RATE_DESTINATION_MISMATCH')
			);
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

		return success({
			shippingRate: rateDetails,
		});
	}
}
