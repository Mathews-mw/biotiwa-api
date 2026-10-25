import { container } from 'tsyringe';
import { FastifyReply, FastifyRequest } from 'fastify';

import type { IListAffiliatePromotionCodesQuery } from '../../schemas/affiliates/list-affiliate-promotion-codes-schema';

import { getAuthenticatedSession } from '../../helpers/get-authenticated-session';
import { AffiliatePromotionCodeDetailsPresenter } from '../../presenters/affiliate/affiliate-promotion-code-details-presenter';
import { ListAffiliatePromotionCodesUseCase } from '@/domains/main/application/modules/affiliates/use-cases/list-affiliate-promotion-codes-use-case';

export async function listAffiliatePromotionCodesController(request: FastifyRequest, reply: FastifyReply) {
	const { redemption_status } = request.query as IListAffiliatePromotionCodesQuery;

	const session = getAuthenticatedSession(request);

	const service = container.resolve(ListAffiliatePromotionCodesUseCase);

	const result = await service.execute({
		userId: session.userId,
		redemptionStatus: redemption_status,
	});

	if (result.isFalse()) {
		throw result.value;
	}

	const response = {
		promotion_codes: result.value.affiliatePromotionCodes.map(AffiliatePromotionCodeDetailsPresenter.toHTTP),
	};

	return reply.status(200).send(response);
}
