import { container } from 'tsyringe';
import { FastifyReply, FastifyRequest } from 'fastify';

import type { IListingAffiliatesQuery } from '../../schemas/affiliates/listing-affiliates-schema';

import { PaginationPresenter } from '../../presenters/pagination-presenter';
import { getAuthenticatedSession } from '../../helpers/get-authenticated-session';
import { AffiliateDetailsPresenter } from '../../presenters/affiliate/affiliate-details-presenter';
import { ListingAffiliatesUseCase } from '@/domains/main/application/modules/affiliates/use-cases/listing-affiliates-use-case';

export async function listingAffiliatesController(request: FastifyRequest, reply: FastifyReply) {
	getAuthenticatedSession(request);

	const { page, per_page, search, status } = request.query as IListingAffiliatesQuery;

	const service = container.resolve(ListingAffiliatesUseCase);

	const result = await service.execute({
		page,
		perPage: per_page,
		search,
		status,
	});

	if (result.isFalse()) {
		throw result.value;
	}

	return reply.status(200).send({
		pagination: PaginationPresenter.paginationModeToHTTP(result.value.pagination),
		affiliates: result.value.affiliates.map(AffiliateDetailsPresenter.toHTTP),
	});
}
