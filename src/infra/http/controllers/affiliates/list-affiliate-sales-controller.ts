import { container } from 'tsyringe';
import { FastifyReply, FastifyRequest } from 'fastify';

import type { IListAffiliateSalesQuery } from '../../schemas/affiliates/list-affiliate-sales-schema';

import { getAuthenticatedSession } from '../../helpers/get-authenticated-session';
import { AffiliateSalePresenter } from '../../presenters/affiliate/affiliate-sale-presenter';
import { ListAffiliateSalesUseCase } from '@/domains/main/application/modules/affiliates/use-cases/list-affiliate-sales-use-case';

export async function listAffiliateSalesController(request: FastifyRequest, reply: FastifyReply) {
	const session = getAuthenticatedSession(request);

	const { page, per_page, currency, commission_status } = request.query as IListAffiliateSalesQuery;

	const service = container.resolve(ListAffiliateSalesUseCase);

	const result = await service.execute({
		userId: session.userId,
		page,
		perPage: per_page,
		currency,
		commissionStatus: commission_status,
	});

	if (result.isFalse()) {
		throw result.value;
	}

	const response = AffiliateSalePresenter.toHTTP({ pagination: result.value.pagination, sales: result.value.sales });

	return reply.status(200).send(response);
}
