import { inject, injectable } from 'tsyringe';

import type { IOrderRepository } from '../../orders/repositories/order-repository';
import type { IPaymentRepository } from '../../payments/repositories/payment-repository';

import { failure, success, type Outcome } from '@/core/outcome';
import { Payment } from '@/domains/main/models/entities/payment';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { OrderDetails } from '@/domains/main/models/value-objects/order-details';
import { DEPENDENCY_IDENTIFIERS } from '@/shared/di/containers/dependency-identifiers';

interface IRequest {
	orderId: string;
}

type Response = Outcome<
	ResourceNotFoundError,
	{
		order: OrderDetails;
		payment: Payment | null;
	}
>;

@injectable()
export class GetOrderDetailsUseCase {
	constructor(
		@inject(DEPENDENCY_IDENTIFIERS.ORDER_REPOSITORY)
		private orderRepository: IOrderRepository,
		@inject(DEPENDENCY_IDENTIFIERS.PAYMENT_REPOSITORY)
		private paymentRepository: IPaymentRepository
	) {}

	async execute({ orderId }: IRequest): Promise<Response> {
		const order = await this.orderRepository.findById(orderId);

		if (!order) {
			return failure(new ResourceNotFoundError('Order not found', 'ORDER_NOT_FOUND'));
		}

		const payment = await this.paymentRepository.findByOrderId(orderId);

		return success({
			order,
			payment,
		});
	}
}
