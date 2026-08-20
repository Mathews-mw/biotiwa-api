import { container } from 'tsyringe';
import type { FastifyReply, FastifyRequest } from 'fastify';

import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { getAuthenticatedSession } from '@/infra/http/helpers/get-authenticated-session';
import { IGetCheckoutSessionStatusParams } from '../../schemas/checkout/get-checkout-session-status-schema';
import { CheckoutSessionStatusPresenter } from '../../presenters/checkout/checkout-session-status-presenter';
import { GetCheckoutSessionStatusUseCase } from '@/domains/main/application/modules/checkout/use-cases/get-checkout-session-status-use-case';

export async function getCheckoutSessionStatusController(request: FastifyRequest, reply: FastifyReply) {
	const session = getAuthenticatedSession(request);

	const { providerSessionId } = request.params as IGetCheckoutSessionStatusParams;

	const service = container.resolve(GetCheckoutSessionStatusUseCase);

	const result = await service.execute({
		userId: new UniqueEntityId(session.userId),
		providerSessionId,
	});

	if (result.isFalse()) {
		throw result.value;
	}

	return reply.status(200).send(CheckoutSessionStatusPresenter.toHTTP(result.value.checkoutSessionStatus));
}
