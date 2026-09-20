import { container } from 'tsyringe';
import { FastifyReply, FastifyRequest } from 'fastify';

import { PaymentPresenter } from '../../presenters/payment/payment-presenter';
import { IGetOrderDetailsParams } from '../../schemas/order/get-order-details-schema';
import { OrderDetailsPresenter } from '../../presenters/order/order-details-presenter';
import { GetOrderDetailsUseCase } from '@/domains/main/application/modules/orders/use-cases/get-order-details-use-case';

export async function getOrderDetailsController(request: FastifyRequest, reply: FastifyReply) {
	const { orderId } = request.params as IGetOrderDetailsParams;

	const service = container.resolve(GetOrderDetailsUseCase);

	const result = await service.execute({
		orderId,
	});

	if (result.isFalse()) {
		throw result.value;
	}

	const response = {
		order: OrderDetailsPresenter.toHTTP(result.value.order),
		payment: result.value.payment ? PaymentPresenter.toHTTP(result.value.payment) : null,
	};

	return reply.status(200).send(response);
}
