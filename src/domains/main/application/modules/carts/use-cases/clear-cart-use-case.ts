import { inject, injectable } from 'tsyringe';

import { Outcome, success } from '@/core/outcome';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';

import type { ICartRepository } from '../repositories/cart-repository';

interface IRequest {
	userId: string;
}

type Response = Outcome<never, null>;

@injectable()
export class ClearCartUseCase {
	constructor(
		@inject(DEPENDENCY_IDENTIFIERS.CARTS_REPOSITORY)
		private cartRepository: ICartRepository
	) {}

	async execute({ userId }: IRequest): Promise<Response> {
		await this.cartRepository.clearActiveCart(userId);

		return success(null);
	}
}
