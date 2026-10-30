import { container } from 'tsyringe';
import { FastifyReply, FastifyRequest } from 'fastify';

import { userAuthSchema } from '@/core/auth/models/user-auth-model';
import { PaymentPresenter } from '../../presenters/payment/payment-presenter';
import { getAuthenticatedSession } from '../../helpers/get-authenticated-session';
import { IGetOrderDetailsParams } from '../../schemas/order/get-order-details-schema';
import { OrderDetailsPresenter } from '../../presenters/order/order-details-presenter';
import { GetOrderDetailsUseCase } from '@/domains/main/application/modules/orders/use-cases/get-order-details-use-case';

export async function getOrderDetailsController(request: FastifyRequest, reply: FastifyReply) {
	const session = getAuthenticatedSession(request);

	const { orderId } = request.params as IGetOrderDetailsParams;

	const actor = userAuthSchema.parse({
		id: session.userId,
		role: session.userRole,
	});

	const service = container.resolve(GetOrderDetailsUseCase);

	const result = await service.execute({
		actor,
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
