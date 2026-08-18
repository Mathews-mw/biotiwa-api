import { inject, injectable } from 'tsyringe';

import { failure, success, type Outcome } from '@/core/outcome';
import { BadRequestError } from '@/core/errors/bad-request-errors';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { CartDetails } from '@/domains/main/models/value-objects/cart-details';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';
import { calculateCartSummary, type ICartSummary } from '../calculators/calculate-cart-summary';

import type { ICartRepository } from '../repositories/cart-repository';

interface IRequest {
	userId: string;
	cartItemId: string;
	quantity: number;
}

type Response = Outcome<
	BadRequestError | ResourceNotFoundError,
	{
		cart: CartDetails;
		summary: ICartSummary;
	}
>;

@injectable()
export class UpdateCartItemQuantityUseCase {
	constructor(
		@inject(DEPENDENCY_IDENTIFIERS.CARTS_REPOSITORY)
		private cartRepository: ICartRepository
	) {}

	async execute({ userId, cartItemId, quantity }: IRequest): Promise<Response> {
		if (quantity < 1) {
			return failure(new BadRequestError('Quantity must be greater than zero', 'CART_QUANTITY_ZERO_ERROR'));
		}

		const item = await this.cartRepository.findItemByIdAndUserId({
			cartItemId,
			userId,
		});

		if (!item) {
			return failure(new ResourceNotFoundError('Cart item not found', 'CART_ITEM_NOT_FOUND'));
		}

		item.quantity = quantity;

		const cart = await this.cartRepository.saveItem(item);

		return success({
			cart,
			summary: calculateCartSummary(cart),
		});
	}
}
