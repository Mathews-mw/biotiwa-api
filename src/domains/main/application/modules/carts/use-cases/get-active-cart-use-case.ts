import { inject, injectable } from 'tsyringe';

import { success, type Outcome } from '@/core/outcome';
import { CartDetails } from '@/domains/main/models/value-objects/cart-details';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';
import { calculateCartSummary, type ICartSummary } from '../calculators/calculate-cart-summary';

import type { ICartRepository } from '../repositories/cart-repository';

interface IRequest {
	userId: string;
}

type Response = Outcome<
	never,
	{
		cart: CartDetails | null;
		summary: ICartSummary | null;
	}
>;

@injectable()
export class GetActiveCartUseCase {
	constructor(
		@inject(DEPENDENCY_IDENTIFIERS.CARTS_REPOSITORY)
		private cartsRepository: ICartRepository
	) {}

	async execute({ userId }: IRequest): Promise<Response> {
		const cart = await this.cartsRepository.findActiveByUserId(userId);

		if (!cart) {
			return success({
				cart: null,
				summary: null,
			});
		}

		const summary = calculateCartSummary(cart);

		return success({
			cart,
			summary,
		});
	}
}
