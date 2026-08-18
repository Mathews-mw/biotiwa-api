import { inject, injectable } from 'tsyringe';

import type { ICartRepository } from '../../carts/repositories/cart-repository';

import { failure, success, type Outcome } from '@/core/outcome';
import { BadRequestError } from '@/core/errors/bad-request-errors';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { CheckoutQuote } from '@/domains/main/models/value-objects/checkout-quote';
import { calculateCartSummary } from '../../carts/calculators/calculate-cart-summary';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';

interface IRequest {
	userId: string;
}

type Response = Outcome<
	ResourceNotFoundError | BadRequestError,
	{
		quote: CheckoutQuote;
	}
>;

@injectable()
export class CreateCheckoutQuoteUseCase {
	constructor(
		@inject(DEPENDENCY_IDENTIFIERS.CARTS_REPOSITORY)
		private cartRepository: ICartRepository
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

		if (summary.totalAmount <= 0) {
			return failure(new BadRequestError('Invalid checkout amount', 'INVALID_CHECKOUT_AMOUNT'));
		}

		const quote = CheckoutQuote.create({
			cart,
			summary,
		});

		return success({
			quote,
		});
	}
}
