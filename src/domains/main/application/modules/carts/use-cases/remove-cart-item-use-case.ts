import { inject, injectable } from 'tsyringe';

import { failure, success, type Outcome } from '@/core/outcome';
import { CartDetails } from '@/domains/main/models/value-objects/cart-details';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';
import { calculateCartSummary, type ICartSummary } from '../calculators/calculate-cart-summary';

import type { ICartRepository } from '../repositories/cart-repository';

interface IRequest {
	userId: string;
	cartItemId: string;
}

type Response = Outcome<
	ResourceNotFoundError,
	{
		cart: CartDetails;
		summary: ICartSummary;
	}
>;

@injectable()
export class RemoveCartItemUseCase {
	constructor(
		@inject(DEPENDENCY_IDENTIFIERS.CARTS_REPOSITORY)
		private cartRepository: ICartRepository
	) {}

	async execute({ userId, cartItemId }: IRequest): Promise<Response> {
		const item = await this.cartRepository.findItemByIdAndUserId({
			userId,
			cartItemId,
		});

		if (!item) {
			return failure(new ResourceNotFoundError('Cart item not found', 'CART_ITEM_NOT_FOUND'));
		}

		const cart = await this.cartRepository.removeItem(item);

		return success({
			cart,
			summary: calculateCartSummary(cart),
		});
	}
}
