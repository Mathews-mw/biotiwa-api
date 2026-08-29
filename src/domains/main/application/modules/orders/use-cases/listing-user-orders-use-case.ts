import { inject, injectable } from 'tsyringe';

import type { IOrderRepository } from '../repositories/order-repository';
import type { IPaginationParams, IPaginationResponse } from '@/core/interfaces/paginating-interfaces';

import { type Outcome, success } from '@/core/outcome';
import { OrderDetails } from '@/domains/main/models/value-objects/order-details';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';

interface IRequest extends IPaginationParams {
	userId: string;
	search?: string;
}

type Response = Outcome<null, { pagination: IPaginationResponse; orders: Array<OrderDetails> }>;

@injectable()
export class ListingUserOrdersUseCase {
	constructor(@inject(DEPENDENCY_IDENTIFIERS.ORDER_REPOSITORY) private ordersRepository: IOrderRepository) {}

	async execute({ page, perPage, userId, search }: IRequest): Promise<Response> {
		const { pagination, orders } = await this.ordersRepository.findManyByUser({
			page,
			perPage,
			userId,
			search,
		});

		return success({ pagination, orders });
	}
}
