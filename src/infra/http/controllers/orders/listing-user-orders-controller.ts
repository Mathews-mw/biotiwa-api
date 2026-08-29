import { container } from 'tsyringe';
import { FastifyReply, FastifyRequest } from 'fastify';

import type { IListingUserOrdersQuery } from '../../schemas/order/listing-user-orders-schema';

import { PaginationPresenter } from '../../presenters/pagination-presenter';
import { getAuthenticatedSession } from '../../helpers/get-authenticated-session';
import { OrderDetailsPresenter } from '../../presenters/order/order-details-presenter';
import { ListingUserOrdersUseCase } from '@/domains/main/application/modules/orders/use-cases/listing-user-orders-use-case';

export async function listingUserOrdersController(request: FastifyRequest, reply: FastifyReply) {
	const session = getAuthenticatedSession(request);

	const { page, per_page, search } = request.query as IListingUserOrdersQuery;

	const service = container.resolve(ListingUserOrdersUseCase);

	const result = await service.execute({
		userId: session.userId,
		page,
		perPage: per_page,
		search,
	});

	if (result.isFalse()) {
		throw result.value;
	}

	const response = {
		pagination: PaginationPresenter.paginationModeToHTTP(result.value.pagination),
		orders: result.value.orders.map(OrderDetailsPresenter.toHTTP),
	};

	return reply.status(200).send(response);
}
