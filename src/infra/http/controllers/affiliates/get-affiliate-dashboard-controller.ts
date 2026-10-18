import { container } from 'tsyringe';

import type { FastifyReply, FastifyRequest } from 'fastify';

import { getAuthenticatedSession } from '../../helpers/get-authenticated-session';
import { AffiliateDashboardPresenter } from '../../presenters/affiliate/affiliate-dashboard-presenter';
import { GetAffiliateDashboardUseCase } from '@/domains/main/application/modules/affiliates/use-cases/get-affiliate-dashboard-use-case';

export async function getAffiliateDashboardController(request: FastifyRequest, reply: FastifyReply) {
	const session = getAuthenticatedSession(request);

	const useCase = container.resolve(GetAffiliateDashboardUseCase);

	const result = await useCase.execute({
		userId: session.userId,
	});

	if (result.isFalse()) {
		throw result.value;
	}

	const { affiliate, dashboard } = result.value;

	return reply.status(200).send(
		AffiliateDashboardPresenter.toHTTP({
			affiliate,
			dashboard,
		})
	);
}
